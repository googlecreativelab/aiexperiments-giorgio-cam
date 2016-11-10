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

import SpeakBuffer from 'voice/SpeakBuffer'
import Loop from 'Tone/event/Loop'
import Time from 'Tone/type/Time'
import Lines from 'voice/Lines'
import MusicPosition from 'music/Position'

//special thanks to giorgio moroder, here he is on the vocoder

const fillerPhrases = [
	['Snap a photo', 'I am ready', 'Waiting for you'],
	['Okay what else?', 'Turn it up', 'Yeah', 'Snap another', 'Image Recognition, yeah'],
	['Turn it up', 'Speech Synthesis, yeah', 'Don\'t stop', 'This is Awesome'],
	['Woah', 'Keep it going', 'Take another',  'This is Crazy'],
	['One more time', 'Last one', 'Alright', 'Yeah'],
	['That was awesome', 'I am shutting down'],
]

export default class Filler {
	constructor(){

		this._loop = new Loop(this._speak.bind(this), '2m')

		this._phraseIndex = -1

		this._phrases = []

		fillerPhrases.forEach((phrases, i) => {
			this._phrases[i] = []
			phrases.forEach((text, j) => {
				SpeakBuffer.getBuffer(text, 1.3, 2).then( (buffer) => {
					this._phrases[i][j] = {text, buffer}
				})
			})
		})
	}

	start(){
		if (this._loop.state === 'stopped'){
			this._phraseIndex = 0
			if (MusicPosition.end){
				this._loop.interval = '1m'
			}
			if (MusicPosition.position === 0){
				this._loop.start("@1m + 1m")
			} else {
				this._loop.start("@1m")
			}
		}
	}

	stop(){
		this._loop.stop()
	}

	_chooseRandom(){
		//randomness excludes the first result
		const random = Math.floor(Math.random() * (this._phrases[MusicPosition.fillerTextPosition].length - 1)) + 1
		if (random === this._phraseIndex){
			return this._chooseRandom()
		} else {
			return random
		}

	}

	_speak(time){
		const phrase = this._phrases[MusicPosition.fillerTextPosition][this._phraseIndex]
		if (phrase){
			SpeakBuffer.play(phrase.text, phrase.buffer, Time(time), 'fill')
			if (MusicPosition.end){
				this._phraseIndex++
				this._loop.stop('+2m + 4n')
			} else {
				this._phraseIndex = this._chooseRandom()
			}
		}
	}
}