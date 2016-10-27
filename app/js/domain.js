function Graph(isWeighted, isDirected, vertices, edges) {
	this.isWeighted = isWeighted || false;
	this.isDirected = isDirected || false;
	this.vertices = vertices || [];
	this.edges = edges || [];
	this.colors = [' #0033cc', '#00cc99', '#9933ff', '#00cc66', '#00ff00', '#ff66ff', '#99ff66', '#ffff66', '#ff9933', '#ff0000'];

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

	this.getQtdEdgeFromVertice = function(idVertice) {
		var qtd = 0;
		var len = this.edges.length;
		for (var i = 0; i < len; i++) 
		{
			if (this.edges[i].idVertice1 == idVertice  || this.edges[i].idVertice2 == idVertice)
			{
				qtd++;
			}
		}

		return qtd;
	}

	this.orderVerticesByEdgeQtd = function () {
		for (var i = 0; i < this.vertices.length; i++) {
			for (var j = 0; j < this.vertices.length; j++) {
				if (this.getQtdEdgeFromVertice(vertices[j].id) < this.getQtdEdgeFromVertice(vertices[i].id)){
					var aux = vertices[i];
					vertices[i] = vertices[j];
					vertices[j] = aux; 
				}
			}	
		}
	}

	this.color = function() {
		for (var i = 0; i < this.vertices.length; i++) {
			if (!this.vertices[i].visited) {
				var color = this.firstColor(this.vertices[i]);
				this.vertices[i].color = color;
				this.setVerticeVisited(this.vertices[i].id);

				for (var j = 0; j < this.vertices.length; j++) {
					this.orderVertices();
					if (!this.vertices[j].visited && this.areAdjacentVertices(this.vertices[i].id, this.vertices[j].id)) {
						this.vertices[j].color = this.firstColor(this.vertices[j]);
						this.setVerticeVisited(this.vertices[j].id);
					}
				}
			}
		}
	}

	this.firstColor = function(vertice) {
		for (var i = 0; i < this.colors.length; i++) {
			var corDisponivel = true;

			for (var j = 0; j < this.vertices.length; j++) {
				if (this.areAdjacentVertices(vertice.id, this.vertices[j].id)) {
					if (this.colors[i] == this.vertices[j].color) {
						corDisponivel = false;
					}
				}
			}

			if (corDisponivel) {
				return this.colors[i];
			}
		}
	} 
}

