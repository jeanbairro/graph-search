function start(xml) {
	var grafo = createGraphFromXml(xml);
	grafo.orderVertices();
	var seacher = new Searcher();
	
	var initial = $("#v_initial").val() || "";
	var final = $("#v_final").val() || "";
	var method = $("#method").val() || "1";

	if (method == "1") {
		seacher.setMethod(new DepthFirstSearch());
	} else {
		seacher.setMethod(new BreadthFirstSearch());
	}

	createSelectsFromVertices(grafo.vertices);

	if (initial !== "" && final !== "") {
		seacher.search(initial, final, grafo);
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