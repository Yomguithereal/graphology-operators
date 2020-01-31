/**
 * Graphology Revers Operator
 * ===========================
 */
var isGraph = require('graphology-utils/is-graph');

/**
 * Function reversing the given graph.
 *
 * @param  {Graph} graph - Target graph.
 * @return {Graph}
 */
module.exports = function reverse(graph) {
  if (!isGraph(graph))
    throw new Error('graphology-operators/reverse: invalid graph.');

  var reversed = graph.emptyCopy();

  // Importing the nodes
  graph.forEachNode(function(n, a) {
    reversed.addNode(n, a);
  });

  // Importing undirected edges
  graph.forEachUndirectedEdge(function(e) {
    reversed.importEdge(graph.exportEdge(e));
  });

  // Reversing directed edges
  var edges = graph.directedEdges(),
      edge,
      source,
      i,
      l;

  for (i = 0, l = edges.length; i < l; i++) {
    edge = graph.exportEdge(edges[i]);
    source = edge.source;
    edge.source = edge.target;
    edge.target = source;

    reversed.importEdge(edge);
  }

  return reversed;
};
