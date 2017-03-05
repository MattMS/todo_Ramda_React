const R = require('ramda')
const react = require('react')
const react_dom = require('react-dom')
const uuid = require('uuid')


const ENTER_KEY = 13

const SHOW_ACTIVE = 'active'

const SHOW_ALL = 'all'

const SHOW_DONE = 'completed'


const h = R.curryN(3, function (tag, attributes, children) {
	return R.apply(react.createElement, [tag, attributes].concat(children))
})

const div = h('div')

function input (attributes) {
	return h('input', attributes, null)
}


let global_state = {
	filter: null,
	items: []
}

function send (action) {
	global_state = action(global_state)
	console.log(global_state)

	react_dom.render(render(global_state), document.getElementById('root'))
}

global_state.send = send


function new_item (label) {
	return R.over(R.lensProp('items'), R.append({
		done: false,
		id: uuid.v1(),
		label: label
	}))
}

function render_list_item (state) {
	const get_classes = R.pipe(
		R.applySpec({
			completed: R.prop('done'),
			editing: R.pipe(R.prop('id'), R.equals(state.editing))
		}),
		R.pickBy(R.nthArg(0)),
		R.keys(),
		R.join(' ')
	)

	return function (item) {
		let input_node = null

		const checkbox = input({
			checked: item.done,
			className: 'toggle',
			// onChange:
			type: 'checkbox',
		})

		const delete_button = h('button', {
			className: 'destroy'
			// onClick:
		}, null)

		const edit_input = input({
			className: 'edit',
			// onChange:
			// onBlur:
			// onKeyDown:
			ref: function (node) {
				input_node = node
			},
			value: item.label
		})

		const label = h('label', {
			// onDoubleClick:
		}, item.label)

		return h('li', {
			className: get_classes(item)
		}, [
			div({
				className: 'view'
			}, [
				checkbox,
				label,
				delete_button
			]),

			edit_input
		])
	}
}

function render_list (state) {
	return h('ul', {
		className: 'todo-list'
	}, R.map(render_list_item(state), state.items))
}

function render_new_input (state) {
	let new_item_input = null

	function onKeyDown (event) {
		if (event.keyCode !== ENTER_KEY) {
			return
		}

		event.preventDefault()

		const label = new_item_input.value.trim()
		console.log(label)

		if ('' != label) {
			new_item_input.value = ''

			state.send(new_item(label))
		}
	}

	return input({
		className: 'new-todo',
		onKeyDown: onKeyDown,
		placeholder: 'What needs to be done?',
		ref: function (node) {
			new_item_input = node
		}
	})
}

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

function render_footer (state) {
	return h('footer', {
		className: 'footer'
	}, [
		// h('span', {
		// 	className: 'todo-count'
		// }, [
		// 	h('strong', {
		// 	}, [
		// 	])
		// ]),

		h('ul', {
			className: 'filters'
		}, [
			li_a('All', '#/', 'selected'),
			li_a('Active', '#/active', ''),
			li_a('Completed', '#/completed', '')
		])
	])
}

function render (state) {
	return div(null, [
		h('header', {
			className: 'header'
		}, [
			h('h1', {}, 'todos'),
			render_new_input(state)
		]),

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


react_dom.render(render(global_state), document.getElementById('root'))

// https://github.com/tastejs/todomvc/blob/gh-pages/examples/react/js/app.jsx
