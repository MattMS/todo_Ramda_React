const R = require('ramda')

const h = require('../h')
const render_list_item = require('../list_item/render')


module.exports = R.curry(function (send, state) {
	const items = get_sorted_items(state.items)

	return h('ul', {
		className: 'todo-list'
	}, R.map(render_list_item(send, state), items))
})
