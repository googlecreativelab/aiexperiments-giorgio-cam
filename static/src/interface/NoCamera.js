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

import 'style/nocamera.css'

export default function NoCamera(container){

	const background = document.createElement('div')
	background.id = 'nocamera'
	container.appendChild(background)

	const content = document.createElement('div')
	content.id = 'content'
	background.appendChild(content)

	const img = document.createElement('div')
	img.id = 'camera'
	content.appendChild(img)

	const blurb = document.createElement('div')
	blurb.id = 'blurb'
	blurb.textContent = 'Since you did\'t allow access to the camera, this experiment won\'t work.'
	content.appendChild(blurb)

	/*const restartButton = document.createElement('div')
	restartButton.id = 'restart'
	restartButton.textContent = 'Please restart'
	content.appendChild(restartButton)
	restartButton.addEventListener('click', () => {
		window.location.reload()
	})*/
}