import styles from "./titlebar.scss";
import useClassNames from "../utils/useClassNames";
import { Remote } from "electron";
import { useEffect, useState } from "react";

interface Props {
    backButton: boolean;
}

const TitleBar: React.FC<Props> = (props) => {
    const [remote, setRemote] = useState<Remote | null>(null);

    useEffect(() => {
        const electron = window.require("electron");
        setRemote(electron.remote);
    }, []);

    const handleBackClick = () => {
        window.history.back();
    };

    const handleMinimizeButtonClick = () => {
        if (remote) {
            remote.getCurrentWindow().minimize();
        }
    };

    const handleCloseButtonClick = () => {
        if (remote) {
            remote.getCurrentWindow().close();
        }
    };
    return (
        <div className={styles.bar}>
            <div className={styles.leftButtons}>
                {props.backButton ? (
                    <div className={styles.back} onClick={handleBackClick}>
                        🡨
                    </div>
                ) : (
                    ""
                )}
            </div>
            <div className={styles.rightButtons}>
                <div
                    className={useClassNames(styles.circle, styles.yellow)}
                    title="minimize"
                    onClick={handleMinimizeButtonClick}
                ></div>
                <div
                    className={useClassNames(styles.circle, styles.red)}
                    title="close"
                    onClick={handleCloseButtonClick}
                ></div>
            </div>
        </div>
    );
};

export default TitleBar;
