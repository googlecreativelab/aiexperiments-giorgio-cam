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
import AudioBuffer from 'Tone/core/Buffer'
import MusicPosition from 'music/Position'
import Player from 'Tone/source/Player'
import Sequence from 'Tone/event/Sequence'
import Config from 'Config'

const openingLines = [
	{text : 'H h here we go', url : 'herewego.mp3'},
	{text : 'y y y-y yeah' , url : 'yeah.mp3'},
	{text : 'a alright', url : 'alright.mp3'},
	{text : 'yeah yeah yeah yeah yeah-yeah yeah-yeah yeah-yeah yeah-yeah', url : 'yeahup.mp3'},
	{text : 'here we go go go go go-go go-go go-go go-go', url : 'herewegogo.mp3'},
]

const soundEffects = new Player({url : 'audio/siren.mp3', volume : -6}).toMaster()

const waitingLines = ['I\'m on it', 'Alright', 'Working on it', 'Almost there', 'Working on it', 'Almost there']

export default class Wait {
	constructor(){

		// this._loop = new Loop(this._speak.bind(this), '1m')
		// this._loop.mute = true

		this._phraseIndex = 0

		this._phrases = []
		openingLines.forEach((desc, i) => {
			const text = desc.text
			if (desc.url){
				const buffer = new AudioBuffer(`audio/voice/${desc.url}`)
				this._phrases[i] = {text, buffer}
			} else {
				SpeakBuffer.getBuffer(text, 1.2, 2.5).then((buffer) => {
					this._phrases[i] = {text, buffer}
				})	
			}
		})

		waitingLines.forEach((text, i) => {
			SpeakBuffer.getBuffer(text, 1.2, 2).then((buffer) => {
				waitingLines[i] = {text, buffer}
			})	
		})
		this._waitSequence = new Sequence(this._playNextWait.bind(this), [0, 1, 2, 3, 4, 5], '1m')
	}

	start(){
		let phrase = this._phrases[MusicPosition.position - 1]
		SpeakBuffer.play(phrase.text, phrase.buffer, Time('@4n + 4n'), 'wait')
		if (MusicPosition.position >= 4){
			soundEffects.start('@4n + 4n')
		}
		this._waitSequence.start('@1m + 1m')
	}

	stop(){
		if (soundEffects.state === 'started'){
			soundEffects.stop(`@${Config.quantizeLevel}`)
		}
		this._waitSequence.stop()
		SpeakBuffer.stop(`@${Config.quantizeLevel}`)
	}

	_chooseRandom(){
		let randIndex = Math.floor(Math.random() * this._phrases.length)
		if (randIndex === this._phraseIndex){
			return this._chooseRandom()
		} else {
			return randIndex
		}
	}

	_playNextWait(time, index){
		const phrase = waitingLines[index]
		SpeakBuffer.play(phrase.text, phrase.buffer, Time(time), 'wait')
	}

	_speak(time){
		//choose a phrase at random
		let phrase = this._phrases[this._phraseIndex]
		SpeakBuffer.play(phrase.text, phrase.buffer, Time(time), 'wait')
		this._phraseIndex = (this._phraseIndex + 1) % this._phrases.length
		// this._phraseIndex = this._chooseRandom()
	}
}