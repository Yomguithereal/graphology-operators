/**
 * Graphology Disjunction Operator
 * ==========================
 */
var isGraph = require('graphology-utils/is-graph');

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

  var R = G.emptyCopy(),
      nodes = G.nodes().concat(H.nodes()),
      gEdges = G.edges(),
      edges = gEdges.concat(H.edges()),
      threshold = gEdges.length,
      graph = G,
      opposite = H,
      method = {true: 'addDirectedEdgeWithKey', false: 'addUndirectedEdgeWithKey'},
      node,
      edge,
      extremities,
      directed,
      gFlag,
      hFlag,
      i, l, o;

  for (i = 0, l = nodes.length; i < l; i++) {
    node = nodes[i];
    gFlag = G.hasNode(node);
    hFlag = H.hasNode(node);

    if (gFlag && !hFlag)
      R.addNode(node, G.getAttributes(node));
    else if (!gFlag && hFlag)
      R.addNode(node, H.getAttributes(node));
  }

  for (i = 0, l = edges.length; i < l; i++) {
    if (i === threshold) {
      o = graph;
      graph = opposite;
      opposite = o;
    }
    edge = edges[i];
    directed = graph.directed(edge);
    extremities = graph.extremities(edge);

    if (!opposite.hasNode(extremities[0]) && !opposite.hasNode(extremities[1]))
      R[method[directed]](edge, extremities[0], extremities[1]);
  }

  return R;
};
