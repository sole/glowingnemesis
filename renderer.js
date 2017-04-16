let scanAndFilter = require('./scanAndFilter.js');
let Playlist = require('./Playlist.js');

var out;
var playlistContainer;
var playlist;
var player;

window.onload = function() {
	
	out = document.getElementById('out');
	playlistContainer = document.getElementById('playlist');
	player = document.getElementById('player');

	playlist = new Playlist();
	playlist.attachToHTMLNode(playlistContainer);
	playlist.onTrackPlay = (trackPath) => {
		playSong(trackPath);
	};
	
	// Make window a drag target area
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
		// TODO use ID3 to show song title?
		playlist.setItems(finalPaths);
	});

	// Set up player (i.e. the <audio> element) events
	player.addEventListener('ended', playNextSong);

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

function playNextSong() {
	playlist.playNextTrack();
}

