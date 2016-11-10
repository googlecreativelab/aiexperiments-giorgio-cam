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

import 'style/title.css'

const images = {
	rest : 'giorgio_logo_anim__0000_eyes_right.png',
	blink : 'giorgio_logo_anim__0001_eyes_right_blink.png',
	sing0 : 'giorgio_logo_anim__0002_mouth_open.png',
	sing1 : 'giorgio_logo_anim__0004_little_note_2.png',
	sing2 : 'giorgio_logo_anim__0005_little_note_3.png',
	sing3 : 'giorgio_logo_anim__0006_little_note_4.png',
	sing4 : 'giorgio_logo_anim__0007_little_note_5.png',
	sing5 : 'giorgio_logo_anim__0008_little_note_6.png',
	sing6 : 'giorgio_logo_anim__0009_big_notes_1.png',
	sing7 : 'giorgio_logo_anim__0010_big_notes_2.png',
	sing8 : 'giorgio_logo_anim__0011_big_notes_3.png',
	sing9 : 'giorgio_logo_anim__0012_big_notes_4.png',
	sing10 : 'giorgio_logo_anim__0013_big_notes_5.png'
}

export default class Title {
	constructor(container){

		const titleContainer = document.createElement('div')
		titleContainer.id = "title"
		container.appendChild(titleContainer)

		const giorgi = document.createElement('div')
		giorgi.id = "giorgi"
		titleContainer.appendChild(giorgi)

		this._face = document.createElement('div')
		this._face.id='face'
		titleContainer.appendChild(this._face)

		this._faceImg = document.createElement('img')

		const cam = document.createElement('div')
		cam.id='cam'
		titleContainer.appendChild(cam)

		this._actionIndex = 0

		this._actions = ['_blink', '_sing', '_pause', '_blink', '_pause']

		// load all the images, then start the animation
		this._load().then(this._next.bind(this))
	}

	_load(){
		const promises = []
		Object.keys(images).forEach((key) => {
			promises.push(new Promise((success) => {
				let img = new Image()
				img.onload = success
				img.src = `images/face/${images[key]}`
				images[key] = img
			}))
		})
		return Promise.all(promises)
	}

	_setImage(img){
		this._faceImg.remove()
		this._face.appendChild(img)
		this._faceImg = img
		// this._face.style.backgroundImage = `url('../images/face/${img}')`
	}

	_blink(){

		this._setImage(images.rest)

		setTimeout(() => {
			this._setImage(images.blink)
		}, 150)

		setTimeout(() => {
			this._setImage(images.rest)
		}, 300)
		
		return new Promise((success) => {
			setTimeout(() => {
				success()
			}, 1000)
		})
	}

	_sing(){

		let wait = 0
		for (let i = 0; i <= 10; i++){
			setTimeout(() => {
				this._setImage(images[`sing${i}`])
			}, wait)
			wait += 150
		}

		setTimeout(() => {
			this._setImage(images.sing0)
		}, wait)
		wait += 300

		setTimeout(() => {
			this._setImage(images.rest)
		}, wait)
		wait += 800

		return new Promise((success) => {
			setTimeout(() => {
				success()
			}, wait)
		})
	}

	_pause(){
		return new Promise((success) => {
			setTimeout(() => {
				success()
			}, Math.random() * 1200 + 400)
		})
	}

	_next(){
		let action = this._actions[this._actionIndex]
		this._actionIndex = (this._actionIndex + 1) % this._actions.length
		this[action]().then(this._next.bind(this))
	}
}