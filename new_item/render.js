const R = require('ramda')

const h = require('../h')
const input = require('../text_input_component/render')

const new_item = require('./new_item')


module.exports = R.curry(function (send, state) {
	return input(R.pipe(new_item, send), {
		// autoFocus: true,
		className: 'new-todo',
		placeholder: 'What needs to be done?'
	})
})
