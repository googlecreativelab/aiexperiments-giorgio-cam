## Giorgio Cam
Take a picture to make music with the computer.

## About

This is an experiment built with machine learning that lets you make music with the computer just by taking a picture. It uses image recognition to label what it sees, then it turns those labels into lyrics of a song.

[https://aiexperiments.withgoogle.com/giorgio-cam](https://aiexperiments.withgoogle.com/giorgio-cam)

This is not an official Google product.

## Credits

Built by [Eric Rosenbaum](https://github.com/ericrosenbaum), [Yotam Mann](https://github.com/tambien), and friends at Google Creative Lab using [MaryTTS](https://github.com/marytts/marytts), [Tone.js](https://github.com/Tonejs/Tone.js), and [Google Cloud Vision API](https://cloud.google.com/vision/). Check out more at [A.I. Experiments] (https://aiexperiments.withgoogle.com).

## Overview

The client-side javascript application captures images using WebRTC. When the user hits the shutter button, an image is sent to the server which then returns an array of labels and confidence scores for that image using Cloud Vision. These labels are dropped into a rhyming template to create the next phrase that the computer will speak. To get the audio of that phrase, the client makes another request to the MaryTTS (text to speech) server which returns a wav file of the audio. That audio is then synced to the music using Tone.js.

## FRONT-END

To build the client-side javascript, first install [node](https://nodejs.org) and [webpack](https://webpack.github.io/). Then you can install of the dependencies of the project by typing the following in the terminal: 

```bash
cd static
npm install
```

Then build all of the files

```bash
webpack -p
```

## Back-end

The back-end uses [Google App Engine](https://cloud.google.com/appengine/) to serve static content and mediate between the two other back-end services: Google Cloud Vision and MaryTTS. 

#### Google Cloud Vision API

You will need to first enable the API and [generate credentials](https://cloud.google.com/vision/docs/common/auth). Under "Key type", use "JSON" and then download the key.json file. 

Add your json key to the `env_variables` section of your `.yaml` file like so:

```yaml
env_variables:
  GOOGLE_APPLICATION_CREDENTIALS: PATH/TO/CLOUD_VISION_KEY.json
```

#### MaryTTS

Download and install [MaryTTS](https://github.com/marytts/marytts). Then run the MaryTTS Server. Add the IP Adress and Port number that MaryTTS is running on to `server/mary.py`. The default location is `http://localhost:59125`

```python
MARY_TTS_URL = 'http://127.0.0.1'
MARY_TTS_PORT = '59125'
```

#### App Engine

To install the dependencies so they can be launched within Google App Engine they will need to be installed into a local folder (documented [here](https://cloud.google.com/appengine/docs/python/tools/using-libraries-python-27)).

```bash
cd server
mkdir lib
pip install -t lib -r requirements.txt
```

Then [follow instructions](https://cloud.google.com/appengine/docs/python/quickstart) on launching your App Engine code. 

## Music

[Racer](https://www.youtube.com/watch?v=YT0k99hCY5I) by [Giorgio Moroder](https://en.wikipedia.org/wiki/Giorgio_Moroder)


## License

Copyright 2016 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
