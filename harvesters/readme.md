# Harvesters

## Requirements
Use pip3 install:
1. TwitterAPI
2. couchdb


## Usage
1. From a Remote Database
```bash
    python3 curl_save.py -db "db_name" -y 2018 -m 7
```
* Arguments: 
    * db: Name of database to store
    * y: Year of tweets
    * m: Month of tweets
* Temp file directory: `/mnt/twitter`

2. From Twitter API
```bash
    python3 tweet_mining.py -db "db_name"
```
* Arguments: 
    * db: Name of database to store
* StreamAPI: retrieve real-time tweets
* User_timeline: retrieve tweets from timelines