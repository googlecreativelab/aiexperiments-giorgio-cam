import Visibility from 'visibilityjs'

export default function resolveIfVisible(response){
	if (Visibility.hidden()){
		return new Promise((success) => {
			const id = Visibility.onVisible(() => {
				//and a short pause to give the 
				//clock a chance to catch up
				setTimeout(() => {
					Visibility.unbind(id)
					success(response)
				}, 500)
			})
		})
	} else {
		return Promise.resolve(response)
	}
}