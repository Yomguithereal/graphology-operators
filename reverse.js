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
  reversed.importNodes(graph.exportNodes());

  // Importing undirected edges
  reversed.importEdges(graph.exportUndirectedEdges());

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
