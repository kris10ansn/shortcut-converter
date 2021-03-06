const electron = require("electron")
const { remote, ipcRenderer } = electron
const Path = require("path")
const fs = require("fs")


// Add option to go back to the default icon?

const desktopPath = Path.join(require('os').homedir(), 'Desktop')
const urlFile = {
	name: undefined,
	contents: undefined,
	path: undefined
}
const preferences = {
	outputDir: desktopPath
}

let customIcon = undefined

function reset() {
	setIcon({path: undefined})
	setIconPathText("")

	urlFile.name = undefined
	urlFile.contents = undefined
	urlFile.path = undefined

	setUrlPathText("")
}

async function loadOptions() {
	const userDataPath = (electron.app || electron.remote.app).getPath("userData")
	const jsonPath = `${userDataPath}\\preferences.json`

	try {
		const json = JSON.parse(fs.readFileSync(jsonPath))

		if(json.outputDir)
			preferences.outputDir = json.outputDir
	} catch(error) {
		fs.writeFileSync(jsonPath, JSON.stringify(preferences))
	}
	setOutputDirText()
}
function setOutputDirectory(dir) {
	preferences.outputDir = dir.path

	const userDataPath = (electron.app || electron.remote.app).getPath("userData")
	const jsonPath = `${userDataPath}\\preferences.json`
	const json = JSON.parse(fs.readFileSync(jsonPath));
	json.outputDir = dir.path // Appends on to other data ( if added later )
	
	fs.writeFileSync(jsonPath, JSON.stringify(json))
	setOutputDirText()
}

function setOutputDirText() {
	const outputPath = document.getElementById("output-path")
	outputPath.innerText = preferences.outputDir
	outputPath.setAttribute("title", preferences.outputDir)
}

// File converting stuff

function setUrlFile(file) {
	if (!file)
		return;
	
	const outline = document.getElementById('chooseUrlFileOutline')
	outline.setAttribute('hidden', '')

	const reader = new FileReader()
	reader.onload = function () {
		urlFile.name = file.name.slice(0, -4)
		urlFile.contents = reader.result
		urlFile.path = file.path
	}
	reader.readAsText(file)
	setUrlPathText(file.path)
}

function setUrlPathText(text) {
	const urlPath = document.getElementById("urlPath")
	urlPath.innerText = text
	urlPath.setAttribute("title", text)
}

function setIcon(file) {
	customIcon = file.path
	setIconPathText(file.path)
}

function setIconPathText(text) {
	const iconPath = document.getElementById("iconPath")
	iconPath.innerText = text
	iconPath.setAttribute("title", text)
}

function createShortcut() {
	if (urlFile.contents) {
		ipcRenderer.send('createShortcut', getUrlFileProperties(urlFile), customIcon, preferences.outputDir)
		reset()
	} else {
		const outline = document.getElementById('chooseUrlFileOutline')
		outline.removeAttribute('hidden')
		outline.classList.remove('outline-error-animation')

		setTimeout(e => outline.classList.add('outline-error-animation'), 10)
	}
}

function getUrlFileProperties(file) {
	const {
		contents,
		path,
		name
	} = file
	const properties = {}

	const urlRegex = /URL=(.+)/g
	const iconRegex = /IconFile=(.+)/g

	properties.name = name
	properties.url = urlRegex.exec(contents)[1]
	properties.iconFile = iconRegex.exec(contents)[1]
	// Unnessecary, but just for consistency
	properties.path = path

	return properties
}


//

// Useful functions

function closeWindow(window) {
	if (window == undefined)
		window = remote.BrowserWindow.getFocusedWindow()
	window.close()
}

function minimizeWindow(window) {
	if (window == undefined)
		window = remote.BrowserWindow.getFocusedWindow()
	window.minimize()
}

function openWebsite(url) {
	electron.shell.openExternal(url)
}

document.getElementsByAttribute = function (attribute) {
	const all = [...document.getElementsByTagName('*')]
	let elements = []

	all.forEach(element => {
		if (element.getAttribute(attribute) !== null)
			elements.push(element)
	})

	return elements
}

//

// Add Triggers (trigger="[selector]" in html)

function addTriggers() {
	const elements = document.getElementsByAttribute('trigger')

	elements.forEach(element => {
		element.addEventListener('click', function () {
			const triggerId = element.getAttribute('trigger')
			document.getElementById(triggerId.substring(1)).click()
		})
	})
}

//

// Barba.js animation
let reverseTransition = false
const reversePageTransition = () => reverseTransition = true

window.addEventListener('load', () => {
	loadOptions()
	addTriggers()

	Barba.Pjax.start()

	const transition = Barba.BaseTransition.extend({
		start: function () {
			Promise
				.all([this.newContainerLoading, this.fadeOut()])
				.then(this.fadeIn.bind(this));
		},

		fadeOut: function () {
			const className = reverseTransition ? 'slide-out-reversed' : 'slide-out'
			this.oldContainer.classList.add(className)

			this.oldContainer.addEventListener('animationend', () => {
				this.oldContainer.classList.remove(className)
				addTriggers()
			})
		},

		fadeIn: function () {
			const className = reverseTransition ? 'slide-in-reversed' : 'slide-in'
			reverseTransition = false
			
			const name = this.newContainer.getAttribute("name")
			switch (name) {
				case "main":
					setOutputDirText();
					break;
			}
			
			this.newContainer.classList.add(className)

			this.newContainer.addEventListener('animationend', () => {
				this.newContainer.classList.remove(className)
				this.done()
			})

		}
	});

	Barba.Pjax.getTransition = function () {
		return transition;
	};
})

//