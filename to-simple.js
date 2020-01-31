/**
 * Graphology Operators To Simple Caster
 * ======================================
 *
 * Function used to cast a multi graph to a simple one.
 */
var isGraph = require('graphology-utils/is-graph');

module.exports = function toSimple(multiGraph, settings) {
  if (!isGraph(multiGraph))
    throw new Error('graphology-operators/cast/toSimple: expecting a valid graphology instance.');

  // The graph is not multi. We just return a plain copy
  if (!multiGraph.multi)
    return multiGraph.copy();
}
