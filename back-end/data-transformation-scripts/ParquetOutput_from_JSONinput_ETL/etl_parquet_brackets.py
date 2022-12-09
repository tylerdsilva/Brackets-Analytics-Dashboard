from pyspark import SparkConf, SparkContext
import sys
import json
assert sys.version_info >= (3, 5) # make sure we have Python 3.5+
from pyspark.sql import SparkSession
from pyspark.sql.types import StringType,DateType,StructType,StructField
from datetime import datetime

def remove_corrupt(input):
    try:
        return json.loads(input)
    except Exception as e:
        pass

def get_client_analytics(value):
        client_analytics = value['clientAnalytics']
        time_stamp=value['unixTimestampUTCAtServer']
        for client_analytic in client_analytics:
            client_analytic['serverTimeStamp']=time_stamp
            yield client_analytic

def get_client_analytics_with_events(val_client_analytics):
    if 'events' in val_client_analytics:
        return val_client_analytics

def get_events_with_usage(val_client_analytics):
    if 'usage' in val_client_analytics['events']:
        return val_client_analytics

def get_events_with_platform(val_client_analytics):
    if 'PLATFORM' in val_client_analytics['events']:
        return val_client_analytics

def main(inputs, output):
    rdd = sc.textFile(inputs).map(remove_corrupt).filter(lambda x:type(x)==dict)
    client_analytics = rdd.flatMap(get_client_analytics).filter(get_client_analytics_with_events).cache()
    platform_rdd = client_analytics.filter(get_events_with_platform)
    usage_rdd = client_analytics.filter(get_events_with_usage)
    print(platform_rdd.take(10))
    print(usage_rdd.take(10))

if __name__ == '__main__':
    spark = SparkSession.builder \
    .appName('TUBA Spark')\
    .getOrCreate()
    assert spark.version >= '3.0' # make sure we have Spark 3.0+
    spark.sparkContext.setLogLevel('WARN')
    sc = spark.sparkContext
    inputs = sys.argv[1]
    output = sys.argv[2]
    main(inputs,output)