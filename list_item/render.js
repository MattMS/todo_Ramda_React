const R = require('ramda')

const h = require('../h')
const input = require('../text_input_component/render')
const render_edit_input = require('../edit_item/render')

const {delete_item, edit_item_cancel, edit_item_done, edit_item_start, set_item_done_state} = require('./actions')


//
// Helper functions
//

const pick_by_true_values = R.pickBy(R.nthArg(0))


// Composed helped functions

const get_classes_text = R.pipe(
	pick_by_true_values,
	R.keys(),
	R.join(' ')
)


//
// Container for done checkbox, label, and delete button
//

const render_list_item_view = R.curry(function (send, item) {
	const checkbox = h('input', {
		checked: item.done,
		className: 'toggle',
		onChange: function (event) {
			send(set_item_done_state(item.id, R.not(item.done)))
		},
		type: 'checkbox'
	}, null)

	const delete_button = h('button', {
		className: 'destroy',
		onClick: function (event) {
			event.preventDefault()

			send(delete_item(item.id))
		}
	}, null)

	const label = h('label', {
		onDoubleClick: function (event) {
			event.preventDefault()

			send(edit_item_start(item.id))
		}
	}, item.label)

	return h('div', {
		className: 'view'
	}, [
		checkbox,
		label,
		delete_button
	])
})


//
// Exports
//

module.exports = R.curry(function (send, state, item) {
	const classes_text = get_classes_text(R.applySpec({
		completed: R.prop('done'),
		editing: R.pipe(R.prop('id'), R.equals(state.editing))
	}, item))

	const children = R.juxt([
		render_list_item_view(send),
		render_edit_input(send)
	])(item)

	return h('li', {
		className: classes_text
	}, children)
})
