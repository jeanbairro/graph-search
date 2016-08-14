function Xml(src) {
	if (window.XMLHttpRequest) {
   		xhttp = new XMLHttpRequest();
	} else {
		alert('Browser not supported!');
	}

	xhttp.overrideMimeType('text/xml');

	/* Para ler um arquivo sem utilizar um servidor http, veja isso: how-to-read-files-without-http-server.txt */
	xhttp.open("GET", src, false);
	xhttp.send(null);
	xmlDoc = xhttp.responseXML;

	return {
		xmlDoc
	};
}

function Graph(isWeighted, isDirected, vertices, edges) {
	this.isWeighted = isWeighted || false;
	this.isDirected = isDirected || false;
	this.vertices = vertices || [];
	this.edges = edges || [];
}

function Vertice(relId, label) {
	this.relId = relId || -1;
	this.label = label || "";
}

function createGraphFromXml(xml) {
	
}

function start() {
	var grafoXml = new Xml("grafo.xml");
	console.log(grafoXml);

	var grafo = new Graph();
	console.log(grafo);
}