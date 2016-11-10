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
import AudioBuffer from 'Tone/core/Buffer'

const introRate = 1.2
const introPitch = -1

const fillerRate = 1.3
const fillerPitch = 2

const lines = {
	
}

const lyrics = {
	 /**
	  * Spoken in error
	  */
	end : [
	 	{
			text : 'I\'m too popular right now. I\'ve got to shut down.',
			// text : 'Too many people taking pictures right now. Please try later. Now I\'m shutting down.',
			rate : 0.9,
			pitch : fillerPitch
		},
		{
			text : 'Okay, I am shutting down',
			rate : 0.9,
			pitch : fillerPitch
		},
		{
			text : 'That\'s an error! Take another.',
			rate : 1.1,
			pitch : fillerPitch
		},
	 ]
}

// load everything
for (let section in lyrics){
	let lines = lyrics[section]
	if (Array.isArray(lines)){
		lines.map((line, i) => {
			if (line.url){
				lines[i].buffer = new AudioBuffer(`audio/voice/${line.url}`)
			} else {
				SpeakBuffer.getBuffer(line.text, line.rate, line.pitch).then( (buffer) => {
					lines[i].buffer = buffer
				})
			}
		})
	} else {
		SpeakBuffer.getBuffer(lines.text, lines.rate, lines.pitch).then( (buffer) => {
			lines.buffer = buffer
		})
	}
}

export default lyrics




