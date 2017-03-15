const R = require('ramda')

const h = require('../h')
const render_footer = require('../footer/render')
const render_list = require('../list/render')
const render_new_input = require('../new_item/render')


// Using `flip` allows us to exclude children from `input` tags, so it only requires attributes.
const input = R.flip(h('input'))(null)


//
// Header
//

const render_header = R.curry(function (send, state) {
	return h('header', {
		className: 'header'
	}, [
		h('h1', {}, 'todos'),
		render_new_input(send, state)
	])
})


//
// Exports
//

module.exports = R.curry(function (send, state) {
	return h('h', null, [
		render_header(send, state),

		h('section', {
			className: 'main'
		}, [
			input({
				className: 'toggle-all',
				type: 'checkbox'
			}),

			render_list(send, state)
		]),

		render_footer(send, state)
	])
})
