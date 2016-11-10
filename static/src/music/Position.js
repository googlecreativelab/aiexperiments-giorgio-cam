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
let position = Config.startingPosition

const LoopPosition = [{
	start : 0,
	loopStart : '10m',
	loopEnd : '18m',
},
{
	start : '10m',
	loopStart : '10m',
	loopEnd : '18m',
},
{
	start : '18m',
	loopStart : '18m',
	loopEnd : '26m',
},
{
	start : '42m',
	loopStart : '42m',
	loopEnd : '50m',
},
{
	start : '42m',
	loopStart : '42m',
	loopEnd : '50m',
},
{
	start : '50m',
	loopStart : '50m',
	loopEnd : '58m',
}]

const FillIndices = [0, 0, 1, 1, 2, 2]

const FillerTextIndices = [0, 1, 2, 3, 4, 5]

class MusicPosition {

	get position(){
		return position
	}
	set position(val){
		position = val
	}

	get max(){
		return LoopPosition.length
	}

	get progress(){
		return position / (this.max - 1)
	}

	get backgroundLoop(){
		return LoopPosition[position]
	}

	get fillPosition(){
		return FillIndices[position]
	}

	get fillerTextPosition(){
		return FillerTextIndices[position]
	}

	get giorgioBreak(){
		return false
		// return position === 5
	}

	get end(){
		return position === (this.max - 1)
	}

	get quantizationTime(){
		if (position >= 3){
			return '@1m'
		} else {
			return '@4n'
		}
	}
}

export default new MusicPosition