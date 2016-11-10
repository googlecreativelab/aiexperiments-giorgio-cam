/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import 'style/main.css'
import Splash from 'interface/Splash'
import Camera from 'camera/Camera'
import Shutter from 'interface/Shutter'
import Music from 'music/Music'
import Voice from 'voice/Voice'
import Text from 'voice/Text'
import Config from 'Config'
import Close from 'interface/Close'
import OrientationListener from 'interface/Orientation'
import NoCamera from 'interface/NoCamera'
import About from 'interface/About'
import MusicPosition from 'music/Position'
import WhenVisible from 'Visible'


// set the title
document.title = Config.name

const camera = new Camera(document.body)
const shutter = new Shutter(document.body)
const splash = new Splash(document.body)
const closeButton = new Close(document.body)
const about = new About(document.body)

const music = new Music()
const voice = new Voice()


splash.on('start', () => {

	Text.appendTo(document.body)

	camera.open().then( () => {
		closeButton.show()
		const time = music.start()
		return voice.intro(time)
	}).then( () => {
		voice.fill()
		shutter.show()
	}).catch((e) => {
		NoCamera(document.body)
	})
})

splash.on('about', () => {
	about.open()
})

closeButton.on('about', () => {
	about.open()
})

closeButton.on('click', () => {
	Text.clear()
	voice.stop()
	music.stop()
	camera.close().then( () => {
		closeButton.end()
	})
	shutter.remove()
})

let retries = 0

shutter.on('click', () => {

	//increment the position
	MusicPosition.position++

	music.fill()
	voice.endFill()

	camera.takePicture()

	camera.label().then((labels) => {

		return voice.load(labels)

	}).then((lines) => {
		// this is so the music doesn't drop out when the transition happens
		// while in a background tab
		return WhenVisible(lines)
	}).then((lines) => {

		voice.endWait()

		return music.endFill().then( (time) => {
			camera.bounce()
			return voice.speak(lines, time)
		})

	}).then(() => {
		voice.fill()
		shutter.show()
		return camera.resume()
	}).then(() => {
		//ENDING
		if (MusicPosition.end){
			Text.clear()
			camera.end().then(() => {
				camera.close()
				closeButton.end()
			})
			music.end()
			closeButton.hide()
			shutter.remove()
		}
	}).catch((err) => {

		WhenVisible().then(() => {
			// errorr!!!
			console.log(err)

			MusicPosition.position--
			Text.clear()
			voice.endWait()
			
			retries++
			if (retries > 2){
				camera.error()
				closeButton.hide()
				voice.error().then(() => {
					closeButton.end()				
				})
				music.stop()
			} else {

				music.endFill().then((time) => {
					return voice.tryAgain(time)
				}).then( () => {
					camera.resume()
					shutter.show()
				})
			}
		})
	})
})