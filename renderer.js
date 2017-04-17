const { ipcRenderer } = require('electron');

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
	
		ipcRenderer.send('scan-files', filePaths);
		
	});

	// Set up player (i.e. the <audio> element) events
	player.addEventListener('ended', playNextSong);

};

ipcRenderer.on('file-scanned', (event, arg) => {
	out.innerHTML = 'scanned ' + JSON.stringify(arg);
	playlist.addItem(arg);
});

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

