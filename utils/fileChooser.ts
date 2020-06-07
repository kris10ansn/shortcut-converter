const fileChooser = async (options): Promise<String[]> =>
    new Promise(async (resolve, reject) => {
        const { remote } = window.require("electron");

        const prompt = await remote.dialog.showOpenDialog(options);

        if (!prompt.canceled) {
            resolve(prompt.filePaths);
        } else {
            reject("File chooser prompt cancelled");
        }
    });

export default fileChooser;
