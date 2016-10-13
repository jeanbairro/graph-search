function Searcher() {
	this.method = "";
}

Searcher.prototype.setMethod = function(method) {
	this.method = method;
};

Searcher.prototype.search = function(labelInitialVertice, labelWantedVertice, graph) {
	var initialVertice = graph.findVertice(labelInitialVertice);
	var wantedVertice = graph.findVertice(labelWantedVertice);

	var visited = [];

	var path = new Path();
	var costs = [];

	costs = this.method.search(initialVertice, wantedVertice.id, graph, path, visited);

	draw(path);
	drawCosts(graph.vertices, costs);
};

function DepthFirstSearch() {
	this.search = function(refVertice, idWantedVertice, graph, path, visitedStack) {
		if (refVertice.id == idWantedVertice) {
			path.found = true;
			path.vertices.push(refVertice);
			return;
		}

		if (!refVertice.visited) {
			graph.setVerticeVisited(refVertice.id);
			visitedStack.push(refVertice);
			path.vertices.push(refVertice);
		}

		var len = graph.vertices.length;
		for (var i = 0; i < len; i++) {
			var vertice = graph.vertices[i];
			if (!vertice.visited && graph.areAdjacentVertices(refVertice.id, vertice.id)) {
				return this.search(vertice, idWantedVertice, graph, path, visitedStack);
			}
		}

		visitedStack.pop();
		if (visitedStack.length > 0) {
			return this.search(visitedStack[visitedStack.length-1], idWantedVertice, graph, path, visitedStack);
		} else {
			if (graph.allVerticesVisited()) {
				return;
			}
			else {
				path.setDesconnected();
				return this.search(graph.firstVerticeNotVisited(), idWantedVertice, graph, path, visitedStack);
			}
		}
	}
}

function BreadthFirstSearch() {
	this.search = function (refVertice, idWantedVertice, graph, path, visitedQueue) {
		visitedQueue.shift();

		if (!refVertice.visited) {
			path.vertices.push(refVertice);
			graph.setVerticeVisited(refVertice.id);
		}

		if (refVertice.id == idWantedVertice) {
			path.found = true;
			return;
		}	

		var len = graph.vertices.length;
		for (var i = 0; i < len; i++) {
			var vertice = graph.vertices[i];
			if (!vertice.visited && graph.areAdjacentVertices(refVertice.id, vertice.id)) {
				path.vertices.push(vertice);
				if (vertice.id == idWantedVertice) {
					path.found = true;
					return;
				}
				visitedQueue.push(vertice);
				graph.setVerticeVisited(vertice.id);
			}
		}

		if (visitedQueue.length > 0) {
			return this.search(visitedQueue[0], idWantedVertice, graph, path, visitedQueue);
		} else {
			if (graph.allVerticesVisited()) {
				return;
			}
			else {
				path.setDesconnected();
				return this.search(graph.firstVerticeNotVisited(), idWantedVertice, graph, path, visitedQueue);
			}
		}
	}
}

function resultLine(cost, label) {
	this.cost = cost;
	this.label = label;
}

function DijkstraSearch() {
	this.search = function (refVertice, idWantedVertice, graph, path, dist) {
		var result = [];
		var len = graph.vertices.length;
		for (var i = 0; i < len; i++) {
			dist.push(Number.MAX_VALUE);
		}

		for (var i = 0; i < len; i++) {
			result.push(new resultLine(0, ""));
		}

		dist[refVertice.id] = 0;

		for (var i = 0; i < len; i++) {
			var vertice = graph.firstVerticeFromPriorityDijkstra(dist);

			if (typeof vertice == 'undefined') continue;

			graph.setVerticeVisited(vertice.id);

			for (var j = 0; j < len; j++) {
				var vertice_aux = graph.vertices[j];

				if (graph.areAdjacentVertices(vertice.id, vertice_aux.id)) {
					var edge = graph.returnEdge(vertice.id, vertice_aux.id);
					var x = dist[vertice.id] + edge.weight;
					if (dist[vertice_aux.id] > x) {
						dist[vertice_aux.id] = x;
						result[vertice_aux.id].label = vertice.label;
						result[vertice_aux.id].cost = x;
					}
				}
			}
		}

		return result;
	}
}