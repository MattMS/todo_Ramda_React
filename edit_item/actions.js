const R = require('ramda')


//
// Exports
//

module.exports.edit_item_cancel = R.assoc('editing', null)

module.exports.edit_item_done = function (item_id, label) {
	return R.pipe(
		R.assoc('editing', null),
		R.assocPath(['items', item_id, 'label'], label)
	)
}
