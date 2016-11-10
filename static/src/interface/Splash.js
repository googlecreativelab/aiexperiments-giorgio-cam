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

import 'style/splash.css'
import events from 'events'
const EventEmitter = events.EventEmitter
import Loader from 'interface/Loader'
import Config from 'Config'
import screenfull from 'screenfull'
import Title from 'interface/Title'


const TitleColors = ['pink', 'purple', 'yellow', 'teal', 'purple', 'yellow', 'teal', 'space', 'pink', 'yellow', 'teal']

export default class Splash extends EventEmitter{
	constructor(container){
		super()

		this._splashElement = document.createElement('div')
		this._splashElement.id = 'splash'
		container.appendChild(this._splashElement)

		// the title
		const titleContainer = document.createElement('div')
		titleContainer.id = 'titleContainer'
		this._splashElement.appendChild(titleContainer)

		const title = new Title(titleContainer)

		const subTitle = document.createElement('div')
		subTitle.id = 'subTitle'
		titleContainer.appendChild(subTitle)
		subTitle.textContent = 'Use your camera to make music with me.'

		// the loader / ready button
		this._loader = new Loader(titleContainer)

		this._loader.on('start', () => {

			this.emit('start')
			this._splashElement.classList.add('disappear')

			if (screenfull.enabled && Config.fullscreen) {
				screenfull.request()
			}
		})

		const learnMore = document.createElement('a')
		learnMore.id = 'learnMore'
		learnMore.textContent = 'About'
		titleContainer.appendChild(learnMore)
		learnMore.addEventListener('click', (e) => {
			e.preventDefault()
			this.emit('about')
		})

		// logos at the bottom
		const aiExperiments = document.createElement('a')
		aiExperiments.id = 'aiExperiments'
		aiExperiments.href = Config.aiExperimentsLink
		aiExperiments.target = '_blank'
		this._splashElement.appendChild(aiExperiments)

		// break
		const badgeBreak = document.createElement('div')
		badgeBreak.id = 'badgeBreak'
		this._splashElement.appendChild(badgeBreak)		

		const googleFriends = document.createElement('a')
		googleFriends.id = 'googleFriends'
		this._splashElement.appendChild(googleFriends)

		const privacyAndTerms = document.createElement('div')
		privacyAndTerms.id = 'privacyAndTerms'
		privacyAndTerms.innerHTML = '<a target="_blank" href="https://www.google.com/intl/en/policies/privacy/">privacy</a><span>&</span><a target="_blank" href="https://www.google.com/intl/en/policies/terms/">terms</a>'
		this._splashElement.appendChild(privacyAndTerms)

	}

	show(){
		this._splashElement.classList.remove('disappear')
	}

}