function Vertice(id, label, posX, posY) {
	this.id = id || -1;
	this.label = label || "";
	this.posX = posX || "";
	this.posY = posY || "";
	this.visited = false;
	this.color = "";
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
function removeItem(array, mapItem) {
	for (var i = 0; i < array.length; i++) {
		if (array[i].position.x == mapItem.position.x && array[i].position.y == mapItem.position.y)
		{
			array.splice(i);
		}
	}

	return array;
}

function findItem(array, mapItem) {
 	for (var i = 0; i < array.length; i++) {
		if (array[i].position.x == mapItem.position.x && array[i].position.y == mapItem.position.y)
		{
			return array[i];
		}
	}

	return null;
}

function updateItem(array, mapItem) {
 	for (var i = 0; i < array.length; i++) {
		if (array[i].position.x == mapItem.position.x && array[i].position.y == mapItem.position.y)
		{
			array[i].g = mapItem.g;
			array[i].h = mapItem.h;
			array[i].f = mapItem.f;
			array[i].parent = mapItem.parent;
		}
	}
}

function SearchAStar() {
	this.search = function(map) {
		var openedList   = [];
		var closedList = [];
		openedList.push(map.start);
 
		while (openedList.length > 0) {
			var aux = 0;
			for (var i = 0; i < openedList.length; i++) {
				if (openedList[i].f < openedList[aux].f) 
				{ 
					aux = i; 
				}
			}

			var currentItem = openedList[aux];

			console.log(currentItem.position.x + "," + currentItem.position.y + " - G: " + currentItem.g + ", F: " + currentItem.f);
 			
			if(currentItem.position.x == map.final.position.x && currentItem.position.y == map.final.position.y) {
				var curr = currentItem;
				var ret = [];
				while(curr.parent) {
					ret.push(curr);
					curr = curr.parent;
				}

				return ret.reverse();
			}
 
			openedList = [];
			closedList.push(currentItem);
			
			var neighbors = this.neighbors(map, currentItem);
 
			for(var i = 0; i < neighbors.length; i++) {
				var neighbor = neighbors[i];
				if (findItem(closedList, neighbor) || neighbor.tile == MapTileType.WALL) {
					continue;
				}
 
				var gScore = currentItem.g + this.cost(currentItem, neighbor);
 
				if(!findItem(openedList, neighbor)) { 
					openedList.push(neighbor);
				}
				else if(gScore >= neighbor.g) {
					continue;
				}
 
				neighbor.parent = currentItem;
				neighbor.g = gScore;
				neighbor.f = neighbor.g + (this.heuristic(neighbor.position, map.final.position) * 10);
			}
		}
 
		return [];
	},
	this.heuristic = function(pos0, pos1) {
		var d1 = Math.abs ((pos1.x+1) - (pos0.x+1));
		var d2 = Math.abs ((pos1.y+1) - (pos0.y+1));
		return d1 + d2;
	},
	this.neighbors = function(map, mapItem) {
		var ret = [];
		var x = mapItem.position.x;
		var y = mapItem.position.y;
 
		if(map.itens[x-1] && map.itens[x-1][y]) {
			ret.push(map.itens[x-1][y]);
		}
		
		if(map.itens[x+1] && map.itens[x+1][y]) {
			ret.push(map.itens[x+1][y]);
		}
		
		if(map.itens[x][y-1] && map.itens[x][y-1]) {
			ret.push(map.itens[x][y-1]);
		}
		
		if(map.itens[x][y+1] && map.itens[x][y+1]) {
			ret.push(map.itens[x][y+1]);
		}

		/* Diagonal */
        if(map.itens[x-1] && map.itens[x-1][y-1]) {
            ret.push(map.itens[x-1][y-1]);
        }

        if(map.itens[x+1] && map.itens[x+1][y-1]) {
            ret.push(map.itens[x+1][y-1]);
        }

        if(map.itens[x-1] && map.itens[x-1][y+1]) {
            ret.push(map.itens[x-1][y+1]);
        }

        if(map.itens[x+1] && map.itens[x+1][y+1]) {
            ret.push(map.itens[x+1][y+1]);
        }

		return ret;
	},
	this.cost = function(item1, item2) {
		if (item1.position.x - 1 == item2.position.x && item1.position.y - 1 == item2.position.y) {
			return 14;
		} if (item1.position.x + 1 == item2.position.x && item1.position.y - 1 == item2.position.y) {
			return 14;
		} if (item1.position.x - 1 == item2.position.x && item1.position.y + 1 == item2.position.y) {
			return 14;
		} if (item1.position.x + 1 == item2.position.x && item1.position.y + 1 == item2.position.y) {
			return 14;
		}

		return 10;
	}
};

function Position(desc, x, y) {
	if (desc !== "" && desc.length > 0) {
		this.x = parseInt(desc.substr(0, desc.indexOf(","))) - 1;
		this.y = parseInt(desc.substr(desc.indexOf(",") + 1)) - 1;
	} else {
		this.x = x;
		this.y = y;	
	}
}

function Map(start, final, itens) {
	this.start = start;
	this.final = final;
	this.itens = itens;
	
}

function MapItem(f, g, h, tile, parent, position) {
	this.f = f || 0;
	this.g = g || 0;
	this.h = h || 0;
	this.tile = tile || MapTileType.PATH;
	this.parent = parent || null;
	this.position = position || null;
}

function PathMap() {
	this.points = [];
}