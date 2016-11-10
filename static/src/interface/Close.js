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

import events from 'events'
import 'style/close.css'
const EventEmitter = events.EventEmitter

export default class Close extends EventEmitter{

	constructor(container){
		super()

		this._closeButton = document.createElement('div')
		this._closeButton.id = 'closeButton'
		container.appendChild(this._closeButton)

		this._closeButton.addEventListener('click', (e) => {
			e.preventDefault()
			// this.end()
			this._closeButton.remove()
			this.emit('click')
		})

		this._container = container
	}

	hide(){
		this._closeButton.classList.remove('visible')
	}

	show(){
		this._closeButton.classList.add('visible')
	}

	end(){
		//put up a big blocking screen with the option to restart
		const end = document.createElement('div')
		end.id = 'end'
		this._container.appendChild(end)

		const textContainer = document.createElement('div')
		textContainer.id = 'text'
		end.appendChild(textContainer)


		const restText = document.createElement('div')
		restText.id = 'rest'
		restText.innerHTML = '<a onclick="window.location.reload()">restart</a> or <div id="clickHere">learn more</div> about how i work'
		textContainer.appendChild(restText)

		restText.querySelector('#clickHere').addEventListener('click', () => {
			this.emit('about')
		})
	}
}