//
// Actions
//
// These return functions that can be applied to the global state to perform a change.
//

const R = require('ramda')
const uuid = require('uuid')


const get_item_path = R.flip(R.append)(['items'])


// Expects the item ID to remove and then the State object.
module.exports.delete_item = R.pipe(get_item_path, R.dissocPath)

module.exports.edit_item_cancel = R.assoc('editing', null)

module.exports.edit_item_done = function (item_id, label) {
	return R.pipe(
		R.assoc('editing', null),
		R.assocPath(['items', item_id, 'label'], label)
	)
}

// Expects the item ID to start editing and then the State object.
module.exports.edit_item_start = R.assoc('editing')

// NOTE: Ideally the generated keys would be sequential.
module.exports.new_item = function (label) {
	return R.assocPath(['items', uuid.v1()], {
		added: performance.now(),
		done: false,
		label: label
	})
}

module.exports.set_item_done_state = function (item_id, done) {
	return R.assocPath(['items', item_id, 'done'], done)
}
