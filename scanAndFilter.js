function scanAndFilter(filePath) {
	let out = [];

	// recurse if directory
	if(isDirectory(filePath)) {
		out = out.concat(scanAndFilter(filePath));
	} else {
		out.push(filePath);	
	}

	// finally filter out non music files
	let filteredOut = out.filter((f) => {
		return f.endsWith('.mp3') || f.endsWith('.ogg');
	});

	return filteredOut;
}

function isDirectory(filePath) {
	return false; // TODO
}

module.exports = scanAndFilter;
