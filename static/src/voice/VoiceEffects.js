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

import Convolver from 'Tone/effect/Convolver'
import Compressor from 'Tone/component/Compressor'
import PingPongDelay from 'Tone/effect/PingPongDelay'
import FeedbackDelay from 'Tone/effect/FeedbackDelay'
import PitchShift from 'Tone/effect/PitchShift'
import Gain from 'Tone/core/Gain'
import Tone from 'Tone/core/Tone'

//a master out object so that they can all be stopped at once
const VoiceMasterOut = new Gain().toMaster()

const delay = new PingPongDelay('4n', 0.4).connect(VoiceMasterOut)
delay.wet.value = 0.8

const delayInput = new Gain().connect(delay)
delayInput.gain.value = 0

const comp = new Compressor().connect(VoiceMasterOut)
comp.connect(delayInput)

const fillDelay = new FeedbackDelay({
	delayTime : '4n', 
	feedback : 0.25,
	wet : 0.3,
}).connect(VoiceMasterOut)

const reverseVerb = new Convolver({
	url : 'audio/reverseCrash.mp3',
	wet : 1
}).connect(fillDelay)


export default {
	dry : function(source){
		source.connect(VoiceMasterOut)
	},

	fill : function(source){
		source.connect(VoiceMasterOut)
		// source.connect(fillDelay)
		source.connect(reverseVerb)
	},

	wait : function(source){
		source.connect(VoiceMasterOut)
		// source.connect(fillDelay)
		source.connect(reverseVerb)
	},

	line : function(source, effectTime){
		source.connect(comp)
		this._delay(effectTime)
	},

	down : function(source, effectTime){
		let rampTime = source.buffer.duration * 0.25
		source.playbackRate.exponentialRampToValue(0.7, rampTime, Tone.now() + source.buffer.duration * 0.75)
		source.toMaster()
		source.connect(reverseVerb)
	},

	end : function(source, effectTime){
		const pitchDelay = new PitchShift({
			delayTime : '4n', 
			feedback : 0.4,
			wet : 0,
			pitch : -2,
			windowSize : 0.05
		}).toMaster()
		let rampTime = source.buffer.duration * 0.25
		pitchDelay.wet.setValueAtTime(0.5, effectTime - rampTime / 2)
		source.connect(pitchDelay)
		source.playbackRate.exponentialRampToValue(0.7, rampTime, effectTime - rampTime)
		source.toMaster()
	},

	_delay : function(time){
		delayInput.gain.setValueAtTime(1, time)
		delayInput.gain.linearRampToValueAtTime(0, time + 2)
	},

	stop : function(){
		VoiceMasterOut.gain.rampTo(0, 0.8)
	}
}