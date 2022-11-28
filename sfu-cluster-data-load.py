from pyspark import SparkConf, SparkContext
import sys
import json
assert sys.version_info >= (3, 5) # make sure we have Python 3.5+
from pyspark.sql import SparkSession
from pyspark.sql.types import StringType,DateType,StructType,StructField
from datetime import datetime
from pyspark.sql.functions import col

import uuid

def remove_corrupt(input):
    try:
        return json.loads(input)
    except Exception as e:
        pass

def get_client_analytics(value):
        client_analytics = value['clientAnalytics']
        return client_analytics

def pre_process_usage(val_client_analytics):
    unix_time_stamp = val_client_analytics['unixTimestampUTC']
    year = datetime.fromtimestamp(unix_time_stamp/1000).year
    if year>2014:
        brackets_uuid = val_client_analytics['uuid']
        continent = val_client_analytics['geolocation']['continent']
        country = val_client_analytics['geolocation']['country']
        date = datetime.fromtimestamp(unix_time_stamp/1000).date()
        events = val_client_analytics['events']
        for usage_type in list(events['usage'].keys()):
            if usage_type=='fileOpen':
                for language in list(events['usage']['fileOpen'].keys()):
                    yield [str(uuid.uuid4()),brackets_uuid,usage_type,language,continent,country,date]
            else:
                yield [str(uuid.uuid4()),brackets_uuid,usage_type,"",continent,country,date]

def pre_process_summary(val_client_analytics):
    unix_time_stamp = val_client_analytics['unixTimestampUTC']
    year = datetime.fromtimestamp(unix_time_stamp/1000).year
    if year>2014:
        brackets_uuid = val_client_analytics['uuid']
        continent = val_client_analytics['geolocation']['continent']
        country = val_client_analytics['geolocation']['country']
        date = datetime.fromtimestamp(unix_time_stamp/1000).date()
        events = val_client_analytics['events']
        platform = list(events['PLATFORM']['os'].keys())[0]
        if 'THEMES' in events:
            theme = list(events['THEMES']['bracketsTheme'].keys())[0]     
            yield [str(uuid.uuid4()),brackets_uuid,platform,theme,continent,country,date]
        else:
            yield [str(uuid.uuid4()),brackets_uuid,platform,"",continent,country,date]

def get_client_analytics_with_events(val_client_analytics):
    if 'events' in val_client_analytics:
        return val_client_analytics

def get_events_with_usage(val_client_analytics):
        # if any(k in events for k in ("usage","PLATFORM")):
    if 'usage' in val_client_analytics['events']:
        return val_client_analytics

def get_events_with_platform(val_client_analytics):
        # if any(k in events for k in ("usage","PLATFORM")):
    if 'PLATFORM' in val_client_analytics['events']:
        return val_client_analytics

def get_usage_schema():
    return StructType([
        StructField('uuid', StringType(), True),
        StructField('brackets_uuid', StringType(), True),
        StructField('usage_type', StringType(), True),
        StructField('language', StringType(), True),
        StructField('continent', StringType(), True),
        StructField('country', StringType(), True),
        StructField('date', DateType(), True)
        ])

def get_summary_schema():
    return StructType([
        StructField('uuid', StringType(), True),
        StructField('brackets_uuid', StringType(), True),
        StructField('platform', StringType(), True),
        StructField('theme', StringType(), True),
        StructField('continent', StringType(), True),
        StructField('country', StringType(), True),
        StructField('date', DateType(), True)
        ])

def main(inputs):
    rdd = sc.textFile(inputs).map(remove_corrupt).filter(lambda x:type(x)==dict)
    # sample_rdd = sc.parallelize(rdd.take(100))
    # client_analytics = sample_rdd.flatMap(get_client_analytics).filter(lambda x:((x["events"]!=None if 'events' in x.keys()) and (x["events"]["usage"]!=None or x["events"]["PLATFORM"]!=None)))
    client_analytics = rdd.flatMap(get_client_analytics).filter(get_client_analytics_with_events).cache()
    platform_rdd = client_analytics.filter(get_events_with_platform)
    usage_rdd = client_analytics.filter(get_events_with_usage)
    usage=usage_rdd.flatMap(pre_process_usage)
    df_usage=spark.createDataFrame(usage,get_usage_schema())
    summary=platform_rdd.flatMap(pre_process_summary)
    df_summary=spark.createDataFrame(summary,get_summary_schema())

    # df.select("events","geolocation","unixTimestampUTC","uuid").filter(col("events.usage").isNotNull()).show()
    print(df_usage.count())
    df_usage.show()
    print(df_summary.count())
    df_summary.filter((col("theme")!="dark-theme") & (col("theme")!="light-theme")).show()

    # res = hello.flatMap(lambda x:[x["server_time_stamp_unix"]])
    # print(res.take(10))

if __name__ == '__main__':
    spark = SparkSession.builder.appName('TUBA Spark').getOrCreate()
    assert spark.version >= '3.0' # make sure we have Spark 3.0+
    spark.sparkContext.setLogLevel('WARN')
    sc = spark.sparkContext
    inputs = sys.argv[1]

    main(inputs)