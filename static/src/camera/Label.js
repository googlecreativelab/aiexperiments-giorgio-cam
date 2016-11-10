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

import Config from 'Config'

export default function Label(canvas){

	if (Config.quotaLimit){
		return new Promise((success, fail) => {
			setTimeout(() => {
				fail('quota')
			}, 2000)
		})
	} else if (Config.cloudVision){
		let formData = new FormData();
		formData.append('image', canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));


		return new Promise((success, fail) => {
			let request = new XMLHttpRequest();
			request.timeout = 20000
			request.open('POST', '/see');
			request.addEventListener('load', () => {
				if (request.status == 200) {
					const response = JSON.parse(request.response)
					if (Array.isArray(response)){
						success(JSON.parse(request.response))
					} else if (response.error){
						fail(response.error)
					}
				} else {
					fail(request.status)
				}
			})
			request.addEventListener('error', fail)
			request.addEventListener('timeout', fail)
			request.send(formData)
		})
	} else {
		return new Promise((success) => {
			setTimeout(() => {
				success([{
					label : 'this is a very long multi word label',
					score : 0.8
				}, {
					label : 'this is another very long multi word label multi word',
					score : 0.8
				}])
			}, 200)
		})
	}

}