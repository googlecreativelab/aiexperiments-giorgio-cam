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

import 'style/about.css'
import Config from 'Config'
import YouTubeIframeLoader from 'youtube-iframe'

const maryLink = 'https://github.com/marytts/marytts'
const cloudVisionLink = 'https://cloud.google.com/vision/'
const sourceCode = 'https://github.com/googlecreativelab/aiexperiments-giorgio-cam'

const blurbCopy = `Built by Eric Rosenbaum, Yotam Mann, and friends at Google Creative Lab 
using <a target='_blank' href='${cloudVisionLink}'>Google Cloud Vision API</a> and <a target='_blank' href='${maryLink}'>MaryTTS</a>.
The open-source code is <a target='_blank' href='${sourceCode}'>available here</a>. Check out more
<a target='_blank' href='${Config.aiExperimentsLink}'>A.I. Experiments</a>.`

export default class About {
	constructor(container){

		this._container = document.createElement('div')
		this._container.id = 'about'
		container.appendChild(this._container)

		const closeButton = document.createElement('div')
		closeButton.id = 'close'
		closeButton.classList.add('visible')
		this._container.appendChild(closeButton)
		closeButton.addEventListener('click', (e) => {
			e.preventDefault()
			this.close()
		})

		const content = document.createElement('div')
		content.id = 'content'
		this._container.appendChild(content)

		const title = document.createElement('div')
		title.id = 'title'
		title.textContent = Config.name
		content.appendChild(title)


		const video = document.createElement('div')
		video.id = 'video'
		//vid YT0k99hCY5I 
		video.innerHTML = `<iframe id='youtube-iframe' src="https://www.youtube.com/embed/eKeI63VSpto`?modestbranding=0&showinfo=0&enablejsapi=1" frameborder="0" allowfullscreen></iframe>`
		content.appendChild(video)

		this._ytplayer = null

		this._playButton = document.createElement('div')
		this._playButton.id = 'playButton'
		this._playButton.classList.add('visible')
		video.appendChild(this._playButton)

		YouTubeIframeLoader.load((YT) => {
			this._ytplayer = new YT.Player('youtube-iframe', {
				events : {
					onStateChange : (state) => {
						this._playButton.classList.remove('visible')
					}
				}
			})
		})

		const blurb = document.createElement('div')
		blurb.id = 'blurb'
		content.appendChild(blurb)
		blurb.innerHTML = blurbCopy

	}
	close(){
		this._container.classList.remove('visible')
		if (this._ytplayer){
			this._ytplayer.stopVideo()
		}
		if (ga){
			ga('send', 'event', 'GiorgioCam', 'Click', 'About - Close')
		}
	}
	open(){
		this._playButton.classList.add('visible')
		this._container.classList.add('visible')
		if (ga){
			ga('send', 'event', 'GiorgioCam', 'Click', 'About - Open')
		}
	}
}