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
	this.found = false;

	this.setDesconnected = function() {
		this.isConnected = false;
	}
}