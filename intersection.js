/**
 * Graphology Intersection Operator
 * ==========================
 */
var isGraph = require('graphology-utils/is-graph');
var Graph = require('graphology');

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

  var R = new Graph(null, {multi: G.multi}),
      nodes = G.nodes(),
      edges = G.edges(),
      gDirected,
      gEdge,
      hEdge,
      extremities,
      i, l;

  for (i = 0, l = nodes.length; i < l; i++)
    if (H.hasNode(nodes[i]))
      R.addNode(nodes[i]);

  for (i = 0, l = edges.length; i < l; i++) {
    gEdge = edges[i];
    gDirected = G.directed(gEdge);
    extremities = G.extremities(gEdge);

    hEdge = H.getEdge(extremities[0], extremities[1]);
    if (hEdge !== undefined && H.directed(gEdge) === gDirected) {
      if (gDirected)
        R.addDirectedEdgeWithKey(gEdge, extremities[0], extremities[1]);
      else
        R.addUndirectedEdgeWithKey(gEdge, extremities[0], extremities[1]);
    }
  }

  return R;
};
