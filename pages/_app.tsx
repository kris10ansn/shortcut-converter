import "../styles/root.scss";
import TitleBar from "../components/titlebar";
import { AppProps } from "next/app";

const NextApp = ({ Component, pageProps, router }: AppProps) => {
    return (
        <>
            <TitleBar backButton={router.route !== "/"} />
            <Component {...pageProps} />
        </>
    );
};

export default NextApp;
