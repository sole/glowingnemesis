let scanAndFilter = require('./scanAndFilter.js');

window.onload = function() {
	
	var out = document.getElementById('out');
	var playlist = document.getElementById('playlist');
	var player = document.getElementById('player');
	
	// make window a drag target area
	dragAndDropify(window, (files) => {
		let filePaths = files.map((f) => {
			return f.path;
		});
		out.innerHTML = filePaths.join('<br />');
	
		let finalPaths = [];
		files.forEach((f) => {
			// TODO: this should probably happen on the main process 8-)
			let partial = scanAndFilter(f.path);
			finalPaths = finalPaths.concat(partial);
		});
		// TODO replace this with a better 'playlist' component or something
		// TODO use ID3 to show song title?
		let items = finalPaths.map((f) => {
			return `<div data-src="${ f }">${ f }</div>`;
		}).join('');
		playlist.innerHTML = items;
	});

	playlist.addEventListener('dblclick', (e) => {
		console.log(e);
		e.preventDefault();
		let target = e.target;
		if(target.dataset.src) {
			playSong(target.dataset.src);
		}
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

function playSong(path) {
	player.src = path;
	player.play();
}

