/**
 * Graphology Intersection Operator
 * ==========================
 */
var isGraph = require('graphology-utils/is-graph');

/**
 * Function returning the intersection of two given graphs.
 *
 * @param  {Graph} G - The first graph.
 * @param  {Graph} H - The second graph.
 * @return {Graph}
 */
module.exports = function intersection(G, H) {
  if (!isGraph(G) || !isGraph(H))
    throw new Error('graphology-operators/intersection: invalid graph.');

  if (G.multi !== H.multi)
    throw new Error('graphology-operators/intersection: both graph should be simple or multi.');

  var R = G.emptyCopy(),
      nodes = G.nodes(),
      node,
      edges = G.edges(),
      gDirected,
      gEdge,
      hEdge,
      extremities,
      i, l;

  for (i = 0, l = nodes.length; i < l; i++) {
    node = nodes[i];
    if (H.hasNode(node)) {
      R.addNode(node, G.getNodeAttributes(node));
      R.mergeNodeAttributes(node, H.getNodeAttributes(node));
    }
  }

  for (i = 0, l = edges.length; i < l; i++) {
    gEdge = edges[i];
    gDirected = G.directed(gEdge);
    extremities = G.extremities(gEdge);

    hEdge = H.getEdge(extremities[0], extremities[1]);
    if (hEdge !== undefined && H.directed(hEdge) === gDirected) {
      if (gDirected)
        R.addDirectedEdgeWithKey(hEdge, extremities[0], extremities[1]);
      else
        R.addUndirectedEdgeWithKey(hEdge, extremities[0], extremities[1]);
      R.mergeEdgeAttributes(hEdge, G.getEdgeAttributes(gEdge));
      R.mergeEdgeAttributes(hEdge, H.getEdgeAttributes(hEdge));
    }
  }

  return R;
};
