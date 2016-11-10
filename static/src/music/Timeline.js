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
import Loop from 'Tone/event/Loop'
import Background from 'music/Background'
import Time from 'Tone/type/Time'
import Fill from 'music/Fill'
import Config from 'Config'
import Master from 'Tone/core/Master'

export default class Timeline{
	constructor(){


	}

	start(){
		let startTime = Transport.now() + 0.7
		Transport.start(startTime, Config.intro ? 0 : '2m')
		Transport.loopStart = '10m'
		Transport.loopEnd = '18m'
		Transport.loop = true;
		return startTime
	}

	stop(){
		Transport.stop()
		Transport.clear(0)
	}

	next(){

	}
	 
}