//
// Render
//

const R = require('ramda')
const react = require('react')

const {delete_item, edit_item_cancel, edit_item_done, edit_item_start, new_item, set_item_done_state} = require('./actions')


const ENTER_KEY = 13

const ESC_KEY = 27

const SHOW_ACTIVE = 'active'

const SHOW_ALL = 'all'

const SHOW_DONE = 'completed'


//
// Helper functions
//

const get_item_count = R.pipe(R.prop('items'), R.keys, R.length)

// Merges a 2-item Array into an Object with the first item as the `id` value.
const merge_as_id = R.pipe(
	R.adjust(R.objOf('id'), 0),
	R.apply(R.merge)
)

const pick_by_true_values = R.pickBy(R.nthArg(0))

const sort_by_creation_time = R.sortBy(R.prop('added'))

// const sort_by_first_item = R.sortBy(R.prop(0))


// Composed helped functions

const get_classes_text = R.pipe(
	pick_by_true_values,
	R.keys(),
	R.join(' ')
)

const get_sorted_items = R.pipe(R.toPairs, sort_by_creation_time, R.map(merge_as_id))


//
// Common DOM structures
//

const h = R.curryN(3, function (tag, attributes, children) {
	return R.apply(react.createElement, [tag, attributes].concat(children))
})

const div = h('div')

// Using `flip` allows us to exclude children from `input` tags, so it only requires attributes.
const input = R.flip(h('input'))(null)


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
// Text inputs
//

const render_edit_input = R.curry(function (send, item) {
	let input_node = null

	function onKeyDown (event) {
		if (event.keyCode === ESC_KEY) {
			send(edit_item_cancel)
			return
		}

		if (event.keyCode !== ENTER_KEY) {
			return
		}

		event.preventDefault()

		const label = input_node.value.trim()

		if ('' !== label) {
			input_node.value = ''

			send(edit_item_done(item.id, label))
		}
	}

	return input({
		// autoFocus: true,
		className: 'edit',
		defaultValue: item.label,
		// onChange:
		onBlur: function (event) {
			send(edit_item_cancel)
		},
		onKeyDown: onKeyDown,
		ref: function (node) {
			input_node = node
		}
	})
})

const render_new_input = R.curry(function (send, state) {
	let input_node = null

	function onKeyDown (event) {
		if (event.keyCode !== ENTER_KEY) {
			return
		}

		event.preventDefault()

		const label = input_node.value.trim()

		if ('' !== label) {
			input_node.value = ''

			send(new_item(label))
		}
	}

	return input({
		// autoFocus: true,
		className: 'new-todo',
		onKeyDown: onKeyDown,
		placeholder: 'What needs to be done?',
		ref: function (node) {
			input_node = node
		}
	})
})


//
// List
//

const render_list_item_view = R.curry(function (send, item) {
	const checkbox = input({
		checked: item.done,
		className: 'toggle',
		onChange: function (event) {
			send(set_item_done_state(item.id, R.not(item.done)))
		},
		type: 'checkbox'
	})

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

	return div({
		className: 'view'
	}, [
		checkbox,
		label,
		delete_button
	])
})

const render_list_item = R.curry(function (send, state) {
	return function (item) {
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
	}
})

const render_list = R.curry(function (send, state) {
	const items = get_sorted_items(state.items)

	return h('ul', {
		className: 'todo-list'
	}, R.map(render_list_item(send, state), items))
})


//
// Main layout
//

const render_footer = R.curry(function (send, state) {
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

const render_header = R.curry(function (send, state) {
	return h('header', {
		className: 'header'
	}, [
		h('h1', {}, 'todos'),
		render_new_input(send, state)
	])
})


//
// Main export
//

module.exports = R.curry(function (send, state) {
	return div(null, [
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
