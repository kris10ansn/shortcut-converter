import { NextPage } from "next";
import page from "../styles/page.scss";
import button from "../styles/button.scss";
import useClassNames from "../utils/useClassNames";
import fileChooser from "../utils/fileChooser";
import { useState } from "react";

const Convert: NextPage = () => {
    const [iconFile, setIconFile] = useState("");

    const handleSelectFile = async () => {
        const [file] = await fileChooser({
            title: "Find .url file to convert",
            properties: ["openFile"],
        });
    };

    const handleChangeIcon = async () => {
        const [file] = await fileChooser({
            title: "Find icon file",
            properties: ["openFile"],
            filters: [
                { name: "Icon files", extensions: ["ico", "exe", "dll"] },
            ],
        });

        if (file) {
            setIconFile(file);
        }
    };

    return (
        <div className={page.page}>
            <div className={page.header}>
                <h1>Convert Shortcut</h1>
            </div>
            <div className={button.container}>
                <button
                    className={useClassNames(button.button, button.green)}
                    onClick={handleSelectFile}
                >
                    Select file
                </button>

                <button
                    className={useClassNames(button.button, button.yellow)}
                    onClick={handleChangeIcon}
                >
                    Change icon
                    <p className={button.undertext}>
                        {iconFile && iconFile.length > 0
                            ? iconFile
                            : "(Optional)"}
                    </p>
                </button>

                <button className={useClassNames(button.button, button.red)}>
                    Create shortcut
                </button>
            </div>
        </div>
    );
};

export default Convert;
