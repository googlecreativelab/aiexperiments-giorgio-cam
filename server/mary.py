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
#

import webapp2
import urllib2

from google.appengine.api import memcache

MARY_TTS_URL = 'http://127.0.0.1'
MARY_TTS_PORT = '59125'


class SpeakHandler(webapp2.RequestHandler):
    def maryRequestUrl(self, text, rate, pitch):
        f0_scale = '0.8' if float(pitch) == 0 else '1.5'
        tract_scaler = '0.9'
        f0_add = str(float(pitch) * 10)
        text = urllib2.quote(text.encode("utf-8"))
        urlString = '{0}:{1}/process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT={2}'.format(MARY_TTS_URL, MARY_TTS_PORT, text)
        urlString += '&VOICE_SELECTIONS=cmu-bdl-hsmm%20en_US%20male%20hmm&AUDIO_OUT=WAVE_FILE&LOCALE=en_US&VOICE=cmu-bdl-hsmm&AUDIO=WAVE_FILE'
        # some voice parameters
        urlString += '&effect_F0Scale_selected=on&effect_F0Scale_parameters=f0Scale%3A{0}%3B'.format(f0_scale)
        urlString += '&effect_TractScaler_selected=on&effect_TractScaler_parameters=amount%3A{0}%3B'.format(tract_scaler)
        urlString += '&effect_F0Add_selected=on&effect_F0Add_parameters=f0Add%3A{0}%3B'.format(f0_add)
        urlString += '&effect_Rate_selected=on&effect_Rate_parameters=durScale%3A{0}%3B'.format(str(1 / float(rate)))
        return urlString
    def get(self):
        text = self.request.get('text', default_value='this is a test')
        rate = self.request.get('rate', default_value='1')
        pitch = self.request.get('pitch', default_value='0')

        key = 'text={0} rate={1} pitch={2}'.format(text, rate, pitch)
        print self.maryRequestUrl(text, rate, pitch)
        audio = memcache.get(key)
        if audio is None:
            url = self.maryRequestUrl(text, rate, pitch)
            audio = urllib2.urlopen(url).read()
            four_hours = 60 * 60 * 4
            memcache.add(key, audio, four_hours)
        self.response.headers['Content-Type'] = 'audio/wav'
        self.response.out.write(audio)


app = webapp2.WSGIApplication([
    ('/.*', SpeakHandler)
], debug=True)
