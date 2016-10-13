function Graph(isWeighted, isDirected, vertices, edges) {
	this.isWeighted = isWeighted || false;
	this.isDirected = isDirected || false;
	this.vertices = vertices || [];
	this.edges = edges || [];

	var _isDirected = isDirected === "true";

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

	this.areAdjacentVertices = function(idVertice1, idVertice2) {
		var len = this.edges.length;
		if (_isDirected) {
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

	this.returnEdge = function(idVertice1, idVertice2) {
		var len = this.edges.length;
		if (_isDirected) {
			for (var i = 0; i < len; i++) {
				if (this.edges[i].idVertice1 == idVertice1 && this.edges[i].idVertice2 == idVertice2)
				{
					return this.edges[i];
				}
			}
		}
		else {
			for (var i = 0; i < len; i++) {
				if (this.edges[i].idVertice1 == idVertice1 && this.edges[i].idVertice2 == idVertice2 ||
					this.edges[i].idVertice1 == idVertice2 && this.edges[i].idVertice2 == idVertice1)
				{
					return this.edges[i];
				}
			}
		}

		return null;
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

	this.firstVerticeFromPriorityDijkstra = function(dist) {
		var len = dist.length;
		var vertice_index = -1;
		var aux = Number.MAX_VALUE;
		for (var i = 0; i < len; i++) {
			if (!this.vertices[i].visited && dist[i] < aux) 
			{
				vertice_index = i;
				aux = dist[i];
			}
        }
        return this.vertices[vertice_index];
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

/*****************  A* *****************/
// function neighbors: function(map, currentPosition) {
// 	var ret = [];
// 	var x = node.pos.x;
// 	var y = node.pos.y;

// 	if(map[x-1] && map[x-1][y]) {
// 		ret.push(grid[x-1][y]);
// 	}
// 	if(grid[x+1] && grid[x+1][y]) {
// 		ret.push(grid[x+1][y]);
// 	}
// 	if(grid[x][y-1] && grid[x][y-1]) {
// 		ret.push(grid[x][y-1]);
// 	}
// 	if(grid[x][y+1] && grid[x][y+1]) {
// 		ret.push(grid[x][y+1]);
// 	}
// 	return ret;
// }

function Position(desc, x, y) {
	if (desc !== "" && desc.length > 0) {
		this.x = parseInt(desc.substr(0, 1)) - 1;
		this.y = parseInt(desc.substr(2, 3)) - 1;
	} else {
		this.x = x;
		this.y = y;	
	}
}

function Map(startPos, finalPos, itens) {
	this.startPosition = startPos;
	this.finalPosition = finalPos;
	this.itens = itens;
	
}

function MapItem(f, g, h, tile, parent) {
	this.f = f || 0;
	this.g = g || 0;
	this.h = h || 0;
	this.tile = tile || MapTileType.PATH;
	this.parent = parent || null;

}

function PathMap() {
	this.points = [];
}