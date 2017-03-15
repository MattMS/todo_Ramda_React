const R = require('ramda')

const h = require('../h')
const render_new_input = require('../new_item/render')


const SHOW_ACTIVE = 'active'

const SHOW_ALL = 'all'

const SHOW_DONE = 'completed'


const get_item_count = R.pipe(R.prop('items'), R.keys, R.length)


function li_a (label, href, classes) {
	return h('li', {}, [
		h('a', {
			className: classes,
			href: href
		}, [
			label
		])
	])
}


//
// Exports
//

module.exports = R.curry(function (send, state) {
	return h('footer', {
		className: 'footer'
	}, [
		h('span', {
			className: 'todo-count'
		}, [
			h('strong', {}, get_item_count(state)),
			' left'
		]),

		h('ul', {
			className: 'filters'
		}, [
			li_a('All', '#/', 'selected'),
			li_a('Active', '#/active', ''),
			li_a('Completed', '#/completed', '')
		])
	])
})
