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

import Master from 'Tone/core/Master'

const orientationBlocker = document.createElement('orientationBlocker')
orientationBlocker.id = 'orientationBlocker'
let hasBlocker = false

function isLandscape(angle){
	const landscape = Math.abs(angle) === 90 || Math.abs(angle) === 270
	if (landscape){
		if (!hasBlocker){
			hasBlocker = true
			document.body.appendChild(orientationBlocker)
			Master.mute = true
		}
	} else {
		if (hasBlocker){
			hasBlocker = false
			orientationBlocker.remove()
			Master.mute = false
		}
	}
}

window.addEventListener('orientationchange', () => {
	if (window.orientation){
		isLandscape(window.orientation)
	}
});

if (window.screen && window.screen.orientation){
	window.screen.orientation.addEventListener('change', () => {
		if (window.screen && window.screen.orientation){
			isLandscape(window.screen.orientation.angle)
		}
	});
}

//test initially
function testScreenOrientation(){
	if (window.screen && window.screen.orientation){
		isLandscape(window.screen.orientation.angle)
	} else if (typeof window.orientation === 'number'){
		isLandscape(window.orientation)
	}
}

//test periodically to make sure we didn't miss it
setInterval(function(){
	testScreenOrientation()
}, 100)