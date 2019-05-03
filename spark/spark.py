from pyspark import SparkContext, SparkConf
import json
from Zones import Zones
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

conf = SparkConf().setAppName("test").setMaster("local[*]")
sc = SparkContext(conf=conf)
twitter_file = sc.textFile("../../twitter.json")

import pickle
import nltk
import re
nltk.download("stopwords")
from nltk.corpus import stopwords
from nltk.tokenize.casual import TweetTokenizer
from nltk.stem import WordNetLemmatizer
import emoji

nltk.download("wordnet", "/Users/wenqisun/nltk_data/")
nltk.data.path.append("/Users/wenqisun/Downloads/nltk_data/")

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# load in classifier and vectorizer
logistic_clf = pickle.load(open("../../Logistic_{C0.1}_{l1}.pk1", "rb"))  
vec = pickle.load(open("../../DictVectorizer.pk1", "rb"))

frequent_symbols = [":)", ":(", ":D", ":-)", ":p", ";)", ":/", "XD"]

# Get array of dictionary according to the list of tweets 
def get_dict(tweets):
    dict_arr = []
    for tweet in tweets:
        tweet_dict = {}
        for word in tweet:
            if word in tweet_dict:
                tweet_dict[word] += 1
            else:
                tweet_dict[word] = 1
        dict_arr.append(tweet_dict)
    return dict_arr

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

def preprocess(tweets):
    new_tweets = []
    for tweet in tweets:
        new_tweet = []
        for word in tokenizer.tokenize(tweet):

            # regular words
            if not (word in stop_words or re.search("[^a-zA-Z]",word)):  # if not stopwords and non-alphabetic
                new_tweet.append(lemmatizer.lemmatize(word))
            
            # hashtags
            elif word[0] == "#":  
                hashtag = handle_hashtag(word)
                if hashtag != -1:
                    new_tweet.append("#" + lemmatizer.lemmatize(hashtag))
            
            # symbols / emojis
            elif word in frequent_symbols or word in emoji.UNICODE_EMOJI:
                new_tweet.append(word)
                
        new_tweets.append(new_tweet)
    
    dict_arr = get_dict(new_tweets)
    return (dict_arr)


# tokenizer will downcase everything except for emoticons
tokenizer = TweetTokenizer(preserve_case=False)


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
    tweet_dicts = preprocess([tweet['text']])
    X = vec.transform(tweet_dicts)
    result = logistic_clf.predict(X)[0]  # 1 for positive, 0 for negative
    if(result == 0):
        return True
    else:
        return False

zones = Zones().zones
twitters = twitter_file.filter(isContent)
twitter_contents = twitters.map(extractContent)
twitter_with_coor = twitter_contents.filter(hasCoordinates)
twitter_by_polygon = twitter_with_coor.map(in_polygon)

twitter_negative = twitter_with_coor.filter(negative_tweet)

num_tweet_by_polygon = twitter_by_polygon.countByValue()


print("NUM of twitters: {}".format(twitter_contents.count()))
print("NUM of twitters with coor: {}".format(twitter_with_coor.count()))
print("NUM of negative twitters: {}".format(twitter_negative.count()))
# for polygon, count in num_tweet_by_polygon.items():
#     print("{}, {}".format(polygon, count))
