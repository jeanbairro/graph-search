/* Constantes */
var MapTileType = Object.freeze({ NOW: 0, END: 1, PATH: 2, WALL: 3, VISITED: 4 });

function start(xml) {
	var seacher = new Searcher();
	var method = $("#method").val() || "1";

	if (method == "1") {
		seacher.setMethod(new DepthFirstSearch());
	} else if (method == "2") {
		seacher.setMethod(new BreadthFirstSearch());
	} else if (method == "3") {
		seacher.setMethod(new DijkstraSearch());
	} else {
		var map = createMapFromXml(xml);
		
	}

	if (method != "4") {
		var initial = $("#v_initial").val() || "";
		var final = $("#v_final").val() || "";
		
		var grafo = createGraphFromXml(xml);
		grafo.orderVertices();

		createSelectsFromVertices(grafo.vertices);

		if (initial !== "" && final !== "") {
			seacher.search(initial, final, grafo);
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
				parseFloat(edgesXml[i].getAttributeNode("peso").value) || 0
			)
		);
	}

	return new Graph(graph_isWeighted, graph_isDirected, vertices, edges);
}

function createMapFromXml(xml) {
	var qtd_linhas = parseInt(xml.getElementsByTagName("LINHAS")[0].innerHTML);
	var qtd_colunas = parseInt(xml.getElementsByTagName("COLUNAS")[0].innerHTML);
	var posicaoInicial = new Position(xml.getElementsByTagName("INICIAL")[0].innerHTML);
	var posicaoFinal = new Position(xml.getElementsByTagName("FINAL")[0].innerHTML);

	var muros = [];
	var murosXml = xml.getElementsByTagName("MURO");
	for (var i = 0; i < murosXml.length; i++) {
		muros.push(
			new Position (
				murosXml[i].innerHTML
			)
		);
	}

	var data = new Array(qtd_linhas);
	for (var i = 0; i < qtd_linhas; i++) {
		data[i] = new Array(qtd_colunas);
	}

	for (var i = 0; i < qtd_linhas; i++) {
		for (var j = 0; j < qtd_colunas; j++) {
			data[i][j] = new MapItem();
		}
	}

	for (var i = 0; i < muros.length; i++) {
		data[muros[i].x][muros[i].y] = new MapItem(0, 0, 0, MapTileType.WALL, null);
	}

	data[posicaoInicial.x][posicaoInicial.y] = new MapItem(0, 0, 0, MapTileType.NOW, null);;
	data[posicaoFinal.x][posicaoFinal.y] = new MapItem(0, 0, 0, MapTileType.END, null);;

	var printMap = "";
	for (var i = 0; i < qtd_linhas; i++) {
		printMap += "\n";
		for (var j = 0; j < qtd_colunas; j++) {
			printMap += data[i][j].tile + "\t";
		}
	}

	console.log(printMap);

	return new Map(posicaoInicial, posicaoFinal, data)	
}

function createSelectsFromVertices(vertices) {
	$("#v_initial").html('<option value="">Selecione</option>');
	$("#v_final").html('<option value="">Selecione</option>');

	for(var vertice in vertices)
	{
	  	$('<option value="'+vertices[vertice].label+'">'+vertices[vertice].label+'</option>').appendTo('#v_initial');
	  	$('<option value="'+vertices[vertice].label+'">'+vertices[vertice].label+'</option>').appendTo('#v_final');
	}
}

function draw(path) {
	if (path.vertices.length == 0) return;
	
	var $path = $("#path");
	var $success = $("#path-result .success");
	var $error = $("#path-result .error");
	var color = "primary";
	
	$success.hide();
	$error.hide();
	$path.hide();
	$path.html("");

	path.vertices.forEach(function(vertice, index){
		$path.append($('<div class="column"><div class="notification is-'+color+' has-text-centered"><p class="title">'+vertice.label+'</p></div></div>'));

		if (color == "primary") {
			color = "info";
		} else if (color == "info") {
			color = "success";
		} else if (color == "success") {
			color = "warning";
		} else if (color == "warning") {
			color = "danger";
		} else {
			color = "primary";
		}
	});

	$path.show("slow");

	if (path.found) {
		$success.show("slow");
	} else {
		$error.show("slow");
	}
}

function drawCosts(vertices, costs) {
	if (costs.length == 0) return;
	
	var $path = $("#path");
	var color = "primary";
	
	$path.hide();
	$path.html("");

	for (var i = 0; i < vertices.length; i++) {
		$path.append($('<div class="column"><div class="notification is-'+color+' has-text-centered"><p class="title">'+vertices[i].label+': '+cost(costs[i].cost)+ ' p: '+ costs[i].label +'</p></div></div>'));

		if (color == "primary") {
			color = "info";
		} else if (color == "info") {
			color = "success";
		} else if (color == "success") {
			color = "warning";
		} else if (color == "warning") {
			color = "danger";
		} else {
			color = "primary";
		}
	}

	$path.show("slow");
}


function cost(x) {
	if (x === Number.MAX_VALUE) {
		return "∞";
	} else {
		return x;
	}
}