const react_dom = require('react-dom')

const render = require('./render')


//
// DOM render
//

function render_to_dom (send, state) {
	react_dom.render(render(send, state), document.getElementById('root'))
}


//
// State
//

let global_state = {
	filter: null,
	items: {}
}

function send (action) {
	global_state = action(global_state)
	console.log(global_state)

	render_to_dom(send, global_state)
}


//
// First render
//

render_to_dom(send, global_state)
