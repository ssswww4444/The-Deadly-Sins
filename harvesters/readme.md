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

2. From Twitter Stream and Timeline API
```bash
    python3 tweet_mining.py -db "db_name" -re "Victoria"
```
* Arguments: 
    * db: Name of database to store
    * re: Region to harvest (Australia/Victoria)
* StreamAPI: harvest real-time tweets
* User_timeline: harvest tweets from timelines

3. From Twitter Search API
```bash
    python3 tweet_search.py -db "db_name" -q "pizza"
```
* Arguments: 
    * db: Name of database to store
    * q: Query
* Region: Melbourne