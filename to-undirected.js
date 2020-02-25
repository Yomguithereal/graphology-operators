/**
 * Graphology Operators To Undirected Caster
 * ==========================================
 *
 * Function used to cast any graph to an undirected one.
 */
var isGraph = require('graphology-utils/is-graph');

module.exports = function toUndirected(graph) {
  if (!isGraph(graph))
    throw new Error('graphology-operators/to-undirected: expecting a valid graphology instance.');

  // options = options || {};

  if (graph.type === 'undirected')
    return graph.copy();

  var undirectedGraph = graph.emptyCopy({type: 'undirected'});

  // Adding nodes
  graph.forEachNode(function(node) {
    undirectedGraph.importNode(graph.exportNode(node));
  });

  // Adding undirected edges
  graph.forEachUndirectedEdge(function(edge) {
    undirectedGraph.importEdge(edge);
  });

  return undirectedGraph;
};
