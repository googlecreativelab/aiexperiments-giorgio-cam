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
import Transport from 'Tone/core/Transport'
import Config from 'Config'
import MusicPosition from 'music/Position'

export default class Fill{
	constructor(){
		this._beats = {
			0 : new Player('./audio/fill0.mp3').toMaster(),
			1 : new Player({ url : './audio/fill1.mp3', volume : -2}).toMaster(),
			2 : new Player({ url : './audio/fill2.mp3', volume : -3}).toMaster(),
		}
		this._currentPlaying = this._beats[0]

		//loop all of them
		for (let b in this._beats){
			this._beats[b].loop = true
			this._beats[b].loopStart = '5m'
			this._beats[b].loopEnd = '6m'
		}

		this._crash = new Player('./audio/crash.mp3').toMaster()
	}

	fill(){
		this._currentPlaying = this._beats[MusicPosition.fillPosition]
		this._currentPlaying.start(`@${Config.quantizeLevel}`, MusicPosition.end ? '2m' : 0)
	}

	fillEnd(){
		this._currentPlaying.stop(`@${Config.quantizeLevel}`)
		this._crash.start(`@${Config.quantizeLevel} - 8n`)
	}

	stop(){
		this._currentPlaying.stop()
		this._crash.stop()
	}
}