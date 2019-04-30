import couchdb
from TwitterAPI.TwitterAPI import TwitterAPI
from couchdb import design

class TweetStore(object):

    def __init__(self, dbname, url):
        """ create a tweet store(db) or open an existing db """
        try:
            self.server = couchdb.Server(url=url)
            # new db
            self.db = self.server.create(dbname)
            # initialise views
            self._create_views()
        except couchdb.http.PreconditionFailed:
            # existing db
            self.db = self.server[dbname]
    
    def _create_views(self):
        """ create 2 views for the database """

        # view 1: return total count of tweets
        count_map = "function(doc) { emit(doc.id,1); }"
        count_reduce = "function(keys, values) { return sum(values); }"
        view = design.ViewDefinition("twitter",       # design document
                                     "count_tweets",  # view name
                                     count_map,       # map
                                     reduce_fun=count_reduce)
        
        view.sync(self.db)

        # view 2: return all stored tweet documents
        get_tweets = "function(doc) { emit(('0000000000000000000' + doc.id).slice(-19), doc); }"
        view = design.ViewDefinition("twitter",
                                     "get_tweets",
                                     get_tweets)
        view.sync(self.db)

    def save_tweet(self, tweet):
        """ save tweet returned by twitter with tweet id as doc_id """
        tweet["_id"] = tweet["id_str"]
        # save new tweet document
        try:
            self.db.save(tweet)
        except:
            pass

    def count_tweets(self):
        """ method for returning view 1 """
        for doc in self.db.view("twitter/count_tweets"):
            return doc.values
    
    def get_tweets(self):
        """ method for returning view 2 """
        return self.db.view("twitter/get_tweets")

def main():
    # mining
    # Twitter authentication credentials
    API_KEY = "lmi60axPXTB1XZc7Us7o3PKWE"
    API_SECRET = "gMkhRWPnnwcUpNhg2QqsADuLC4PR66opqlX1J6srpfBONunR7X"
    ACCESS_TOKEN = "1107074333698981889-bzffZA2f5djoFeV30veP1oHBLNXeab"
    ACCESS_TOKEN_SECRET = "CMckhw2NaULIqKnp5DcIqcwJaE1nAyfT2SMqzbnxllGoY"

    # db url
    url = "http://admin:123qweasd@45.113.233.232:5984/"

    # initialise db and twitter api
    storage = TweetStore("aus_twitter_db", url)
    api = TwitterAPI(API_KEY, API_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET)

    # requesting tweets (in bounding box of Victoria)
    for item in api.request("statuses/filter", {"locations": "96.81676569599999, -43.740509603, 159.109219008, -9.142175977"}):
        if "text" in item:
            print('%s -- %s\n' % (item['user']['screen_name'], item['text']))
            # save tweet to database
            storage.save_tweet(item)
        elif 'message' in item:
            print('ERROR %s: %s\n' % (item['code'], item['message']))

if __name__ == "__main__":
    main()