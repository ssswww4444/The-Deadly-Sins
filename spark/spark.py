from pyspark import SparkContext, SparkConf
import json
from Zones import Zones
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
from textblob import TextBlob
import couchdb
from pyspark.sql import SparkSession

def isContent(line: str):
    return line.startswith("{\"i")

def extractContent(line: str):
    line = line.strip(",\n")
    jsondata = json.loads(line)
    return jsondata["doc"]

def hasCoordinates(line):
    if "coordinates" not in line:
        return False
    else:
        return line["coordinates"]

def in_polygon(tweet):
    """
    This function is used to find the corresponding polygon
    for each tweet based on coordinates. The return value is 
    the id of the polygon that each tweet belongs to.
    """
    x = tweet["coordinates"]["coordinates"][0]
    y = tweet["coordinates"]["coordinates"][1]
    
    for zone_id, zone_range in zones.items():
        if (x >= zone_range['min_x'] and x <= zone_range['max_x'] and y >= zone_range['min_y']
            and y <= zone_range['max_y']):
            point = Point(x,y)
            polygon = Polygon(zone_range['coordinates'])
            if polygon.contains(point):
                return zone_id
    return 'unknown'

def negative_tweet(tweet):
    result = TextBlob(tweet['text'])
    if(result.sentiment.polarity < 0):
        return True
    else:
        return False

def find_count(polygon_code, dict):
    if(polygon_code in dict):
        return dict[polygon_code]
    else:
        return 0

# This part is for reading from a local file
# conf = SparkConf().setAppName("test").setMaster("local[*]")
# sc = SparkContext(conf=conf)
# twitter_file = sc.textFile("../../../twitter.json")


# This part is for connecting to couchdb
spark = SparkSession.builder.getOrCreate()

twitter_file = spark.read.format("org.apache.bahir.cloudant")\
    .option("cloudant.protocol", "http")\
    .option("cloudant.host", "45.113.233.243:5984")\
        .option("cloudant.username", "admin")\
            .option("cloudant.password", "123qweasd")\
                .load("twitter_with_loc")

zones = Zones().zones
twitters = twitter_file.rdd

twitter_by_polygon = twitters.map(in_polygon)

num_twitter_by_polygon = twitter_by_polygon.countByValue()

# Writing result back to database
couchserver = couchdb.Server("http://admin:123qweasd@45.113.233.232:5984/")
db = couchserver["job_json"]

tweet_dict = {}
#nega_tweet_dict = {}
for polygon, count in num_twitter_by_polygon.items():
    tweet_dict[polygon] = count

for tweet in db:
    tweet_con = db[tweet]
    for feature in tweet_con["features"]:
        pro = feature["properties"]
        pro["num_tweets"] = find_count(pro["sa2_code16"], tweet_dict)
        #pro["num_negative_tweets"] = find_count(pro["sa2_code16"], nega_tweet_dict)
    db.save(tweet_con)



# twitters = twitter_file.filter(isContent)
# twitter_contents = twitters.map(extractContent)
# twitter_with_coor = twitter_contents.filter(hasCoordinates)
# twitter_by_polygon = twitter_with_coor.map(in_polygon).countByValue()

# for polygon, count in twitter_by_polygon.items():
#     print("{}: {}".format(polygon, count))



#print("The type is {}".format(type(twitter_by_polygon)))

# twitter_negative = twitter_with_coor.filter(negative_tweet)
# twitter_negative_by_polygon = twitter_negative.map(in_polygon)

# num_tweet_by_polygon = twitter_by_polygon.countByValue()
# num_negative_tweet_by_polygon = twitter_negative_by_polygon.countByValue()



# # num_tweet_by_polygon.saveAsTextFile("out/twitter_by_polygon.json")
# # num_negative_tweet_by_polygon.saveAsTextFile("out/twitter_negative_by_polygon.json")
# print("Num of negative tweets in each polygon")

# for polygon, count in num_negative_tweet_by_polygon.items():
#     nega_tweet_dict[polygon] = count





