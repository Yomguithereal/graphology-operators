/**
 * Graphology Disjunction Operator
 * ==========================
 */
var isGraph = require('graphology-utils/is-graph');
var Graph = require('graphology');

/**
 * Function returning the disjunction of two given graphs.
 *
 * @param  {Graph} G - The first graph.
 * @param  {Graph} H - The second graph.
 * @return {Graph}
 */
module.exports = function disjunction(G, H) {
  if (!isGraph(G) || !isGraph(H))
    throw new Error('graphology-operators/disjunction: invalid graph.');

  if (G.multi !== H.multi)
    throw new Error('graphology-operators/disjunction: both graph should be simple or multi.');

  var R = new Graph(null, {multi: G.multi}),
      nodes = G.nodes().concat(H.nodes()),
      gEdges = G.edges(),
      hEdges = H.edges(),
      edges = gEdges.concat(hEdges),
      threshold = gEdges.length,
      graph = G,
      opposite = H,
      method = {true: 'addDirectedEdgeWithKey', false: 'addUndirectedEdgeWithKey'},
      node,
      edge,
      extremities,
      directed,
      i, l, xor;

  for (i = 0, l = nodes.length; i < l; i++) {
    node = nodes[i];
    xor = (G.hasNode(node) * 0b10) + (H.hasNode(node) * 0b01);

    if (xor === 0b10)
      R.addNode(node, G.getAttributes(node))
    else if (xor === 0b01)
      R.addNode(node, H.getAttributes(node))
  }
  for (i = 0, l = edges.length; i < l; i++) {
    if (i === threshold)
      [graph, opposite] = [opposite, graph];
    edge = edges[i];
    directed = graph.directed(edge);
    extremities = graph.extremities(edge);

    if (!opposite.hasNode(extremities[0]) && !opposite.hasNode(extremities[1]))
      R[method[directed]](edge, extremities[0], extremities[1]);
  }

  return R;
};




