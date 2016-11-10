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

import 'webrtc-adapter'
import mobile from 'is-mobile'
import 'style/camera.css'
import Label from 'camera/Label'
import Config from 'Config'
import Canvas from 'camera/Canvas'

export default class Camera {
	constructor(container) {

		this._canvas = new Canvas(container)

		this._video = document.createElement('video')
		window.video = this._video

		this._constraints = { 
			audio: false, 
			video: {
				facingMode : { ideal: 'environment' }
			}
		}

		this._frontFacing = !mobile()
	}
	
	open(){

		let tries = 0
		return navigator.mediaDevices.getUserMedia(this._constraints).then((stream) => {

			window.stream = stream

			// stream.
			this._video.srcObject = stream
			this._video.autoplay = true

			this._video.classList.add('visible')
			this._canvas.setVideo(this._video)

			window.addEventListener('resize', this._resize.bind(this))
			//size it initially
			this._resize()
		})
	}

	error(){
		this.close()
		this._canvas.fail()
	}

	end(){
		return this._canvas.fail(Config.fadeOutTime * 1000)
	}

	close(){
		this._video.pause()
		return this._canvas.fail().then( () => {
			this._video.srcObject.getVideoTracks()[0].stop()
		})
	}

	_getImage(){
		const video = this._video
		if (video){
			const w = video.videoWidth
			const h = video.videoHeight
			const canvas = document.createElement('canvas')
			const context = canvas.getContext('2d')
			// take a snapshot of the incoming image
			canvas.width = w
			canvas.height = h
			context.drawImage(video, 0, 0, w, h)
			return canvas
		}
	}

	label() {
		return Label(this._getImage())
	}

	/**
	 * Set the sizing of the video box
	 */
	_resize(){
		let aspectRatio = this._video.videoWidth / this._video.videoHeight
		if (isNaN(aspectRatio)){
			setTimeout(() => this._resize(), 100)
		} else {
			let windowRatio = window.innerWidth / window.innerHeight
			this._video.classList.add('active')
			if (aspectRatio > windowRatio){
				this._video.classList.add('wide')
				this._video.classList.remove('tall')
			} else {
				this._video.classList.add('tall')
				this._video.classList.remove('wide')
			}
			this._canvas.resize(this._video.videoWidth, this._video.videoHeight)

			if (this._frontFacing){
				this._canvas.mirror()
			}
		}
	}

	takePicture(){
		this._video.pause()
		this._canvas.changeColor()
	}

	resume(){
		this._canvas.endBounce()
		this._canvas.endChangeColor()
		const promise = this._video.play()
		if (promise){
			return promise
		} else {
			return Promise.resolve()
		}
	}

	bounce(){
		this._canvas.bounce()
	}

	changeColor(){
		this._canvas.changeColor()
	}

	giorgioBreak(){
		this._canvas.changeColor()
	}

}