"""
COMP90024 Assignment 2
Team: 48
City: Melbourne
Members: Wenqi Sun(928630), Yunlu Wen(869338), Fei Zhou(972547) 
Pei-Yun Sun(667816), Yiming Zhang(889262
"""

#running command --packages org.apache.bahir:spark-sql-cloudant_2.11:2.3.2 --driver-memory 4g
from pyspark import SparkContext, SparkConf
import json
from Zones import Zones
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
import couchdb
from pyspark.sql import SparkSession
import requests
import operator
import nltk
# nltk.download("stopwords")
# nltk.download('averaged_perceptron_tagger')
# nltk.download('wordnet')
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize.casual import TweetTokenizer
import re
from collections import Counter
from nltk import pos_tag
import numpy as np
import pandas as pd
from os import path
from PIL import Image
from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator
import matplotlib.pyplot as plt

NEGATIVE_FEAR = 0
AMUSEMENT = 1
ANGER = 2
ANNOYANCE = 3
INDIFFERENCE = 4
JOY = 5
AWE = 6
SADNESS = 7

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()
tokenizer = TweetTokenizer(preserve_case=False)

def read_from_db():
    spark = SparkSession.builder.getOrCreate()#45.113.233.243:5984

    twitter_file = spark.read.format("org.apache.bahir.cloudant")\
        .option("cloudant.protocol", "http")\
        .option("cloudant.host", "45.113.233.243:5984")\
            .option("cloudant.username", "admin")\
                .option("cloudant.password", "123qweasd")\
                    .load("twitter_with_loc")
    return twitter_file.rdd

def read_from_file():
    conf = SparkConf().setAppName("test").setMaster("local[*]")
    sc = SparkContext(conf=conf)
    twitter_file = sc.textFile("../../../big_twitter_processed.json")
    twitter_file = twitter_file.filter(isContent)
    twitter_file = twitter_file.map(extractContent)
    return twitter_file

def isContent(line):
    return line.startswith("{\"i")

def extractContent(line):
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

def map_polygon_polarity(tweet):
    """
    This function is used to find the corresponding polygon
    for each tweet based on coordinates. The return value is 
    the id of the polygon that each tweet belongs to.
    """
    x = tweet["coordinates"]["coordinates"][0]
    y = tweet["coordinates"]["coordinates"][1]
    try:
        polarity = tweet["textblob"]["polarity"]
    except TypeError:
        polarity = 0
    
    for zone_id, zone_range in zones.items():
        if (x >= zone_range['min_x'] and x <= zone_range['max_x'] and y >= zone_range['min_y']
            and y <= zone_range['max_y']):
            point = Point(x,y)
            polygon = Polygon(zone_range['coordinates'])
            if polygon.contains(point):
                return (zone_id, polarity)
    return ('unknown', polarity)

def max_emotion(tweet):
    max_score = 0
    max_index = -1
    for i in range(8):
        if tweet["senpy"]["entries"][0]["onyx:hasEmotionSet"][0]["onyx:hasEmotion"][i]["onyx:hasEmotionIntensity"] > max_score:
            max_score = tweet["senpy"]["entries"][0]["onyx:hasEmotionSet"][0]["onyx:hasEmotion"][i]["onyx:hasEmotionIntensity"]
            max_index = i
    return max_index

def contain_senpy(tweet):
    if "senpy" in tweet:
        return True
    else:
        return False

def contain_react(tweet):
    if "react" in tweet:
        return True
    else:
        return False

def contain_textblob(tweet):
    if "textblob" in tweet:
        return True
    else:
        return False

def is_negative(tweet):
    if tweet["textblob"][0] < 0:
        return True
    else:
        return False

def is_neutral(tweet):
    if tweet["textblob"][0] == 0:
        return True
    else:
        return False

def is_love(tweet):
    if max(tweet["react"].items(), key=operator.itemgetter(1))[0] == "love":
        return True
    else:
        return False

def is_wow(tweet):
    if "wow" == max(tweet["react"].items(), key=operator.itemgetter(1))[0]:
        return True
    else:
        return False

def is_haha(tweet):
    if "haha" == max(tweet["react"].items(), key=operator.itemgetter(1))[0]:
        return True
    else:
        return False

def is_sad(tweet):
    if "sad" == max(tweet["react"].items(), key=operator.itemgetter(1))[0]:
        return True
    else:
        return False

def is_angry(tweet):
    if "angry" == max(tweet["react"].items(), key=operator.itemgetter(1))[0]:
        return True
    else:
        return False

def is_emotion_type(tweet, type):
    if type == max_emotion(tweet):
        return True
    else:
        return False

def is_negative_fear(tweet):
    return is_emotion_type(tweet, NEGATIVE_FEAR)

def is_amusement(tweet):
    return is_emotion_type(tweet, AMUSEMENT)

def is_anger(tweet):
    return is_emotion_type(tweet, ANGER)

def is_annoyance(tweet):
    return is_emotion_type(tweet, ANNOYANCE)

def is_indifference(tweet):
    return is_emotion_type(tweet, INDIFFERENCE)

def is_joy(tweet):
    return is_emotion_type(tweet, JOY)

def is_awe(tweet):
    return is_emotion_type(tweet, AWE)

def is_sadness(tweet):
    return is_emotion_type(tweet, SADNESS)


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
        # if pos not in nouns:
        #     continue

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

twitters = read_from_file()

textblob = twitters.filter(has_coordinates)
textblob.cache()

polarity_info = textblob.map(map_polygon_polarity)
result = polarity_info.reduceByKey(lambda a, b: a+b).collect()

