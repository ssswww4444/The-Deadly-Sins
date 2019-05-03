from pyspark import SparkContext, SparkConf
import json
from Zones import Zones
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

conf = SparkConf().setAppName("test").setMaster("local[*]")
sc = SparkContext(conf=conf)
twitter_file = sc.textFile("../../twitter.json")


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

zones = Zones().zones
twitters = twitter_file.filter(isContent)
twitter_contents = twitters.map(extractContent)
twitter_with_coor = twitter_contents.filter(hasCoordinates)
twitter_by_polygon = twitter_with_coor.map(in_polygon)
num_tweet_by_polygon = twitter_by_polygon.countByValue()


print("NUM of twitters: {}".format(twitter_contents.count()))
print("NUM of twitters with coor: {}".format(twitter_with_coor.count()))
for polygon, count in num_tweet_by_polygon.items():
    print("{}, {}".format(polygon, count))
