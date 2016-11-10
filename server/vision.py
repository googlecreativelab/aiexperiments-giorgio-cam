#!/usr/bin/env python
#
# Copyright 2016 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


import webapp2
import urllib2
import json

import base64

from google.appengine.ext import vendor
vendor.add('server/lib')

import re
from googleapiclient import discovery
from oauth2client.client import GoogleCredentials

# remove these things cause it could be taken the wrong way
DISCOVERY_URL='https://{api}.googleapis.com/$discovery/rest?version={apiVersion}'

class VisionApi(webapp2.RequestHandler):
    def __init__(self, request, response):
        # Set self.request, self.response and self.app.
        self.initialize(request, response)
        self.vision = self._create_client()

    def _create_client(self):
        credentials = GoogleCredentials.get_application_default()
        return discovery.build(
            'vision', 'v1', credentials=credentials,
            discoveryServiceUrl=DISCOVERY_URL)

    def _label(self, image, max_results=10, num_retries=2):
        """
        Uses the Vision API to detect text in the given file.
        """

        label_request = {
            'image': {
                'content': image
            },
            'features': [{
                'type': 'LABEL_DETECTION',
                'maxResults': max_results,
            }]
        }

        request = self.vision.images().annotate(body={'requests': [label_request]})
        response = request.execute(num_retries=num_retries)['responses'][0]
        labels_raw = response.get('labelAnnotations', [])
        print labels_raw
        error = response.get('error', [])
        if len(labels_raw):
            filtered = [r for r in labels_raw if float(r['score']) > 0.1]
            labels = [{'label' : str(x['description']), 'score' : float(x['score'])} for x in filtered]
            return labels
        elif len(error):
            return {'error' : error}
        else:
            return []


    def post(self):
        image = self.request.POST.multi['image']
        labels = self._label(image)
        self.response.out.write(json.dumps(labels))


app = webapp2.WSGIApplication([
    ('.*', VisionApi)
], debug=True)