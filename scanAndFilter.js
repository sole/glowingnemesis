let fs = require('fs');
let path = require('path');

function scanAndFilter(filePath) {
	let out = [];

	// recurse if directory
	if(isDirectory(filePath)) {
		let dirEntries = listDir(filePath);
		dirEntries.forEach((entry) => {
			let fullEntryPath = path.join(filePath, entry);
			out = out.concat(scanAndFilter(fullEntryPath));
		});
	} else {
		out.push(filePath);	
	}

	// finally filter out non music files
	let filteredOut = out.filter((f) => {
		return f.endsWith('.mp3') || f.endsWith('.ogg') || f.endsWith('.wav');
	});

	return filteredOut;
}

function isDirectory(filePath) {
	let s = fs.statSync(filePath);
	return s.isDirectory();
}

function listDir(dirPath) {
	var entries = fs.readdirSync(dirPath);
	return entries;
}

module.exports = scanAndFilter;
