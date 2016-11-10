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

import Player from 'Tone/source/Player'
import Config from 'Config'
import Time from 'Tone/type/Time'
import MusicPosition from 'music/Position'
import Transport from 'Tone/core/Transport'

const backgroundVolume = -8

export default class BackgroundMusic {
	constructor(){
		this._player = new Player('../audio/racer.mp3').toMaster()
		this._player.volume.value = backgroundVolume

		const startLoop = MusicPosition.backgroundLoop
		// set it to loop
		this._player.loopStart = startLoop.loopStart
		this._player.loopEnd = startLoop.loopEnd
		this._player.loop = true

		//the outro music		
		this._outro = new Player('../audio/end.mp3').toMaster()
		this._outro.volume.value = -2

		this._applause = new Player('../audio/applause.mp3').toMaster()
		this._applause.volume.value = -4

		this._ended = false

	}

	start(time){
		this._player.start(time, MusicPosition.backgroundLoop.start)
	}

	fill(){
		// duck the volume out immediately
		let stopTime = Time(`@${Config.quantizeLevel}`).toSeconds()
		this._player.stop(`${stopTime} + 4n`)
		this._player.volume.rampTo(-Infinity, '4n', stopTime)
	}

	fillEnd(){
		if (!this._ended){
			let startTime = Time(`@${Config.quantizeLevel}`).toSeconds()
			const loopPosition = MusicPosition.backgroundLoop
			// set it to loop
			this._player.loopStart = loopPosition.loopStart
			this._player.loopEnd = loopPosition.loopEnd
			this._player.start(startTime, loopPosition.start)
			this._player.volume.rampTo(backgroundVolume, 0.01, startTime)
		}
	}

	stop(){
		this._ended = true
		const outTime = Time('@4n')
		this._outro.start(outTime, 0)
		this._outro.volume.rampTo(-Infinity, '4m', outTime)
		this._player.volume.rampTo(-Infinity, '2n')
	}

	end(){
		this._ended = true
		this._player.volume.rampTo(-Infinity, Config.fadeOutTime)
		this._applause.start()
	}
}