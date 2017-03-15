const R = require('ramda')
const react = require('react')


module.exports = R.curryN(3, function (tag, attributes, children) {
	return R.apply(react.createElement, [tag, attributes].concat(children))
})
