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

const THREE = require('three')
import Time from 'Tone/type/Time'
import TWEEN from 'tween.js'

const CAMERA_DIST = 10

const TWO_PI = Math.PI * 2

export default class Canvas {
	constructor(container){

		this._camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 )
		this._camera.position.z = CAMERA_DIST


		this._scene = new THREE.Scene()

		this._renderer = new THREE.WebGLRenderer({ antialias: false })
		container.appendChild(this._renderer.domElement)
		this._renderer.domElement.id = 'three'

		// make a test plane
		const material = new THREE.MeshBasicMaterial({ color : 0xffffff })
		// material.side = THREE.DoubleSide
		this._plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)

		window.plane = this._plane
		
		this._scene.add(this._plane)

		this._bouncing = false

		this._bounceStart = 0

		this._bounceRate = Time('4n').toMilliseconds()

		this._changingColor = false

		this._colorChangeTime = 0

		this._colorChangeIndex = 0

		this._colors = [[7,222,0],[9,51,255],[93,17,255],[101,177,255],[255,42,2],[255,181,115],[250,196,0],[5,153,0],[255,251,83],[46,220,0],[246,168,0],[182,87,255],[194,208,0]]
			.map((rgb) => new THREE.Color(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255))

		this._loop()
	}

	_loop(time){
		requestAnimationFrame(this._loop.bind(this))

		let now = Date.now()

		if (this._bouncing){
			// let bounceAmount = Math.sin(this._bounceRate * TWO_PI * (now - this._bounceStart) / 1000)
			// bounceAmount = (bounceAmount + 1)
			let bounceAmount = (now - this._bounceStart) % this._bounceRate
			bounceAmount /= this._bounceRate
			this._camera.position.z = CAMERA_DIST - (1 - bounceAmount) / 2
		}

		if (this._changingColor && ((now - this._colorChangeTime) > (this._bounceRate))){
			this._plane.material.color = this._colors[this._colorChangeIndex]
			this._colorChangeIndex = (this._colorChangeIndex + 1) % this._colors.length
			this._colorChangeTime = now
		}

		this._renderer.render( this._scene, this._camera )

		TWEEN.update(time);
	}

	changeColor(){
		this._changingColor = true
		this._colorChangeTime = Date.now()
	}

	repeatTexture(){
		const texture = this._plane.material.map
		window.texture = texture
		texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
		const repeats = [1, 2, 4, 8]
		let index = 0
		this._interval = setInterval(() => {
			texture.repeat.x = repeats[index]
			texture.repeat.y = repeats[index]
			index = (index + 1) % repeats.length
		}, this._bounceRate)
	}

	endChangeColor(){
		this._changingColor = false
		this._plane.material.color = new THREE.Color(1, 1, 1)
		// clearInterval(this._interval)
		// this._plane.material.map.repeat.x = 1
		// this._plane.material.map.repeat.y = 1
	}

	/**
	 * mirror the display for front facing cameras
	 */
	mirror(){
		this._plane.scale.x *= -1
		this._plane.material.side = THREE.BackSide
		this._plane.material.needsUpdate = true
	}

	resize(vidWidth, vidHeight){



		//set the video plane size
		const vidAspect = vidWidth / vidHeight
		const camAspect = window.innerWidth / window.innerHeight

		this._plane.scale.x = vidAspect

		//http://stackoverflow.com/questions/14614252/how-to-fit-camera-to-object
		if (vidAspect > camAspect){
			this._camera.fov = 2 * Math.atan( 1 / ( 2 * CAMERA_DIST ) ) * ( 180 / Math.PI )
		} else {
			this._camera.fov = 2 * Math.atan( ( vidAspect / camAspect ) / ( 2 * CAMERA_DIST ) ) * ( 180 / Math.PI )
		}

		//THREE resize
		this._renderer.setPixelRatio( window.devicePixelRatio )
		this._renderer.setSize( window.innerWidth, window.innerHeight )

		const windowHalfX = window.innerWidth / 2
		const windowHalfY = window.innerHeight / 2
		this._camera.aspect = camAspect
		this._camera.updateProjectionMatrix()
		this._renderer.setSize( window.innerWidth, window.innerHeight )
	}

	setVideo(video){

		this._renderer.domElement.classList.add('visible')

		const texture = new THREE.VideoTexture(video)
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		this._plane.material.map = texture
		this._plane.material.needsUpdate = true
	}

	bounce(){
		this._bouncing = true
		this._bounceStart = Date.now()
	}

	endBounce(){
		this._bouncing = false
	}

	fail(time = 4000){
		this._bouncing = false
		return new Promise((end) => {
			let plane = this._plane
			let scene = this._scene
			var tween = new TWEEN.Tween({scale : 1})
				.to({scale : 0}, time)
				.onUpdate(function(){
					plane.scale.y = this.scale
				})
				.onComplete(function(){
					scene.remove(plane)
					end()
				})
				.easing(TWEEN.Easing.Quadratic.Out)
				.start()
		})
	}
}