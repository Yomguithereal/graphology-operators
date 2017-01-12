[![Build Status](https://travis-ci.org/graphology/graphology-operators.svg)](https://travis-ci.org/graphology/graphology-operators)

# Graphology Operators

Miscellaneous operators to be used with [`graphology`](https://graphology.github.io).

## Installation

```
npm install graphology-operators
```

## Usage

*Unary*

* [reverse](#reverse)

*Binary*

* [union](#union)
* [disjunction](#disjunction)

### reverse

Reverse the given graph's directed edges.

```js
import {reverse} from 'graphology-operators';
// Alternatively, to load only the relevant code:
import reverse from 'graphology-operators/reverse';

const reversedGraph = reverse(graph);
```

*Arguments*

* **graph** *Graph*: target graph.

### union

Returns the union of the given graphs. Nodes & edges present in both graph will have their attributes merges with precedence given to the second graph.

```js
import {union} from 'graphology-operators';
// Alternatively, to load only the relevant code:
import union from 'graphology-operators/union';

const R = union(G, H);
```

### disjunction

Returns the disjunction of the given graphs.

```js
import {disjunction} from 'graphology-operators';
// Alternatively, to load only the relevant code:
import disjunction from 'graphology-operators/disjunction';

// alias
import {symmetricDifference} from 'graphology-operators';
import symmetricDifference from 'graphology-operators/symmetric-difference';

const R = disjunction(G, H);
```

*Arguments*

* **G** *Graph*: first graph.
* **H** *Graph*: second graph.
