function Graph(isWeighted, isDirected, vertices, edges) {
	this.isWeighted = isWeighted || false;
	this.isDirected = isDirected || false;
	this.vertices = vertices || [];
	this.edges = edges || [];

	this.orderVertices = function () {
		this.vertices.sort(function(v1, v2) {
			if (v1.label < v2.label) {
				return -1;
			} else if (v1.label > v2.label) {
				return 1;
			}

			return 0;
		});
	}

	this.findVertice = function(label){
		var len = this.vertices.length;
		for (var i = 0; i < len; i++) {
			if (this.vertices[i].label == label) {
				return this.vertices[i];
			}
		}
	}

	this.areAdjacentVertices = function(idVertice1, idVertice2, isDirected) {
		var len = this.edges.length;
		if (isDirected === "true") {
			for (var i = 0; i < len; i++) {
				if (this.edges[i].idVertice1 == idVertice1 && this.edges[i].idVertice2 == idVertice2)
				{
					return true;
				}
			}
		}
		else {
			for (var i = 0; i < len; i++) {
				if (this.edges[i].idVertice1 == idVertice1 && this.edges[i].idVertice2 == idVertice2 ||
					this.edges[i].idVertice1 == idVertice2 && this.edges[i].idVertice2 == idVertice1)
				{
					return true;
				}
			}
		}

		return false;
	}

	this.setVerticeVisited = function(idVertice) {
		var len = this.vertices.length;
		for (var i = 0; i < len; i++) {
			if (this.vertices[i].id == idVertice) {
				return this.vertices[i].visited = true;
			}
		}
	}

	this.allVerticesVisited = function() {
		var len = this.vertices.length;
		for (var i = 0; i < len; i++) {
			if (!this.vertices[i].visited) {
				return false;
			}
		}

		return true;
	}

	this.firstVerticeNotVisited = function() {
		var len = this.vertices.length;
		for (var i = 0; i < len; i++) {
			if (!this.vertices[i].visited) {
				return this.vertices[i];
			}
		}		
	}

	this.verifyVerticeExists = function(label) {
		if (this.findVertice(label)) {
			return true;
		}

		return false;
	}
}

function Vertice(id, label, posX, posY) {
	this.id = id || -1;
	this.label = label || "";
	this.posX = posX || "";
	this.posY = posY || "";
	this.visited = false;
}

function Edge(idVertice1, idVertice2, weight) {
	this.idVertice1 = idVertice1 || -1;
	this.idVertice2 = idVertice2 || -2;
	this.weight = weight || 0;
}

function Path(vertices) {
	this.isConnected = true;
	this.vertices = vertices || [];

	this.setDesconnected = function() {
		this.isConnected = false;
	}
}

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
		debugger;
		if (refVertice.id == idWantedVertice) {
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

		var len = graph.vertices.length;
		for (var i = 0; i < len; i++) {
			var vertice = graph.vertices[i];
			if (!vertice.visited && graph.areAdjacentVertices(refVertice.id, vertice.id, graph.isDirected)) {
				path.vertices.push(vertice);
				if (vertice.id == idWantedVertice) {
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

function createGraphFromXml(xml) {
	var graph = xml.getElementsByTagName("Grafo")[0];
	var graph_isWeighted = graph.getAttributeNode("ponderado").value;
	var graph_isDirected = graph.getAttributeNode("dirigido").value;

	//Vertices
	var vertices = [];
	var verticesXml = xml.getElementsByTagName("Vertice");
	for (var i = 0; i < verticesXml.length; i++) {
		vertices.push(
			new Vertice(
				verticesXml[i].getAttributeNode("relId").value,
				verticesXml[i].getAttributeNode("rotulo").value,
				verticesXml[i].getAttributeNode("posX").value,
				verticesXml[i].getAttributeNode("posY").value
			)
		);
	}

	//Edges
	var edges = [];
	var edgesXml = xml.getElementsByTagName("Aresta");
	for (var i = 0; i < edgesXml.length; i++) {
		edges.push(
			new Edge(
				edgesXml[i].getAttributeNode("idVertice1").value,
				edgesXml[i].getAttributeNode("idVertice2").value,
				edgesXml[i].getAttributeNode("peso").value
			)
		);
	}

	return new Graph(graph_isWeighted, graph_isDirected, vertices, edges);
}

function start(xml) {
	var grafo = createGraphFromXml(xml);
	grafo.orderVertices();
	var seacher = new Searcher();
	
	var initial = $("#v_inicial").val();
	var final = $("#v_final").val();
	var method = $("#metodo").val();

	if (method == "1") {
		seacher.setMethod(new DepthFirstSearch());
	} else {
		seacher.setMethod(new BreadthFirstSearch());
	}
	
	seacher.search(initial, final, grafo);
}

function draw(path) {
	var canvas = document.getElementById('canvas');
	canvas.width  = $("body").width();
  	canvas.height = 500;
  	
  	if (canvas.getContext){
    	var ctx = canvas.getContext('2d');

    	path.vertices.forEach(function(vertice, index){
    		ctx.beginPath();
    		ctx.fillText((index+1)+"º", vertice.posX-3,vertice.posY-25);
    		ctx.arc(vertice.posX,vertice.posY,20,0,Math.PI*2,true);
    		ctx.fillText(vertice.label, vertice.posX-3,vertice.posY);
    		ctx.stroke();
    	});
	}

	$(".informacoes-grafo span#conexo").html(path.isConnected ? "Sim" : "Não");
	$(".informacoes-grafo").show("slow");
}