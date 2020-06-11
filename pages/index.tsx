import { useState, useEffect } from "react";
import { NextPage } from "next";
import Link from "next/link";
import page from "../styles/page.scss";
import button from "../styles/button.scss";
import useClassNames from "../utils/useClassNames";
import fileChooser from "../utils/fileChooser";

const Home: NextPage = () => {
    const [outDir, setOutDir] = useState("");

    const onMount = () => {
        setOutDir("Hello, world");
    };

    useEffect(onMount, []);

    const handleSetOutputDir = async () => {
        const [directory] = await fileChooser({
            title: "Choose output directory",
            properties: ["openDirectory"],
        });

        setOutDir(directory);
    };

    const openWebsite = () => {
        const { shell } = window.require("electron");
        shell.openExternal("https://kris10ansn.github.io");
    };

    return (
        <div className={page.page}>
            <div className={page.header}>
                <h1>Shortcut Converter</h1>
            </div>
            <div className={button.container}>
                <Link href="/convert">
                    <button
                        className={useClassNames(button.button, button.green)}
                    >
                        Convert new
                    </button>
                </Link>

                <button
                    className={useClassNames(button.button, button.yellow)}
                    onClick={handleSetOutputDir}
                >
                    Set output directory
                    <p className={button.undertext}>{outDir}</p>
                </button>

                <button
                    className={useClassNames(button.button, button.red)}
                    onClick={openWebsite}
                >
                    More of Kristian Apps
                </button>
            </div>
        </div>
    );
};

export default Home;
