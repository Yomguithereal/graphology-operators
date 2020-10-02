/**
 * Graphology Disjoint Union Operator
 * ===================================
 */
var isGraph = require('graphology-utils/is-graph');

/**
 * Function returning the disjoint union of two given graphs by giving new keys
 * to nodes & edges.
 *
 * @param  {Graph} G - The first graph.
 * @param  {Graph} H - The second graph.
 * @return {Graph}
 */
module.exports = function disjointUnion(G, H) {
  if (!isGraph(G) || !isGraph(H))
    throw new Error('graphology-operators/disjoint-union: invalid graph.');

  if (G.multi !== H.multi)
    throw new Error('graphology-operators/disjoint-union: both graph should be simple or multi.');

  var R = G.nullCopy();

  var labelsG = {};
  var labelsH = {};

  var i = 0;

  // Adding nodes
  G.forEachNode(function(key, attr) {
    labelsG[key] = i;

    R.addNode(i, attr);

    i++;
  });

  H.forEachNode(function(key, attr) {
    labelsH[key] = i;

    R.addNode(i, attr);

    i++;
  });

  // Adding edges
  i = 0;

  G.forEachEdge(function(key) {
    var edge = G.exportEdge(key);

    edge.source = labelsG[edge.source];
    edge.target = labelsG[edge.target];

    if (edge.key)
      edge.key = i++;

    R.importEdge(edge);
  });

  H.forEachEdge(function(key) {
    var edge = H.exportEdge(key);

    edge.source = labelsH[edge.source];
    edge.target = labelsH[edge.target];

    if (edge.key)
      edge.key = i++;

    R.importEdge(edge);
  });

  return R;
};
