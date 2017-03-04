const R = require('ramda')
const react = require('react')
const react_dom = require('react-dom')
const uuid = require('uuid')


const h = R.curryN(3, function (tag, attributes, children) {
	return react.createElement.apply(null, [tag, attributes].concat(children))
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
	return function (item) {
		if (state.editing === item.id) {
			return input({
				value: item.label
			})

		} else {
			return h('li', {}, item.label)
		}
	}
}

function render_list (state) {
	return h('ul', {}, R.map(render_list_item(state), state.items))
}

function render (state) {
	let new_item_input = null

	return div(null, [
		h('header', {}, [
			h('h1', {}, 'todos')
		]),

		h('main', {}, render_list(state)),

		h('footer', {}, [
			h('form', {
				onSubmit: function (event) {
					event.preventDefault()

					const label = new_item_input.value.trim()
					console.log(label)

					if ('' != label) {
						state.send(new_item(label))
					}
				}
			}, [
				input({
					placeholder: 'What needs to be done?',
					ref: function (node) {
						new_item_input = node
					}
				})
			])
		])
	])
}


react_dom.render(render(global_state), document.getElementById('root'))
