Giorgio Cam combines [Google Cloud Vision API](https://cloud.google.com/vision/) and [MaryTTS](https://github.com/marytts/marytts) to let you make music with your camera. 

This is not an official Google product.

## OVERVIEW

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

## BACK-END

The back-end uses [Google App Engine](https://cloud.google.com/appengine/) to serve static content and mediate between the two other back-end services: Google Cloud Vision and MaryTTS. 

### Google Cloud Vision API

You will need to first enable the API and [generate credentials](https://cloud.google.com/vision/docs/common/auth). Under "Key type", use "JSON" and then download the key.json file. 

Add your json key to the `env_variables` section of your `.yaml` file like so:

```yaml
env_variables:
  GOOGLE_APPLICATION_CREDENTIALS: PATH/TO/CLOUD_VISION_KEY.json
```

### MaryTTS

Download and install [MaryTTS](https://github.com/marytts/marytts). Then run the MaryTTS Server. Add the IP Adress and Port number that MaryTTS is running on to `server/mary.py`. The default location is `http://localhost:59125`

```python
MARY_TTS_URL = 'http://127.0.0.1'
MARY_TTS_PORT = '59125'
```

### App Engine

To install the dependencies so they can be launched within Google App Engine they will need to be installed into a local folder (documented [here](https://cloud.google.com/appengine/docs/python/tools/using-libraries-python-27)).

```bash
cd server
mkdir lib
pip install -t lib -r requirements.txt
```

Then [follow instructions](https://cloud.google.com/appengine/docs/python/quickstart) on launching your App Engine code. 