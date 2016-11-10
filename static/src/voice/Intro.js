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
import Time from 'Tone/type/Time'
import Lines from 'voice/Lines'
import Config from 'Config'
import AudioBuffers from 'Tone/core/Buffers'

export default class Intro {

	constructor(){
		this._didIntro = false

		this._buffers = ['Ready to rock image recognition with me?', 'Take a picture and I\'ll tell you what i see']
		this._buffers.forEach((text, index) => {
			SpeakBuffer.getBuffer(text, 1.25, -1).then((buffer) => {
				this._buffers[index] = {text, buffer}
			})
		})
		
		/*this._buffers = new AudioBuffers(['readytoexplore.mp3', 'takeapicture.mp3'], undefined, 'audio/voice/')
		this._text = ['Ready to explore Image Recognition with me?', 'Take a picture and I\'ll tell you what I see.']*/
	}

	start(time){
		if (Config.intro && !this._didIntro){
			this._didIntro = true
			const lines = Lines.intro
			// SpeakBuffer.play(this._buffers[1].text, this._buffers[1].buffer, Time(time).add('2n'), 'dry')
			SpeakBuffer.play(this._buffers[0].text, this._buffers[0].buffer, Time(time), 'dry')
			return SpeakBuffer.play(this._buffers[1].text, this._buffers[1].buffer, Time(time).add('1m'), 'dry')
		} else {
			return Promise.resolve()
		}
	}
}