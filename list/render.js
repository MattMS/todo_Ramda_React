const R = require('ramda')

const h = require('../h')
const render_list_item = require('../list_item/render')


//
// Helper functions
//

// Merges a 2-item Array into an Object with the first item as the `id` value.
const merge_as_id = R.pipe(
	R.adjust(R.objOf('id'), 0),
	R.apply(R.merge)
)

const sort_by_creation_time = R.sortBy(R.prop('added'))

// const sort_by_first_item = R.sortBy(R.prop(0))


// Composed helped functions

const get_sorted_items = R.pipe(R.toPairs, sort_by_creation_time, R.map(merge_as_id))


//
// Exports
//

/*
R.converge(R.map, [
	render_list_item,
	R.pipe(R.nthArg(1), R.prop('items'), get_sorted_items)
])
*/
module.exports = R.curry(function (send, state) {
	const items = get_sorted_items(state.items)

	const make_li = render_list_item(send, state)

	return h('ul', {
		className: 'todo-list'
	}, R.map(make_li, items))
})
