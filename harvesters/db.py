import couchdb
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
        if "_rev" in tweet:
            tweet.pop("_rev")
        try:
            # save new tweet with coordinates
            if tweet["coordinates"]:
                self.db.save(tweet)
        except:
            # duplication
            pass

    def count_tweets(self):
        """ method for returning view 1 """
        for doc in self.db.view("twitter/count_tweets"):
            return doc.values
    
    def get_tweets(self):
        """ method for returning view 2 """
        return self.db.view("twitter/get_tweets")