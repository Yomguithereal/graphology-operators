/**
 * Graphology Utils Unit Tests
 * ============================
 */
var assert = require('assert'),
    Graph = require('graphology'),
    createTupleComparator = require('mnemonist/utils/comparators').createTupleComparator;

var reverse = require('./reverse.js');
var union = require('./union.js');
var disjointUnion = require('./disjoint-union.js');
var toDirected = require('./to-directed.js');
var toSimple = require('./to-simple.js');
var toUndirected = require('./to-undirected.js');

function addNodesFrom(graph, nodes) {
  nodes.forEach(function(node) {
    graph.addNode(node);
  });
}

function sortedEdgePairs(graph) {
  return graph.edges()
    .map(function(edge) {
      return graph.extremities(edge).sort();
    })
    .sort(createTupleComparator(2));
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

        assert.deepStrictEqual(R.nodes(), ['1', '2', '3']);
        assert.deepStrictEqual(R.edges(), ['1->2', '1->3']);
      });
    });

    describe('disjoint-union', function() {

      it('should throw if graphs are invalid.', function() {

        assert.throws(function() {
          disjointUnion(null, new Graph());
        }, /valid/);

        assert.throws(function() {
          disjointUnion(new Graph(), null);
        }, /valid/);
      });

      it('should throw if graphs are not both simple or both multi.', function() {
        var simpleGraph = new Graph(),
            multiGraph = new Graph({multi: true});

        assert.throws(function() {
          disjointUnion(simpleGraph, multiGraph);
        }, /multi/);
      });

      it('should produce the correct disjoint union of the given graphs.', function() {
        var G = new Graph(),
            H = new Graph();

        addNodesFrom(G, [1, 2]);
        addNodesFrom(H, [1, 3]);

        G.addEdge('1', '2');
        H.addEdge('1', '3');

        var R = disjointUnion(G, H);

        assert.deepStrictEqual(R.nodes(), ['0', '1', '2', '3']);

        var edges = sortedEdgePairs(R);

        assert.deepStrictEqual(edges, [['0', '1'], ['2', '3']]);
      });

      it('should produce the correct disjoint union of the given graphs with keyed edges.', function() {
        var G = new Graph(),
            H = new Graph();

        addNodesFrom(G, [1, 2]);
        addNodesFrom(H, [1, 3]);

        G.addEdgeWithKey('1->2', '1', '2');
        H.addEdgeWithKey('1->3', '1', '3');

        var R = disjointUnion(G, H);

        assert.deepStrictEqual(R.nodes(), ['0', '1', '2', '3']);

        var edges = sortedEdgePairs(R);

        assert.deepStrictEqual(edges, [['0', '1'], ['2', '3']]);
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
        assert.deepStrictEqual(graph.nodes(), copy.nodes());
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
        assert.deepStrictEqual(simpleGraph.nodes(), ['one', 'two']);
        assert.strictEqual(simpleGraph.size, 1);
      });
    });

    describe('toDirected', function() {
      it('should throw when given an invalid graph.', function() {
        assert.throws(function() {
          toDirected('test');
        }, /graphology/);
      });

      it('should only return a plain copy of a directed graph.', function() {
        var graph = new Graph({type: 'directed'});

        graph.mergeEdge(1, 2);

        var copy = toDirected(graph);

        assert.notStrictEqual(graph, copy);
        assert.deepStrictEqual(graph.nodes(), copy.nodes());
      });

      it('should properly cast graph to undirected version.', function() {
        var graph = new Graph({type: 'undirected'});

        graph.mergeEdge(1, 2);
        graph.mergeEdge(2, 1);
        graph.mergeEdge(3, 2, {weight: 30});

        var copy = toDirected(graph);

        assert.notStrictEqual(graph, copy);
        assert.strictEqual(copy.order, 3);
        assert.strictEqual(copy.size, 4);
        assert.strictEqual(copy.hasEdge(1, 2), true);
        assert.strictEqual(copy.hasEdge(2, 1), true);
        assert.strictEqual(copy.hasEdge(2, 3), true);
        assert.strictEqual(copy.hasEdge(3, 2), true);

        assert.deepStrictEqual(copy.getEdgeAttributes(3, 2), {weight: 30});
        assert.deepStrictEqual(copy.getEdgeAttributes(2, 3), {weight: 30});
      });

      it('should be possible to pass a `mergeEdge` function.', function() {
        var graph = new Graph();

        graph.mergeDirectedEdge(1, 2, {weight: 2});
        graph.mergeUndirectedEdge(1, 2, {weight: 4});

        var copy = toDirected(graph, function(current, next) {
          current.weight += next.weight;

          return current;
        });

        assert.notStrictEqual(graph, copy);
        assert.strictEqual(copy.type, 'directed');
        assert.strictEqual(copy.order, 2);
        assert.strictEqual(copy.size, 2);
        assert.strictEqual(copy.hasEdge(1, 2), true);
        assert.strictEqual(copy.hasEdge(2, 1), true);
        assert.strictEqual(copy.getEdgeAttribute(1, 2, 'weight'), 6);
        assert.strictEqual(copy.getEdgeAttribute(2, 1, 'weight'), 4);
      });
    });

    describe('toUndirected', function() {
      it('should throw when given an invalid graph.', function() {
        assert.throws(function() {
          toUndirected('test');
        }, /graphology/);
      });

      it('should only return a plain copy of an undirected graph.', function() {
        var graph = new Graph({type: 'undirected'});

        graph.mergeEdge(1, 2);

        var copy = toUndirected(graph);

        assert.notStrictEqual(graph, copy);
        assert.deepStrictEqual(graph.nodes(), copy.nodes());
      });

      it('should properly cast graph to undirected version.', function() {
        var graph = new Graph({type: 'directed'});

        graph.mergeEdge(1, 2);
        graph.mergeEdge(2, 1);
        graph.mergeEdge(3, 2);

        var copy = toUndirected(graph);

        assert.notStrictEqual(graph, copy);
        assert.strictEqual(copy.order, 3);
        assert.strictEqual(copy.size, 2);
        assert.strictEqual(copy.hasEdge(1, 2), true);
        assert.strictEqual(copy.hasEdge(2, 3), true);
      });

      it('should be possible to pass a `mergeEdge` function.', function() {
        var graph = new Graph({type: 'directed'});

        graph.mergeEdge(1, 2, {weight: 2});
        graph.mergeEdge(2, 1, {weight: 3});
        graph.mergeEdge(3, 2, {weight: 3});

        var copy = toUndirected(graph, function(current, next) {
          current.weight += next.weight;

          return current;
        });

        assert.notStrictEqual(graph, copy);
        assert.strictEqual(copy.order, 3);
        assert.strictEqual(copy.size, 2);
        assert.strictEqual(copy.hasEdge(1, 2), true);
        assert.strictEqual(copy.hasEdge(2, 3), true);
        assert.strictEqual(copy.getEdgeAttribute(1, 2, 'weight'), 5);
        assert.strictEqual(copy.getEdgeAttribute(3, 2, 'weight'), 3);
      });
    });
  });
});
