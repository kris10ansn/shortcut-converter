const {
	app,
	BrowserWindow,
	ipcMain,
	// globalShortcut
} = require('electron')
const Path = require('path')
const url = require('url')
const Shortcut = require("windows-shortcuts")

const appDirectory = Path.join(__dirname, '..')

/** @type { BrowserWindow } */
let mainWindow

function createWindow() {

	// Create browser window
	mainWindow = new BrowserWindow({
		title: "Taskbar shortcut converter",
		frame: false,
		resizable: false,
		icon: "./images/icon.png",
		webPreferences: {
			nodeIntegration: true
		},
		width: 600,
		height: 600,
	});

	mainWindow.setMenu(null)

	// Load index.html
	mainWindow.loadURL(url.format({
		pathname: Path.join(appDirectory, 'pages', 'main', 'index.html'),
		protocol: 'file:',
		slashes: true
	}));
	
	// Activate devtools on start
	// mainWindow.webContents.openDevTools();

	// Devtools shortcut (ctrl+shift+i)
	// (require globalShortcut to work (commented out))

	// globalShortcut.register('CommandOrControl+Shift+i', () => {
	// 	console.log("This feature should be removed when published, and if i don't im an idiot")
	// 	mainWindow.webContents.openDevTools();
	// })

	mainWindow.on('close', () => {
		mainWindow = null
	});
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})


ipcMain.on('resize', (event, size) => {
	const {
		width,
		height
	} = size

	mainWindow.setSize(
		width,
		height
	)
})

ipcMain.on('createShortcut', (event, urlFile, customIcon, dir) => {
	createShortcutFile(urlFile, customIcon, dir)
})

const highlight = path => require('child_process').exec(`explorer.exe /select, "${path}"`);

async function createShortcutFile(fileProperties, customIcon, dir) {
	const {
		url,
		name
	} = fileProperties
	const path = `${dir}\\${name}.lnk`
	const iconFile = customIcon ? customIcon : fileProperties.iconFile

	Shortcut.create(
		path, {
			target: "%comspec%", // Enviroment variable that links to cmd.exe
			args: `/c start ${url}`, // starts the url, /c makes sure the window closes afterwards
			runStyle: Shortcut.MIN, // Starts command promt minimized so it doesnt confuse anyone
			desc: `Converted shortcut that runs ${name}.`, // Description
			icon: iconFile
		},
		error => {
			if (error) {
				console.error(error)
			} else {
				highlight(path)
			}
		}
	)
}