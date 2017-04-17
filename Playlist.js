module.exports = function Playlist() {
	let items = [];
	let currentItem = 0;
	//let htmlNodes = [];
	let rootNode = null;

	let that = this;

	this.attachToHTMLNode = function(node) {
		rootNode = node;
		rootNode.addEventListener('dblclick', onSelectSong);
	};

	this.setItems = function(list) {
		items = list;
		rootNode.innerHTML = '';

		list.map((item) => {
			that.addItem(item);
		});
	};

	this.addItem = function(item) {
		items.push(item);
		
		let html = `<div data-src="${ item }">${ item }</div>`;
		rootNode.innerHTML += html;
	};

	this.playNextTrack = function() {
		let nextPosition = (currentItem + 1) % items.length;
		playSongAtPosition(nextPosition);
	};

	// Dummy
	this.onTrackPlay = function(trackPath) {};

	// When the user double clicks anywhere on the root
	function onSelectSong(e) {
		e.preventDefault();
		e.stopPropagation();
		let target = e.target;
		let src = target.dataset.src;
		if(src) {
			let songPosition = items.indexOf(src);
			playSongAtPosition(songPosition);
		}
	}

	function playSongAtPosition(pos) {
		// TODO: check we're not going out of bounds
		var songPath = items[pos];
		that.onTrackPlay(songPath);

		currentItem = pos;

		let rows = Array.from(rootNode.childNodes);
		rows.forEach((row) => {
			row.classList.remove('highlight');
		});
		let songRow = rows[pos];
		songRow.classList.add('highlight');
	}
	
};
