import sys
import json

class Zones:
    """
    This class is to set up the polygon information matrices
    """
    def __init__(self):
        zone_file = '../job_json.json'
        with open(zone_file, 'r') as zone_file:
            zone_json = json.load(zone_file)

        self.zones = {}
        for zone in zone_json['rows'][0]['doc']['features']:
            id = zone['properties']['sa2_code16']
            self.zones[id] = {'min_x': sys.maxsize, 'max_x': -sys.maxsize, 'min_y': sys.maxsize,
                              'max_y': -sys.maxsize, 'coordinates': zone['geometry']['coordinates'][0][0]}
            for coordinate in zone['geometry']['coordinates'][0][0]:
                self.zones[id]['min_x'] = min(self.zones[id]['min_x'], coordinate[0])
                self.zones[id]['max_x'] = max(self.zones[id]['max_x'], coordinate[0])
                self.zones[id]['min_y'] = min(self.zones[id]['min_y'], coordinate[1])
                self.zones[id]['max_y'] = max(self.zones[id]['max_y'], coordinate[1])

