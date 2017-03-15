//
// Actions
//
// These return functions that can be applied to the global state to perform a change.
//

const R = require('ramda')


const get_item_path = R.flip(R.append)(['items'])


//
// Exports
//

// Expects the item ID to remove and then the State object.
module.exports.delete_item = R.pipe(get_item_path, R.dissocPath)

// Expects the item ID to start editing and then the State object.
module.exports.edit_item_start = R.assoc('editing')

module.exports.set_item_done_state = function (item_id, done) {
	return R.assocPath(['items', item_id, 'done'], done)
}
