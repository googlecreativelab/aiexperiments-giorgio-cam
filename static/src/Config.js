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

import Transport from 'Tone/core/Transport'
import Time from 'Tone/type/Time'

Transport.bpm.value = 128

export default {
	startingPosition: 0,
	cloudVision : true,
	quantizeLevel : '4n',
	name : 'Giorgio Cam',
	intro : true,
	aiExperimentsLink : 'https://aiexperiments.withgoogle.com',
	//mock throws a quota limit error
	quotaLimit : false,
	fallbackScreen : false,
	fullscreen : false || window.location.search.indexOf('fullscreen') !== -1,
	fillTimeline : '138m',
	fadeOutTime : Time('4m').toSeconds()
}