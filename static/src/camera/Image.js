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

import Time from 'Tone/type/Time'
import knuthShuffle from 'knuth-shuffle'
const shuffle = knuthShuffle.knuthShuffle

export default class Img {
	constructor(container){

		this._canvas = document.createElement('canvas')
		this._canvas.id = 'image'
		container.appendChild(this._canvas)

		this._context = this._canvas.getContext('2d')

		this._updateInterval = Time('4n').toMilliseconds();

		this._lastUpdate = Date.now()

		this._currentImg = null

		this._isVisible = false

		this._colorIndex = 0
		this._colors = [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 0, 255], [255, 255, 0], [0, 255, 255]]
		// these colors are from JR:
		// this._colors = [[7,222,0],[9,51,255],[93,17,255],[101,177,255],[255,42,2],[255,181,115],[250,196,0],[5,153,0],[255,251,83],[46,220,0],[246,168,0],[182,87,255],[194,208,0]]

		this.resize()
		this._loop()
	}

	_loop(){
		requestAnimationFrame(this._loop.bind(this))
		if (this._isVisible && this._currentImg && Date.now() - this._lastUpdate > this._updateInterval){
			this._lastUpdate = Date.now()
			this._drawImg(this._currentImg)
		}
	}

	bounce(){
		this._canvas.classList.add('bounce')
	}

	show(){
		this._lastUpdate = 0
		this._canvas.classList.add('visible')
		this._isVisible = true
	}

	hide(){
		this._isVisible = false
		this._canvas.classList.remove('visible')
		this._canvas.classList.remove('bounce')
		this._currentImg = null
	}

	setImage(img){
		this._currentImg = img
	}

	resize(){
		this._context.canvas.width = window.innerWidth
		this._context.canvas.height = window.innerHeight
	}

	_grayScale(context){

		let color = this._colors[this._colorIndex]
		this._colorIndex = (this._colorIndex + 1) % this._colors.length

		let width = context.canvas.width
		let height = context.canvas.height

		let pixels = context.getImageData(0, 0, width, height);

		for(let y = 0; y < pixels.height; y++){
		     for(let x = 0; x < pixels.width; x++){
		          let i = (y * 4) * pixels.width + x * 4;
		          let avg = (pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2]) / 3;
		          pixels.data[i] = avg - (255 - color[0]);
		          pixels.data[i + 1] = avg - (255 - color[1]);
		          pixels.data[i + 2] = avg - (255 - color[2]);
		     }
		}

		context.putImageData(pixels, 0, 0, 0, 0, pixels.width, pixels.height);
	}

	_drawImg(image){
		let context = this._context
		let imageW = image.width
		let imageH = image.height
		let canvasW = context.canvas.width
		let canvasH = context.canvas.height
		let canvasAspectRatio = canvasW / canvasH
		let imageAspectRatio = imageW / imageH
		// get the smaller of the frame
		if (canvasAspectRatio > imageAspectRatio){
			//fit width & scale height
			let widthScale = imageW / canvasW
			let scaleHeight = imageH / widthScale
			// the diff between the canvas width and the image width
			let topOffset = (scaleHeight - canvasH) / 2
			context.drawImage(image, 0, -topOffset, canvasW, scaleHeight)
		} else {
			//fit height & scale width
			let heightScale = imageH / canvasH
			let scaledWidth = imageW / heightScale
			// the diff between the canvas width and the image width
			let leftOffset = (scaledWidth - canvasW) / 2
			context.drawImage(image, -leftOffset, 0, scaledWidth, canvasH)
		}
		this._grayScale(context)
	}

	draw(context){
		if (this._currentImg && Date.now() - this._lastUpdate > this._updateInterval){
			this._lastUpdate = Date.now()
			this._drawImg(this._currentImg, context)
		}
	}
}