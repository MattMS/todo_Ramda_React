const R = require('ramda')

const h = require('../h')
const input = require('../text_input_component/render')

const {edit_item_cancel, edit_item_done} = require('./actions')


//
// Exports
//

module.exports = R.curry(function (send, item) {
	const on_change = R.pipe(edit_item_done(item.id), send)

	return input(on_change, {
		// autoFocus: true,
		className: 'edit',
		defaultValue: item.label,
		// onChange:
		onBlur: function (event) {
			send(edit_item_cancel)
		},
		placeholder: 'What needs to be done?'
	})
})
