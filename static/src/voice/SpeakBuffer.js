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

import Buffer from 'Tone/core/Buffer'
import BufferSource from 'Tone/source/BufferSource'
import Text from 'voice/Text'
import VoiceEffects from 'voice/VoiceEffects'
import Time from 'Tone/type/Time'
import Master from 'Tone/core/Master'
import Tone from 'Tone/core/Tone'

const currentPlaying = []

function play(text, buffer, time, effect='dry', label){
	let source;
	return new Promise( (done) => {
		if (time instanceof Time){
			time = time.toSeconds()
		}

		source = new BufferSource(buffer)
		currentPlaying.push(source)
		source.fadeIn = 0.01
		source.fadeOut = 0.01
		let duration = buffer.duration
		if (effect === 'line' || effect === 'end'){
			let landTime = time + Time('4n').mult(4.67).toSeconds()
			let startTime = landTime - buffer.duration
			VoiceEffects[effect](source, time + Time('1m').toSeconds())
			time = startTime
			if (time < Tone.now()){
				time = Tone.now()
			}
			if (effect === 'end'){
				duration *= 1.3
			}
		} else if (VoiceEffects.hasOwnProperty(effect)){
			VoiceEffects[effect](source)
		}
		source.start(time)
		source.onended = done
		Text.show(text, time, duration, label)
	}).then(() => {
		currentPlaying.splice(currentPlaying.indexOf(source), 1)
	})
}

function stop(time){
	currentPlaying.forEach((src) => {
		src.stop(time)
	})
	Text.clear()
}

function getBuffer(line, rate=1, pitch=0){
	return new Promise((done, err) => {
		const buff = new Buffer(`speak/?text=${encodeURIComponent(line)}&rate=${rate}&pitch=${pitch}`, () => {
			done(buff)
		}, err)
	})
}

export default {
	play, getBuffer, stop
}