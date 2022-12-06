from credentials import aws
import boto3
import json

import sys
assert sys.version_info >= (3, 5) # make sure we have Python 3.5+

from pyspark.sql import SparkSession, functions, types
spark = SparkSession.builder.appName('TUBA User Prediction').getOrCreate()
spark.sparkContext.setLogLevel('WARN')
assert spark.version >= '2.4' # make sure we have Spark 2.4+

from pyspark.ml import Pipeline
from pyspark.ml.feature import PolynomialExpansion, SQLTransformer, VectorAssembler
from pyspark.ml.regression import LinearRegression
from pyspark.ml.evaluation import RegressionEvaluator

import pandas as pd
from itertools import cycle

date_to_days_since_SQL = '''
SELECT datediff(date, '2021-09-01') as day, users FROM __THIS__
'''

def run(inputs, output, platform, country):
    data = spark.read.parquet(inputs)

    #Filter training data if inputs present
    if country != 'None':
        data = data.where(data['country'] == country)
    if platform != 'None':
        data = data.where(data['platform'] == platform)

    train = data.groupBy('date').agg(functions.sum('users').alias('users'))

    # create a pipeline to predict date -> users
    # transform date to days since Sept 1 2021 (Adobe end support)
    date_transformer = SQLTransformer(statement=date_to_days_since_SQL)
    assembler = VectorAssembler(inputCols=['day'], outputCol='day_vec')
    poly_expand = PolynomialExpansion(inputCol='day_vec', outputCol='features', degree=4)
    regressor = LinearRegression(featuresCol='features', labelCol='users')

    user_pipeline = Pipeline(stages=[date_transformer, assembler, poly_expand, regressor])
    user_model = user_pipeline.fit(train)

    # create an evaluator and score the model using R^2
    train_predictions = user_model.transform(train)
    evaluator = RegressionEvaluator(labelCol='users', metricName='r2')
    score = evaluator.evaluate(train_predictions)

    print('Validation score for User model: %g' % (score, ))

    # predict 1 year since last logfile (2022-11-25)
    dates = pd.date_range('2022-11-25', '2023-11-25').date
    test_df = spark.createDataFrame(list(zip(dates, cycle([0]))), ['date', 'users'])
    test_predictions = user_model.transform(test_df).coalesce(1) # num rows = 365 = small data easily stored in driver

    # Write in sample and out of sample predictions
    path = f'{output}/platform={platform}/country={country}'
    train_predictions.write.parquet(f'{path}/type=train')
    test_predictions.write.parquet(f'{path}/type=test')

def run_presistent(inputs, output):
    sqs = boto3.resource('sqs')
    request_queue = sqs.get_queue_by_name(QueueName='DynamicJobRequest')
    response_queue = sqs.get_queue_by_name(QueueName='DynamicJobResponse')

    while True:
        for message in request_queue.receive_messages(WaitTimeSeconds=20):
            params = clean_params(json.loads(message.body))

            print(f'Running with params {params}')
            run(inputs, output, params['Platform'], params['Country'])

            print(f'Finished running job {params["JobId"]}')
            response_queue.send_message(MessageBody = {'JobId':params['JobId'], 'status':'Success'})
            message.delete()

def clean_params(params):
    if params['Platform'] == 'Windows':
        params['Platform'] = 'win'
    elif params['Platform'] == 'Mac':
        params['Platform'] == 'mac'
    return params

if __name__ == '__main__':
    inputs = sys.argv[1]
    output = sys.argv[2]
    mode = sys.argv[3] # If mode = n Normal run once, mode = p Persistent for queue jobs
    platform = sys.argv[4] if len(sys.argv) > 4 else 'None'
    country = sy-s.argv[5] if len(sys.argv) > 5 else 'None'

    if mode == 'n':
        run(inputs, output, platform, country)
    elif mode == 'p':
        run_presistent(inputs, output)
