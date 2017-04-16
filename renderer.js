let scanAndFilter = require('./scanAndFilter.js');

window.onload = function() {
	
	var out = document.getElementById('out');
	
	// make window a drag target area
	dragAndDropify(window, (files) => {
		var filePaths = files.map((f) => {
			return f.path;
		});
	
		let finalPaths = [];
		files.forEach((f) => {
			let partial = scanAndFilter(f.path);
			finalPaths = finalPaths.concat(partial);
		});
		let txt = finalPaths.join('<br />');
		out.innerHTML = txt;
	});
};

function dragAndDropify(target, onFiles) {
	target.ondragover = () => {
		return false;
	};

	target.ondragleave = target.ondragend = () => {
		return false;
	};

	let files = [];

	target.ondrop = (e) => {
		e.preventDefault();
		for (let f of e.dataTransfer.files) {
			files.push(f);
		}
		onFiles(files);
		return false;
	};
}



