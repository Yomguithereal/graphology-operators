/**
 * Graphology Utils Unit Tests
 * ============================
 */
var assert = require('assert'),
    Graph = require('graphology');

var union = require('./union.js');

describe('graphology-operators', function() {

  describe('union', function() {

    it('should throw if graphs are invalid.', function() {

      assert.throws(function() {
        union(null, new Graph());
      }, /valid/);

      assert.throws(function() {
        union(new Graph(), null);
      }, /valid/);
    });

    it('should throw if graphs are not both simple or both multi.', function() {
      var simpleGraph = new Graph(),
          multiGraph = new Graph(null, {multi: true});

      assert.throws(function() {
        union(simpleGraph, multiGraph);
      }, /multi/);
    });

    it('should produce the correct union of the given graphs.', function() {
      var G = new Graph(),
          H = new Graph();

      G.addNodesFrom([1, 2]);
      H.addNodesFrom([1, 3]);

      G.addEdgeWithKey('1->2', '1', '2');
      H.addEdgeWithKey('1->3', '1', '3');

      var R = union(G, H);

      assert.deepEqual(R.nodes(), ['1', '2', '3']);
      assert.deepEqual(R.edges(), ['1->2', '1->3']);
    });
  });
});
