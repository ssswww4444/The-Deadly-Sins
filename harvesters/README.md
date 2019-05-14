# Harvesters
Maintainer:
- Pei-Yun Sun \<peiyuns@student.unimelb.edu.au\>

## Requirements
Use pip3 install:
1. TwitterAPI
2. couchdb

## File structure
```
Harvesting/
├── bash_files
│   ├── curl_by_date.sh      -> RESTful API to get tweets by date
│   └── curl_by_loc.sh       -> RESTful API to get tweets by location
├── json_files
│   ├── twitterAPI_auth.json -> Twitter API authentication credentials
│   ├── db_auth.json         -> CouchDB authentication
│   ├── bounding_box.json    -> Bounding box of Victoria and Australia
│   └── json_generator.py    -> Program for generating json files
│── add_senpy.py             -> Add senpy results to documents in a DB
│── curl_save.py             -> Use RESTful API to get tweets from remote DB and save
│── tweet_search.py          -> Tweet searching in Melbourne
│── db.py                    -> Connect to CouchDB
│── tweet_mining.py          -> Tweet streaming and getting user timeline
└── README.md                -> Readme
```

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
