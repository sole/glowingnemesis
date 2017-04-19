const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const fs = require('fs');
const mm = require('musicmetadata');

const scanAndFilter = require('./scanAndFilter');

let mainWindow;

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    app.quit();
});

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

ipcMain.on('scan-files', (event, files) => {
	let finalPaths = [];
	files.forEach((f) => {
		let partial = scanAndFilter(f);
		finalPaths = finalPaths.concat(partial);
	});

	finalPaths.forEach((fp) => {
		var rs = fs.createReadStream(fp);
		var parser = mm(rs, function (err, metadata) {
		  // if (err) throw err;
		  console.log(fp, metadata);
		  rs.close();
		});
	});

	// TODO use ID3 to show song title?
	finalPaths.forEach((fp) => {
		event.sender.send('file-scanned', fp);
	});
});

