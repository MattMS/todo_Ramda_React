const R = require('ramda')

const h = require('../h')


const ENTER_KEY = 13

const ESC_KEY = 27


//
// Exports
//

module.exports = R.curry(function (send, attributes) {
	let input_node = null

	function onKeyDown (event) {
		if (event.keyCode === ESC_KEY) {
			// send(null)
			return
		}

		if (event.keyCode !== ENTER_KEY) {
			return
		}

		event.preventDefault()

		const value = input_node.value.trim()

		if ('' !== value) {
			input_node.value = ''

			send(value)
		}
	}

	return h(
		'input',
		R.merge(attributes, {
			onKeyDown: onKeyDown,
			ref: function (node) {
				input_node = node
			}
		}),
		null
	)
})
