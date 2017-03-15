const R = require('ramda')
const uuid = require('uuid')


//
// Exports
//

// NOTE: Ideally the generated keys would be sequential.
module.exports = function (label) {
	return R.assocPath(['items', uuid.v1()], {
		added: performance.now(),
		done: false,
		label: label
	})
}
