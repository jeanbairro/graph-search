function Searcher() {
	this.method = "";
}

Searcher.prototype.setMethod = function(method) {
	this.method = method;
};

Searcher.prototype.search = function(labelInitialVertice, labelWantedVertice, graph) {
	var initialVertice = graph.findVertice(labelInitialVertice);
	var wantedVertice = graph.findVertice(labelWantedVertice);

	if (!initialVertice || !wantedVertice) { /* Não sei se poderá ter essa verificação */
		alert("Informe vértices existentes!");
		return;
	}

	var visited = [];
	var path = new Path();

	this.method.search(initialVertice, wantedVertice.id, graph, path, visited);

	console.log(path);
	draw(path);
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
			if (!vertice.visited && graph.areAdjacentVertices(refVertice.id, vertice.id, graph.isDirected)) {
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
			if (!vertice.visited && graph.areAdjacentVertices(refVertice.id, vertice.id, graph.isDirected)) {
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