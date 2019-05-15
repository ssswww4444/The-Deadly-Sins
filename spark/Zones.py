import sys
import json
import couchdb
"""
COMP90024 Assignment 2
Team: 48
City: Melbourne
Members: Wenqi Sun(928630), Yunlu Wen(869338), Fei Zhou(972547) 
Pei-Yun Sun(667816), Yiming Zhang(889262)
"""

class Zones:
    """
    This class is to set up the polygon information matrices
    """
    def __init__(self):
        couchserver = couchdb.Server("http://admin:123qweasd@45.113.233.243:5984/")
        db = couchserver["homeless_json"]

        # zone_file = '../../job_json.json'
        # with open(zone_file, 'r') as zone_file:
        #     zone_json = json.load(zone_file)
        for index in db:
            zone_json = db[index]
        self.zones = {}
        for zone in zone_json['features']:
            id = zone['properties']['sa2_main16']
            self.zones[id] = {'min_x': sys.maxsize, 'max_x': -sys.maxsize, 'min_y': sys.maxsize,
                              'max_y': -sys.maxsize, 'coordinates': zone['geometry']['coordinates'][0][0]}
            for coordinate in zone['geometry']['coordinates'][0][0]:
                self.zones[id]['min_x'] = min(self.zones[id]['min_x'], coordinate[0])
                self.zones[id]['max_x'] = max(self.zones[id]['max_x'], coordinate[0])
                self.zones[id]['min_y'] = min(self.zones[id]['min_y'], coordinate[1])
                self.zones[id]['max_y'] = max(self.zones[id]['max_y'], coordinate[1])
