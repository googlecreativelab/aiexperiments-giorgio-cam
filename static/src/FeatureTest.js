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

import 'style/main.css'
import domReady from 'domready'
import 'style/splash.css'
import Modernizr from 'exports?Modernizr!Modernizr'

require.ensure(['Main', 'style/notsupported.css'], (require) => {

	domReady(() => {

		if (Modernizr.getusermedia && Modernizr.webaudio && Modernizr.webgl){

			const main = require('Main')

		} else {

			require('style/notsupported.css')

			const text = document.createElement('div')
			text.id = 'notsupported'
			if (!Modernizr.getusermedia){
				text.innerHTML = 'Sorry, your device doesn’t allow access to the camera. Try using <a target="_blank" href="https://www.google.com/chrome/browser/">Chrome</a> on an Android phone or a laptop.'
			} else {
				text.innerHTML = 'Oops, sorry for the tech trouble. For the best experience view in <a target="_blank" href="https://www.google.com/chrome/browser/">Chrome Browser</a>'
			}
			document.body.appendChild(text)

		}

	})

})


