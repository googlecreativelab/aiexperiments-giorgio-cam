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
import Text from 'voice/Text'
import events from 'events'
import 'style/shutter.css'
const EventEmitter = events.EventEmitter

export default class Shutter extends EventEmitter{

	constructor(container){
		super()

		this._shutterButton = document.createElement('div')
		this._shutterButton.id = 'shutterButton'
		container.appendChild(this._shutterButton)

		const innerFill = document.createElement('div')
		innerFill.id = 'innerShutter'
		this._shutterButton.appendChild(innerFill)

		this._flashEl = document.createElement('div')
		this._flashEl.id = 'flash'
		container.appendChild(this._flashEl)

		this._shutterSound = new Player('./audio/shutter.mp3').toMaster()

		this._shutterButton.addEventListener('click', (e) => {
			e.preventDefault()
			this._flash()
			this.hide()
			this.emit('click')
		})
	}

	/**
	 * flash the screen
	 * on the screen like you're taking a pic
	 */
	_flash(){
		this._shutterSound.start()
		this._flashEl.className = 'visible'
		setTimeout(() => {
			this._flashEl.className = ''
		}, 250)
	}

	hide(){
		this._shutterButton.classList.remove('visible')
		Text.shiftDown()
	}

	remove(){
		this._shutterButton.remove()
	}

	show(){
		this._shutterButton.classList.add('visible')
		Text.shiftUp()
	}
}