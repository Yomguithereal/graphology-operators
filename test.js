/**
 * Graphology Utils Unit Tests
 * ============================
 */
var assert = require('assert'),
    Graph = require('graphology');

var reverse = require('./reverse.js');
var union = require('./union.js');
var toSimple = require('./to-simple.js');

function addNodesFrom(graph, nodes) {
  nodes.forEach(function(node) {
    graph.addNode(node);
  });
}

describe('graphology-operators', function() {

  describe('unary', function() {
    describe('reverse', function() {
      it('should throw if graph is invalid.', function() {

        assert.throws(function() {
          reverse(null);
        }, /valid/);
      });

      it('should correctly reverse the given graph.', function() {
        var graph = new Graph();

        addNodesFrom(graph, ['John', 'Martha', 'Ada']);
        graph.addEdgeWithKey('J->M', 'John', 'Martha');
        graph.addUndirectedEdgeWithKey('M<->A', 'Martha', 'Ada');

        var reversed = reverse(graph);

        assert.strictEqual(graph.order, reversed.order);
        assert.strictEqual(graph.size, reversed.size);

        assert.strictEqual(reversed.hasDirectedEdge('Martha', 'John'), true);
      });
    });
  });

  describe('binary', function() {
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
            multiGraph = new Graph({multi: true});

        assert.throws(function() {
          union(simpleGraph, multiGraph);
        }, /multi/);
      });

      it('should produce the correct union of the given graphs.', function() {
        var G = new Graph(),
            H = new Graph();

        addNodesFrom(G, [1, 2]);
        addNodesFrom(H, [1, 3]);

        G.addEdgeWithKey('1->2', '1', '2');
        H.addEdgeWithKey('1->3', '1', '3');

        var R = union(G, H);

        assert.deepEqual(R.nodes(), ['1', '2', '3']);
        assert.deepEqual(R.edges(), ['1->2', '1->3']);
      });
    });
  });

  describe('cast', function() {
    describe('toSimple', function() {
      it('should throw when given an invalid graph.', function() {
        assert.throws(function() {
          toSimple('test');
        }, /graphology/);
      });

      it('should only return a plain copy of a simple graph.', function() {
        var graph = new Graph();

        graph.mergeEdge(1, 2);

        var copy = toSimple(graph);

        assert.notStrictEqual(graph, copy);
        assert.deepEqual(graph.nodes(), copy.nodes());
      });

      it('should return a simple graph from a multi one.', function() {
        var multiGraph = new Graph({multi: true});

        multiGraph.mergeEdge('one', 'two');
        multiGraph.addEdge('one', 'two');
        multiGraph.addEdge('one', 'two');

        assert.strictEqual(multiGraph.order, 2);
        assert.strictEqual(multiGraph.size, 3);

        var simpleGraph = toSimple(multiGraph);

        assert.strictEqual(simpleGraph.multi, false);
        assert.deepEqual(simpleGraph.nodes(), ['one', 'two']);
        assert.strictEqual(simpleGraph.size, 1);
      });
    });
  });
});
