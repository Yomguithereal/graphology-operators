/**
 * Graphology Operators
 * =====================
 *
 * Library endpoint.
 */
var disjunction = require('./disjunction.js');

exports.disjunction = disjunction;
exports.symmetricDifference = disjunction;
exports.reverse = require('./reverse.js');
exports.union = require('./union.js');
