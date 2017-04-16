let scanAndFilter = require('./scanAndFilter.js');

var out, playlist, player;

window.onload = function() {
	
	out = document.getElementById('out');
	playlist = document.getElementById('playlist');
	player = document.getElementById('player');
	
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
		playlist.innerHTML = '';
		playlist.innerHTML = items;
	});

	// Set up player (i.e. the <audio> element) events
	player.addEventListener('ended', playNextSong);

	playlist.addEventListener('dblclick', (e) => {
		e.preventDefault();
		let target = e.target;
		if(target.dataset.src) {
			playSongAtNode(target);
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

function playerHighlightRow(songNode) {
	// TODO temporary, should go away once I have a proper playlist object
	let playlistContainer = songNode.parentNode;
	let items = Array.from(playlistContainer.childNodes);
	items.forEach((item) => {
		item.classList.remove('highlight');
	});
	songNode.classList.add('highlight');
}

function playSongAtNode(node) {
	playSong(node.dataset.src);
	playerHighlightRow(node);
}

function playSong(path) {
	player.src = path;
	player.play();
}

function playNextSong() {
	// TODO this is very clumsy and temporary
	let currentRow = document.querySelector('#playlist div.highlight');
	let allRows = Array.from(playlist.querySelectorAll('div'));
	let position = 0;
	for(let i = 0; i < allRows.length; i++) {
		let r = allRows[i];
		if(r === currentRow) {
			position = i;
			break;
		}
	}

	position = (position + 1) % allRows.length;
	let nextRow = allRows[position];
	playSongAtNode(nextRow);
}

