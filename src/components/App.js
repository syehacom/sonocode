import React, { useEffect, useState } from "react";
import Editor from "./Editor";
import Split from "react-split";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEraser } from "@fortawesome/free-solid-svg-icons";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { makeStyles } from "@material-ui/core";
// import { faGithub } from "@fortawesome/free-brands-svg-icons";
import firebase from "../utils/Firebase";
import FormDialog from "./FormDialog";
import Skyway from "./Skyway";

// import useLocalStorage from "../hooks/useLocalStorage";
const database = firebase.database();

const introDoc = `<html>
      <body>
        <div style="height: 100vh; background-image: radial-gradient(circle, #263238, #212226);">
        <div style="font-family: 'Lato'" class="intro-text">
        <h1 style="font-size: 25px">
        はじめてみよう <span style="font-family: 'Rubik'; color:#b8b8b8">プログラミング</span>
        </h1>
        <p style="font-size: 20px"></p>
        </div></div>
      </body>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300&family=Rubik&display=swap');
        * {
            box-sizing: border-box; margin: 0; padding: 0;
        }
        .intro-text {
            color: gray; text-align: center; position: absolute; top: 50%; left: 50%; -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%);
        }
      </style>
    </html>`;

function App() {
    // const [html, setHtml] = useLocalStorage("html", "");
    // const [css, setCss] = useLocalStorage("css", "");
    // const [js, setJs] = useLocalStorage("js", "");
    // const [title, setTitle] = useLocalStorage("title", "");
    // const [srcDoc, setSrcDoc] = useState("");
    const [html, setHtml] = useState("");
    const [css, setCss] = useState("");
    const [js, setJs] = useState("");
    const [count, setCount] = useState(0);
    const [srcDoc, setSrcDoc] = useState("");
    const [value, setValue] = useState("");
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(false)

    const title = value;

    useEffect(() => {
        // setOpen(true);

        database.ref(title + "/html").on("value", (data) => {
            setHtml(data.val());
        });

        database.ref(title + "/css").on("value", (data) => {
            setCss(data.val());
        });

        database.ref(title + "/js").on("value", (data) => {
            setJs(data.val());
        });

        database.ref(title + "/count").on("value", (data) => {
            setCount(data.val());
        });
    }, [title]);

    const downloadHtml = () => {
        let htmlContent = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>${title}</title>
        <link rel="stylesheet" href="./styles.css">
    </head>
    <body>${html}</body>
    <script src="./script.js"></script>
</html>
            `;
        let link = document.getElementById("download-btn-html");
        let file = new Blob([htmlContent], { type: "html" });
        let downloadFile = "index.html";
        link.target = "_blank";
        link.href = URL.createObjectURL(file);
        link.download = downloadFile;
    };
    const downloadCss = () => {
        // CSS
        let cssLink = document.getElementById("download-btn-css");
        let cssFile = new Blob([css], { type: "css" });
        let cssDownloadFile = "styles.css";
        cssLink.target = "_blank";
        cssLink.href = URL.createObjectURL(cssFile);
        cssLink.download = cssDownloadFile;
    };
    const downloadJs = () => {
        // JS
        let jsLink = document.getElementById("download-btn-js");
        let jsFile = new Blob([js], { type: "js" });
        let jsDownloadFile = "script.js";
        jsLink.target = "_blank";
        jsLink.href = URL.createObjectURL(jsFile);
        jsLink.download = jsDownloadFile;
    };

    const clearEditor = () => {
        database.ref(title + "/html").set("");
        database.ref(title + "/css").set("");
        database.ref(title + "/js").set("");
        // database.ref("sketchify-title").set("");
    };

    // const handleOpen = () => {
    //     setOpen(true);
    // };

    const handleClose = () => {
        setOpen(false);
    };

    const setsHtml = (value) => {
        database.ref(title + "/html").set(value);
    };

    const setsCss = (value) => {
        database.ref(title + "/css").set(value);
    };

    const setsJs = (value) => {
        database.ref(title + "/js").set(value);
    };

    useEffect(() => {
        if (title === "") {
            document.title = "SyehaCode - Untitled";
        } else {
            document.title = "SyehaCode - " + title;
        }

        if (!(html === "" && css === "" && js === "")) {
            document.getElementById("iframe").classList.remove("disblock");
            document.getElementById("intro").classList.add("disblock");
        }

        const timeout = setTimeout(() => {
            setSrcDoc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>
      `);
        }, 250);

        return () => clearTimeout(timeout);
    }, [html, css, js, title]);

    useEffect(() => {
        window.addEventListener("beforeunload", (ev) => {
            ev.preventDefault();
            return (ev.returnValue = "Changes you made will not be saved.");
        });
    });
    
    const useStyles = makeStyles({
        root: {
            background: "#3f51b5",
            width: "100px",
            fontWeight: "bold",
            "&:hover": {
                background: "#3f51b5",
            },
        },
        buttonColor: {
            "&.Mui-selected": {
                backgroundColor: "#757ce8",
                color: "#ffffff",
            },
            "&.Mui-selected:hover": {
                background: "#757ce8",
            },
        },
    });
    const classes = useStyles();

    return (
        <div className="wrap-box">
            <nav className="nav-bar box1">
                <div className="logo">{value}</div>
                <FormDialog
                    isOpen={open}
                    doClose={() => handleClose()}
                    setValue={setValue}
                    value={value}
                />
                <div className="btn-container">
                    <ToggleButton
                        classes={{
                            root: classes.root, 
                            selected: classes.buttonColor,
                        }}
                        value="check"
                        selected={selected}
                        onChange={() => {
                            setSelected(!selected);
                        }}>
                        接続　{count}
                    </ToggleButton>
                    <a
                        href=" "
                        id="download-btn-html"
                        title="Download HTML file"
                        onClick={downloadHtml}>
                        <FontAwesomeIcon icon={faDownload} />
                        <div>HTML</div>
                    </a>
                    <a
                        href=" "
                        id="download-btn-css"
                        title="Download CSS file"
                        onClick={downloadCss}>
                        <FontAwesomeIcon icon={faDownload} />
                        <div>CSS</div>
                    </a>
                    <a
                        href=" "
                        id="download-btn-js"
                        title="Download JS file"
                        onClick={downloadJs}>
                        <FontAwesomeIcon icon={faDownload} />
                        <div>JS</div>
                    </a>
                    <div className="clear Code" onClick={clearEditor}>
                        <FontAwesomeIcon icon={faEraser} />
                        <div>クリア</div>
                    </div>
                </div>
            </nav>
            <Split sizes={[50, 50]} direction="vertical" className="box2">
                <Split className="pane top-pane box21" sizes={[33, 34, 33]}>
                    <Editor
                        language="text/html"
                        displayName="HTML"
                        value={html}
                        onChange={setsHtml}
                    />
                    <Editor
                        language="css"
                        displayName="CSS"
                        value={css}
                        onChange={setsCss}
                    />
                    <Editor
                        language="javascript"
                        displayName="JS"
                        value={js}
                        onChange={setsJs}
                    />
                </Split>
                <div className="pane box22">
                    <iframe
                        srcDoc={srcDoc}
                        title="output"
                        id="iframe"
                        sandbox="allow-scripts"
                        frameBorder="0"
                        width="100%"
                        height="100%"
                        className="disblock"
                    />
                    <iframe
                        srcDoc={introDoc}
                        title="intro"
                        id="intro"
                        sandbox="allow-scripts"
                        frameBorder="0"
                        width="100%"
                        height="100%"
                    />
                </div>
            </Split>
            <div
                // href="https://github.com/syehacom"
                target="_blank"
                rel="noopener noreferrer"
                id="github-link"
                className="text-center">
                {/* <FontAwesomeIcon icon={faGithub} />
                <span>&nbsp;syehacom</span> */}
                <Skyway value={value} selected={selected} count={count}/>
            </div>
        </div>
    );
}

export default App;
