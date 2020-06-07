const { BrowserWindow, app, protocol, dialog } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const url = require("url");

const createWindow = () => {
    let window = new BrowserWindow({
        width: 600,
        height: 600,
        title: "Next Electron App",
        resizable: false,
        darkTheme: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    window.setMenu(null);

    if (isDev) {
        window.loadURL("http://localhost:3000");
    } else {
        protocol.interceptFileProtocol(
            "file",
            (request, callback) => {
                const url = request.url.substr(7);
                if (request.url.endsWith("index.html")) {
                    callback({ path: url });
                } else {
                    callback({
                        path: path.normalize(`${__dirname}/out/${url}`),
                    });
                }
            },
            (error) => console.error(error)
        );

        window.loadURL(
            url.format({
                pathname: buildPath,
                protocol: "file:",
                slashes: true,
            })
        );
    }

    window.webContents.openDevTools();
};

app.whenReady().then(() => {
    createWindow();
});

app.on("window-all-closed", () => app.quit());
