from pyspark import SparkContext, SparkConf
import json
from Zones import Zones
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
import couchdb
from pyspark.sql import SparkSession
import requests

#--packages org.apache.bahir:spark-sql-cloudant_2.11:2.3.2 --driver-memory 4g

"""
wordcount begins
"""
import nltk
nltk.download("stopwords")
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize.casual import TweetTokenizer
import re
from collections import Counter
from nltk import pos_tag
nltk.download('averaged_perceptron_tagger')
"""
wordcount ends
"""

import numpy as np
import pandas as pd
from os import path
from PIL import Image
from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator
import matplotlib.pyplot as plt

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()
tokenizer = TweetTokenizer(preserve_case=False)

def read_from_db():
    spark = SparkSession.builder.getOrCreate()

    twitter_file = spark.read.format("org.apache.bahir.cloudant")\
        .option("cloudant.protocol", "http")\
        .option("cloudant.host", "45.113.233.243:5984")\
            .option("cloudant.username", "admin")\
                .option("cloudant.password", "123qweasd")\
                    .load("richard_db_with_loc")
    return twitter_file.rdd

def read_from_file():
    conf = SparkConf().setAppName("test").setMaster("local[*]")
    sc = SparkContext(conf=conf)
    twitter_file = sc.textFile("../../richard_db_with_loc.json")
    twitter_file = twitter_file.filter(isContent)
    twitter_file = twitter_file.map(extractContent)
    return twitter_file

def isContent(line: str):
    return line.startswith("{\"i")

def extractContent(line: str):
    line = line.strip(",\n")
    jsondata = json.loads(line)
    return jsondata["doc"]

def has_coordinates(line):
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

def is_anger(tweet):
    if tweet["senpy"]["entries"][0]["onyx:hasEmotionSet"][0]["onyx:hasEmotion"][2]["onyx:hasEmotionIntensity"] > 0.15 \
        or tweet["senpy"]["entries"][0]["onyx:hasEmotionSet"][0]["onyx:hasEmotion"][3]["onyx:hasEmotionIntensity"] > 0.15:
        return True
    else:
        return False

def contain_senpy(tweet):
    if "senpy" in tweet:
        return True
    else:
        return False

def is_annoyance(tweet):
    if "senpy" not in tweet:
        return False
    elif tweet["senpy"]["entries"][0]["onyx:hasEmotionSet"][0]["onyx:hasEmotion"][3]["onyx:hasEmotionIntensity"] > 0.15:
        return True
    else:
        return False

def find_count(polygon_code, dict):
    if(polygon_code in dict):
        return dict[polygon_code]
    else:
        return 0

def fill_dict(polygon_info):
    dictionary = {}
    for polygon, count in polygon_info.items():
        dictionary[polygon] = count
    return dictionary

def handle_hashtag(hashtag):
    i = 0
    while(hashtag[i] == "#"):
        i += 1
        if i == len(hashtag):
            return -1
    
    # multiple hashtags in the word
    if "#" in hashtag[i:]:
        return -1
    
    return hashtag[i:]

def process_one_tweet(tweet):
    
    nouns = ["NN", "NNS", "NNP", "NNPS"]
    
    new_tweet = []
        
    for word, pos in pos_tag(tokenizer.tokenize(tweet)):

        # keep nouns only
        if pos not in nouns:
            continue

        # lowercase
        word = word.lower()

        # regular words
        if not (word in stop_words or re.search("[^a-zA-Z]",word)):  # if not stopwords and non-alphabetic
            new_tweet.append(lemmatizer.lemmatize(word))

        # hashtags
        elif word[0] == "#":  
            hashtag = handle_hashtag(word)
            if hashtag != -1:
                new_tweet.append(lemmatizer.lemmatize(hashtag))

    return Counter(new_tweet)

def word_count(tweet):
    tweet_content = tweet["text"]
    return process_one_tweet(tweet_content)

def get_word_freq(counter):
    dictionary = {}
    for item in counter.most_common(50):
        dictionary[item[0]] = item[1]
    return dictionary



zones = Zones().zones

twitters = read_from_db()

senpy = twitters.filter(contain_senpy)
# coor_twitter = twitters.filter(has_coordinates)
anger_twitter = senpy.filter(is_anger)
anger_twitter.cache()

anger_twitter_by_polygon = anger_twitter.map(in_polygon)


anger_twitter_counter = anger_twitter.map(word_count)

final_counter = anger_twitter_counter.reduce(lambda a, b: a+b)

output = {}
output["tweets"] = senpy.count()
output["anger_tweets"] =  anger_twitter.count()
output["word_freq"] = get_word_freq(final_counter)
output["samples"] = [tweet["text"] for tweet in anger_twitter.takeSample(False, 20)]
output["polygon_info"] = fill_dict(anger_twitter_by_polygon.countByValue())

with open('anger_db.json', 'w') as fp:
    json.dump(output, fp)
print("Writing file finished!")

stopwords = set(STOPWORDS)
stopwords.update(["drink", "now", "wine", "flavor", "flavors"])
wordcloud = WordCloud(stopwords=stopwords, max_font_size=50, max_words=100, background_color="white")
cloud = wordcloud.generate_from_frequencies(dict(final_counter))

wordcloud.to_file("anger.png")

print("End of job")

# Writing result back to database

# couchserver = couchdb.Server("http://admin:123qweasd@45.113.233.243:5984/")
# db = couchserver["job_json"]


# for tweet in db:
#     tweet_con = db[tweet]
#     for feature in tweet_con["features"]:
#         pro = feature["properties"]
#         pro["num_tweets"] = find_count(pro["sa2_code16"], tweet_dict)
#         pro["num_negative_tweets"] = -1
#         pro["num_anger_tweets"] = find_count(pro["sa2_code16"], anger_tweet_dict)
#         pro["num_annoyance_tweets"] = find_count(pro["sa2_code16"], annoyance_tweet_dict)
#     db.save(tweet_con)
