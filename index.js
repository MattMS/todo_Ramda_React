const R = require('ramda')
const react = require('react')
const react_dom = require('react-dom')
const uuid = require('uuid')


const ENTER_KEY = 13

const ESC_KEY = 27

const SHOW_ACTIVE = 'active'

const SHOW_ALL = 'all'

const SHOW_DONE = 'completed'


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
// State
//

let global_state = {
	filter: null,
	items: {}
}

function send (action) {
	global_state = action(global_state)
	console.log(global_state)

	react_dom.render(render(global_state), document.getElementById('root'))
}


//
// Helper functions
//

const get_item_count = R.pipe(R.prop('items'), R.keys, R.length)

const get_item_path = R.flip(R.append)(['items'])

// Merges a 2-item Array into an Object with the first item as the `id` value.
const merge_as_id = R.pipe(
	R.adjust(R.objOf('id'), 0),
	R.apply(R.merge)
)

const pick_by_true_values = R.pickBy(R.nthArg(0))

const sort_by_creation_time = R.sortBy(R.prop('added'))

const sort_by_first_item = R.sortBy(R.prop(0))


// Composed helped functions

const get_classes_text = R.pipe(
	pick_by_true_values,
	R.keys(),
	R.join(' ')
)

const get_sorted_items = R.pipe(R.toPairs, sort_by_creation_time, R.map(merge_as_id))


//
// Actions
//
// These return functions that can be applied to the global state to perform a change.
//

// Expects the item ID to remove and then the State object.
const delete_item = R.pipe(get_item_path, R.dissocPath)

const edit_item_cancel = R.assoc('editing', null)

function edit_item_done (item_id, label) {
	return R.pipe(
		R.assoc('editing', null),
		R.assocPath(['items', item_id, 'label'], label)
	)
}

// Expects the item ID to start editing and then the State object.
const edit_item_start = R.assoc('editing')

// NOTE: Ideally the generated keys would be sequential.
function new_item (label) {
	return R.assocPath(['items', uuid.v1()], {
		added: performance.now(),
		done: false,
		label: label
	})
}

function set_item_done_state (item_id, done) {
	return R.assocPath(['items', item_id, 'done'], done)
}


//
// Text inputs
//

function render_edit_input (item) {
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
}

function render_new_input (state) {
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
}


//
// List
//

function render_list_item_view (item) {
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
}

function render_list_item (state) {
	return function (item) {
		const classes_text = get_classes_text(R.applySpec({
			completed: R.prop('done'),
			editing: R.pipe(R.prop('id'), R.equals(state.editing))
		}, item))

		const children = R.juxt([
			render_list_item_view,
			render_edit_input
		])(item)

		return h('li', {
			className: classes_text
		}, children)
	}
}

function render_list (state) {
	const items = get_sorted_items(state.items)

	return h('ul', {
		className: 'todo-list'
	}, R.map(render_list_item(state), items))
}


//
// Main layout
//

function render_footer (state) {
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
}

function render_header (state) {
	return h('header', {
		className: 'header'
	}, [
		h('h1', {}, 'todos'),
		render_new_input(state)
	])
}

function render (state) {
	return div(null, [
		render_header(state),

		h('section', {
			className: 'main'
		}, [
			input({
				className: 'toggle-all',
				type: 'checkbox'
			}),

			render_list(state)
		]),

		render_footer(state)
	])
}


//
// First render
//

react_dom.render(render(global_state), document.getElementById('root'))
