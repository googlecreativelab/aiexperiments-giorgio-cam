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

import 'style/text.css'
import Tone from 'Tone/core/Tone'

const textContainer = document.createElement('div')
textContainer.id = 'textContainer'

const timeline = []

function updateLoop(){
	requestAnimationFrame(updateLoop)
	let now = Tone.now()
	while (timeline.length && timeline[0].time <= now){
		timeline.shift().callback()
	}
}

function makeVisibleCallback(element){
	return () => {
		element.classList.add('visible')
	}
}

let shiftUp = false

export default {

	appendTo : function(container){
		container.appendChild(textContainer)
		//start the loop
		updateLoop()
	},

	shiftUp : function(){
		shiftUp = true
	},

	shiftDown : function(){
		shiftUp = false
	},

	show : function(text, start, duration, labelObj){
		const words = text.split(/[ ,]+/)
		let wordTime = duration / words.length

		let utterance = document.createElement('div')
		utterance.classList.add('utterance')
		textContainer.appendChild(utterance)

		if (labelObj){
			const splitLabel = labelObj.label.split(/[ ,]+/)
			// get the index of the first word of the label
			let index = words.indexOf(splitLabel[0])

			labelObj.count = splitLabel.length
			labelObj.split = splitLabel

			// cut the words out and replace it with the label
			words.splice(index, splitLabel.length, labelObj.label)
		}

		if (shiftUp){
			utterance.classList.add('shiftUp')
		}


		timeline.push({
			time : start, 
			callback : makeVisibleCallback(utterance)
		})

		let wordDelay = start

		for (let i = 0; i < words.length; i++){
			let word = words[i]

			let element = document.createElement('span')
			let wordCount = 1

			if (labelObj && word === labelObj.label){	
				// element.textContent = labelObj.label
				element.classList.add('label')

				timeline.push({
					time : wordDelay,
					callback : makeVisibleCallback(element)
				})

				for (let lWord of labelObj.split){
					let subEl = document.createElement('span')
					subEl.textContent = lWord
					element.appendChild(subEl)

					timeline.push({
						time : wordDelay,
						callback : makeVisibleCallback(subEl)
					})

					wordDelay += wordTime
				}

				// add the score
				let scoreEl = document.createElement('div')
				scoreEl.classList.add('score')
				scoreEl.textContent = `${(labelObj.score * 100).toFixed()}% confidence`
				element.appendChild(scoreEl)

				timeline.push({
					time : wordDelay - wordTime,
					callback : makeVisibleCallback(scoreEl)
				})

			} else {
				element.textContent = words[i]
				timeline.push({
					time : wordDelay,
					callback : makeVisibleCallback(element)
				})
				wordDelay += wordTime
			}
			utterance.appendChild(element)
			
		}

		// remove it at the end
		timeline.push({
			time : start + duration + (labelObj ? 1.4 : 0.3),
			callback : () => {
				utterance.remove()
			}
		})

		updateLoop()
	},

	clear : function(){
		// textContainer.remove()
		//clear the text events
		textContainer.innerHTML = ''
		//flush all the events
		while(timeline.length){
			timeline.shift()
		}
	}
}