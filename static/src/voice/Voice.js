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

import Intro from 'voice/Intro'
import Filler from 'voice/Filler'
import Wait from 'voice/Wait'
import Lines from 'voice/Lines'
import SpeakBuffer from 'voice/SpeakBuffer'
import VoiceEffects from 'voice/VoiceEffects'
import Lyrics from 'voice/Lyrics'
import Config from 'Config'
import Transport from 'Tone/core/Transport'
import Time from 'Tone/type/Time'

export default class Voice {
	constructor(){
		this._intro = new Intro()

		this._filler = new Filler()

		this._wait = new Wait()
	}

	intro(time){
		return this._intro.start(time)
	}

	fill(){
		this._filler.start()
	}

	endFill(){
		this._filler.stop()
		this.wait()
	}

	wait(){
		this._wait.start()
	}

	endWait(){
		this._wait.stop()
	}

	stop(){
		VoiceEffects.stop()
		const endLines = Lines.end
		return SpeakBuffer.play(endLines[1].text, endLines[1].buffer, Time(), 'end')
	}

	//speak the error lines
	error(){
		const errorLines = Lines.end
		return SpeakBuffer.play(errorLines[0].text, errorLines[0].buffer, Time('+0:3'), 'end')
			.then(() => {
				// add a little time at the end
				return new Promise((done) => {
					setTimeout(done, 3000)
				})
			})
	}

	tryAgain(time){
		const errorLines = Lines.end
		return SpeakBuffer.play(errorLines[2].text, errorLines[2].buffer, time, 'line')
			.then(() => {
				// add a little time at the end
				return new Promise((done) => {
					setTimeout(done, 600)
				})
			})
	}

	openCamera(){
		const errorLines = Lines.end
		return SpeakBuffer.play(errorLines[3].text, errorLines[3].buffer, Time('+0.1'), 'dry')
			.then(() => {
				// add a little time at the end
				return new Promise((done) => {
					setTimeout(done, 1200)
				})
			})
	}

	/**
	 * Formats the return promise
	 * {
	 * 		text : 'text here',
	 * 		buffer : Tone.Buffer,
	 * 		label : {} // label obj
	 * 	}
	 */
	_loadLine(text, label){
		return SpeakBuffer.getBuffer(text, 1.1, 1).then( (buffer) => {
			return { text, label, buffer }
		})
	}

	/**
	 * Loads the lines, resolves the promise at the beginning of the next phrase. 
	 * Returns both lines in this format:
	 * [
	 * 	{
	 * 		text : 'text here',
	 * 		buffer : Tone.Buffer,
	 * 		label : {} // label obj
	 * 	}
	 * ]
	 */
	load(labels){
		let lyrics = Lyrics.getLine(labels)
		return Promise.all([
			this._loadLine(lyrics.lines[0], lyrics.labels[0]),
			this._loadLine(lyrics.lines[1], lyrics.labels[1])
		])
	}

	_speakLine(line, time){
		return SpeakBuffer.play(line.text, line.buffer, time, 'line', line.label)
	}

	speak(lines, time){
		this._speakLine(lines[0], Time(time))
		return this._speakLine(lines[1], Time(time).add('2m')).then( () => {
			// add a short timeout at the end
			return new Promise((done) => {
				setTimeout(done, 1400)
			})
		})
	}
}