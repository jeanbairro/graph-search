function readXml(evt) {
	var file = evt.target.files[0];

	if (file) {
		var reader = new FileReader();
		reader.onload = function (e) {
			var xml = $.parseXML(e.target.result);
			start(xml);
		};
		reader.readAsText(file);
	} else { 
		console.log("Falha na leitura do XML.");
	}
}