output = {}
polarity = {}

for item in result:
    polarity[item[0]] = item[1]

output["polarity"] = polarity

couchserver = couchdb.Server("http://admin:123qweasd@45.113.233.243:5984/")
db = couchserver["spark_results"]
db["big_twitter_processed_polarity"] = output


# output["tweets_num"] = textblob.count()
# output["total_info"] = fill_dict(textblob.map(in_polygon).countByValue())

# output["negative_tweets_num"] = textblob.filter(is_negative).count()
# output["negative_word_freq"] = get_word_freq(textblob.filter(is_negative).map(word_count).reduce(lambda a, b: a+b))
# output["negative_info"] = fill_dict(textblob.filter(is_negative).map(in_polygon).countByValue())

# output["neutral_tweets_num"] = textblob.filter(is_neutral).count()
# output["neutral_word_freq"] = get_word_freq(textblob.filter(is_neutral).map(word_count).reduce(lambda a, b: a+b))
# output["neutral_info"] = fill_dict(textblob.filter(is_neutral).map(in_polygon).countByValue())

# output["love_tweets_num"] =  react.filter(is_love).count()
# output["love_word_freq"] = get_word_freq(react.filter(is_love).map(word_count).reduce(lambda a, b: a+b))
# output["love_info"] = fill_dict(react.filter(is_love).map(in_polygon).countByValue())

# output["haha_tweets_num"] =  react.filter(is_haha).count()
# output["haha_word_freq"] = get_word_freq(react.filter(is_haha).map(word_count).reduce(lambda a, b: a+b))
# output["haha_info"] = fill_dict(react.filter(is_haha).map(in_polygon).countByValue())

# output["sad_tweets_num"] =  react.filter(is_sad).count()
# output["sad_word_freq"] = get_word_freq(react.filter(is_sad).map(word_count).reduce(lambda a, b: a+b))
# output["sad_info"] = fill_dict(react.filter(is_sad).map(in_polygon).countByValue())

# output["wow_tweets_num"] =  react.filter(is_wow).count()
# output["wow_word_freq"] = get_word_freq(react.filter(is_wow).map(word_count).reduce(lambda a, b: a+b))
# output["wow_info"] = fill_dict(react.filter(is_wow).map(in_polygon).countByValue())

# output["angry_tweets_num"] =  react.filter(is_angry).count()
# output["angry_word_freq"] = get_word_freq(react.filter(is_angry).map(word_count).reduce(lambda a, b: a+b))
# output["angry_info"] = fill_dict(react.filter(is_angry).map(in_polygon).countByValue())



# output["anger_tweets_num"] =  textblob.filter(is_anger).count()
# output["anger_word_freq"] = get_word_freq(textblob.filter(is_anger).map(word_count).reduce(lambda a, b: a+b))
# output["anger_info"] = fill_dict(textblob.filter(is_anger).map(in_polygon).countByValue())
# output["amusement_tweets_num"] = textblob.filter(is_amusement).count()
# output["amusement_word_freq"] = get_word_freq(textblob.filter(is_amusement).map(word_count).reduce(lambda a, b: a+b))
# output["amusement_info"] = fill_dict(textblob.filter(is_amusement).map(in_polygon).countByValue())
# output["annoyance_tweets_num"] = textblob.filter(is_annoyance).count()
# output["annoyance_word_freq"] = get_word_freq(textblob.filter(is_annoyance).map(word_count).reduce(lambda a, b: a+b))
# output["annoyance_info"] = fill_dict(textblob.filter(is_annoyance).map(in_polygon).countByValue())
# output["negative_fear_tweets_num"] = textblob.filter(is_negative_fear).count()
# output["negative_fear_word_freq"] = get_word_freq(textblob.filter(is_negative_fear).map(word_count).reduce(lambda a, b: a+b))
# output["negative_fear_info"] = fill_dict(textblob.filter(is_negative_fear).map(in_polygon).countByValue())
# output["indifference_tweets_num"] = textblob.filter(is_indifference).count()
# output["indifference_word_freq"] = get_word_freq(textblob.filter(is_indifference).map(word_count).reduce(lambda a, b: a+b))
# output["indifference_info"] = fill_dict(textblob.filter(is_indifference).map(in_polygon).countByValue())
# output["joy_tweets_num"] = textblob.filter(is_joy).count()
# output["joy_word_freq"] = get_word_freq(textblob.filter(is_joy).map(word_count).reduce(lambda a, b: a+b))
# output["joy_info"] = fill_dict(textblob.filter(is_joy).map(in_polygon).countByValue())
# output["awe_tweets_num"] = textblob.filter(is_awe).count()
# output["awe_word_freq"] = get_word_freq(textblob.filter(is_awe).map(word_count).reduce(lambda a, b: a+b))
# output["awe_info"] = fill_dict(textblob.filter(is_awe).map(in_polygon).countByValue())
# output["sadness_tweets_num"] = textblob.filter(is_sadness).count()
# output["sadness_word_freq"] = get_word_freq(textblob.filter(is_sadness).map(word_count).reduce(lambda a, b: a+b))
# output["sadness_info"] = fill_dict(textblob.filter(is_sadness).map(in_polygon).countByValue())




# with open('test.json', 'w') as fp:
#     json.dump(output, fp)

# stopwords = set(STOPWORDS)
# stopwords.update(["drink", "now", "wine", "flavor", "flavors"])
# wordcloud = WordCloud(stopwords=stopwords, max_font_size=50, max_words=100, background_color="white")
# cloud = wordcloud.generate_from_frequencies(dict(final_counter))

# wordcloud.to_file("anger.png")

