import React, { useState, useEffect, forwardRef } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Fade from "@material-ui/core/Fade";
import Codialog from "./Codialog";
import Redialog from "./Redialog";
import MediaCard from "./MediaCard";
import firebase from "../utils/Firebase";
import { useForm } from "react-hook-form";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ReactPlayer from "react-player";
import Fab from "@material-ui/core/Fab";
import { SocialIcon } from "react-social-icons";
import * as FadeIn from "../components/FadeIn";
import useMedia from "use-media";
import "firebase/auth";

// import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogTitle from "@material-ui/core/DialogTitle";

const database = firebase.database();
firebase
    .auth()
    .signInAnonymously()
    .catch((error) => console.log(error));

const FormDialog = ({ isOpen, doClose, setValue }) => {
    const [open, setOpen] = useState(false);
    const [commDlg, setCommDlg] = useState(false);
    const [enter, setEnter] = useState(false);
    const [title, setTitle] = useState("");
    const [valid, setValid] = useState("");
    const [alignment, setAlignment] = useState("left");
    const [dialog, setDialog] = useState("");
    const [random, setRandom] = useState(false);
    const [choice, setChoice] = useState(" を作成しますか");
    const [openmov, setOpenmov] = useState(false);

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    const makeRandom = () => {
        const S =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const N = 10;
        const rand = Array.from(Array(N))
            .map(() => S[Math.floor(Math.random() * S.length)])
            .join("");
        setValid(rand);
        setRandom(true);
        handleDo();
    };

    const handleDo = () => {
        setCommDlg(true);
        setEnter(false);
    };

    const handleCancel = () => {
        setOpen(false);
        doClose();
    };

    const execute = () => {
        if (alignment === "left") {
            firebase
                .database()
                .ref("data/" + valid)
                .once("value", (snapshot) => {
                    if (snapshot.exists()) {
                        setEnter(true);
                        setDialog("すでに使われています");
                    } else {
                        setTitle(valid);
                        setEnter(true);
                        database.ref("data/" + valid).set({
                            title: valid,
                            html: "",
                            css: "",
                            js: "",
                            timestamp: firebase.database.ServerValue.TIMESTAMP,
                        });
                        setCommDlg(false);
                        handleCancel();
                    }
                });
        } else {
            firebase
                .database()
                .ref("data/" + valid)
                .once("value", (snapshot) => {
                    if (snapshot.exists()) {
                        setTitle(valid);
                        setCommDlg(false);
                        handleCancel();
                    } else {
                        setEnter(true);
                        setDialog("ページがありません");
                    }
                });
        }
    };

    const { register, handleSubmit, errors } = useForm();

    const onSubmit = (data) => {
        // console.log(data); // 送信するデータ
    };

    const comment = title;

    const handleAlignment = (event, newAlignment) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment);
            if (newAlignment === "left") {
                setChoice(" を作成しますか");
            } else {
                setChoice(" を利用しますか");
            }
        }
    };

    const handleOpen = () => {
        setOpenmov(true);
    };

    const handleClose = () => {
        setOpenmov(false);
    };

    const useStyles = makeStyles((theme) => ({
        root: {
            fontSize: "18px",
        },
        buttonColor: {
            "&.Mui-selected": {
                backgroundColor: "#3f51b5",
                color: "#ffffff",
                fontSize: "18px",
            },
        },
        extendedIcon: {
            marginRight: theme.spacing(1),
            backgroundColor: "#3f51b5",
            color: "#ffffff",
            fontSize: "22px",
        },
    }));
    const classes = useStyles();
    const isWide = useMedia({ minWidth: "1025px" });

    return (
        <div className="open">
            <span>{setValue(comment)}</span>
            <form onChange={handleSubmit(onSubmit)}>
                <Dialog
                    fullScreen
                    open={open}
                    // onClose={handleCancel}
                    TransitionComponent={Transition}
                    transitionDuration="0"
                    keepMounted
                    aria-labelledby="form-dialog-title">
                    {isWide ? (
                        <div className="all">
                            <header>
                                <div className="two"></div>
                                <div className="carousel-caption">
                                    <div className="content">
                                        SONO
                                        <br></br>
                                        <span className="contentchild1">
                                            CODE{" "}
                                            <span className="contentchild2">
                                                &lt;/&gt;
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </header>
                            <main>
                                <FadeIn.Up>
                                    <div className="flex-container">
                                        <div className="flex-item">
                                            <h1>
                                                そのコードを簡単&amp;便利に共有
                                            </h1>
                                            <p>
                                                まずは、ページを作成してみよう。
                                                {/* <span role="img" aria-label="emoji">
                                            😃
                                        </span> */}
                                                ページ名を共有して音声チャットやプレビューを使いプログラミングを教えたり、一緒に考えたりしよう。
                                            </p>
                                            <div className="movie">
                                                <Fab
                                                    variant="extended"
                                                    onClick={handleOpen}
                                                    className={
                                                        classes.extendedIcon
                                                    }>
                                                    動画を見てみよう
                                                </Fab>
                                                <Dialog
                                                    onClose={handleClose}
                                                    aria-labelledby="simple-dialog-title"
                                                    open={openmov}>
                                                    <ReactPlayer
                                                        url="https://youtu.be/Uu9F5Pug6jI"
                                                        height="500px"
                                                        width="600px"
                                                        controls
                                                        playing
                                                        muted
                                                    />
                                                </Dialog>
                                            </div>
                                        </div>
                                        <div className="three flex-item"></div>
                                    </div>
                                </FadeIn.Up>
                                <FadeIn.Up>
                                    <div className="flex-container">
                                        <div className="four flex-item"></div>
                                        <div className="flex-item">
                                            <h1>はじめてみよう！</h1>
                                            <p>
                                                GoogleChrome
                                                でご利用ください。
                                            </p>
                                            <div className="toggle">
                                                <ToggleButtonGroup
                                                    // orientation="vertical"
                                                    value={alignment}
                                                    exclusive
                                                    onChange={handleAlignment}
                                                    aria-label="text alignment">
                                                    <ToggleButton
                                                        classes={{
                                                            selected:
                                                                classes.buttonColor,
                                                            root: classes.root,
                                                        }}
                                                        value="left"
                                                        aria-label="left aligned">
                                                        作成する
                                                    </ToggleButton>
                                                    <ToggleButton
                                                        classes={{
                                                            selected:
                                                                classes.buttonColor,
                                                            root: classes.root,
                                                        }}
                                                        value="right"
                                                        aria-label="right aligned">
                                                        利用する
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                                <DialogContent>
                                                    {/* <DialogContentText></DialogContentText> */}
                                                    <TextField
                                                        inputProps={{
                                                            style: {
                                                                fontSize: 18,
                                                            },
                                                        }} // font size of input text
                                                        InputLabelProps={{
                                                            style: {
                                                                fontSize: 18,
                                                            },
                                                        }} // font size of input label
                                                        defaultValue=""
                                                        autoFocus
                                                        name="body"
                                                        margin="normal"
                                                        id="name"
                                                        label="ページ名"
                                                        type="text"
                                                        className={
                                                            classes.textField
                                                        }
                                                        fullWidth
                                                        onChange={(e) =>
                                                            setValid(
                                                                e.target.value
                                                            )
                                                        }
                                                        inputRef={register({
                                                            required: true,
                                                            minLength: 10,
                                                            // pattern: /^([a-zA-Z0-9]{10,})$/,
                                                        })}
                                                        error={Boolean(
                                                            errors.body
                                                        )}
                                                        helperText={
                                                            errors.body &&
                                                            "10文字以上にして下さい。"
                                                        }
                                                    />
                                                </DialogContent>
                                                <DialogActions>
                                                    {valid && (
                                                        <Button
                                                            disabled={Boolean(
                                                                errors.body
                                                            )}
                                                            type="submit"
                                                            onClick={handleDo}
                                                            color="primary">
                                                            OK
                                                        </Button>
                                                    )}
                                                    {!valid && (
                                                        <Button
                                                            disabled={Boolean(
                                                                alignment ===
                                                                    "right"
                                                            )}
                                                            type="submit"
                                                            onClick={makeRandom}
                                                            color="primary">
                                                            ランダム
                                                        </Button>
                                                    )}
                                                </DialogActions>
                                            </div>
                                        </div>
                                    </div>
                                </FadeIn.Up>
                                <FadeIn.Up>
                                    <div className="user">
                                        <h1>ニーズに合わせた使い方をしよう</h1>
                                    </div>
                                    <div className="flex-card">
                                        <div className="flex-item">
                                            <MediaCard
                                                shop1={
                                                    "https://thumbs.dreamstime.com/z/programing-language-design-illustration-eps-graphic-65093426.jpg"
                                                }
                                                shop2={"プログラミングの授業"}
                                                shop3={
                                                    "リモートでの教室運営に適しています"
                                                }
                                            />
                                        </div>
                                        <div className="flex-item">
                                            <MediaCard
                                                shop1={
                                                    "https://thumbs.dreamstime.com/z/young-programmers-coding-new-project-big-tablet-ps-phone-flat-modern-illustration-programmer-laptop-using-programmimg-137771074.jpg"
                                                }
                                                shop2={"障がいがある方への支援"}
                                                shop3={
                                                    "事業所での作業や訓練に活用できます"
                                                }
                                            />
                                        </div>
                                        <div className="flex-item">
                                            <MediaCard
                                                shop1={
                                                    "https://image.freepik.com/free-vector/programmer-concept-illustration_114360-2284.jpg"
                                                }
                                                shop2={"クライアントとの打合せ"}
                                                shop3={
                                                    "デザインの確認や共有に役に立ちます"
                                                }
                                            />
                                        </div>
                                    </div>
                                </FadeIn.Up>
                            </main>
                            <footer className="container">
                                <div style={{ marginTop: 1 + "em" }}></div>
                                <div>
                                    <p className="footer">
                                        当サイトの利用については下記内容を確認し、承諾した上でご利用ください。
                                        次に掲げるページの作成は禁止とします。投稿内容が禁止事項に該当すると判断した場
                                        合は、作成者に事前に何ら通知することなく、ページの削除その他必要な措置を取ることとします。
                                        【禁止事項】
                                        ・本人の同意のない第三者の個人情報であって、プライバシーなど個
                                        人の権利利益を侵害するもの
                                        ・法令等に違反し、又は違反する恐れのあるもの
                                        ・公序良俗に反するもの・
                                        人権侵害となるもの・
                                        特定の個人、企業、団体等を誹謗中傷するもの
                                        ・その他、当サイトが不適切と判断したもの。
                                        一定期間後にページは完全に消去されますが、
                                        作成したページが破壊、消失または変更された場合で
                                        あっても当サイトは一切責任を負いません。
                                    </p>
                                    <div className="credit">
                                        SONOCODE　　©2021 Syehacom　
                                        <SocialIcon
                                            style={{
                                                height: 35,
                                                width: 35,
                                            }}
                                            url="https://twitter.com/sonocode_syeha"
                                        />
                                    </div>
                                    <br></br>
                                    <br></br>
                                </div>
                            </footer>
                        </div>
                    ) : (
                        <div className="all">
                            <header>
                                <div className="_two"></div>
                                <div className="_carousel-caption">
                                    <div className="_content">
                                        SONO
                                        <br></br>
                                        <span className="_contentchild1">
                                            CODE{" "}
                                            <span className="_contentchild2">
                                                &lt;/&gt;
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </header>
                            <main>
                                <FadeIn.Up>
                                    <div className="_flex-container">
                                        <div className="_flex-item">
                                            <h2>
                                                そのコードを簡単&amp;便利に共有
                                            </h2>
                                            <h3>
                                                まずは、ページを作成してみよう。
                                                <br></br>
                                                {/* <span role="img" aria-label="emoji">
                                            😃
                                        </span> */}
                                                ページ名を共有して音声チャットやプレビューを使いプログラミングを教えたり一緒に考えたりしよう。
                                            </h3>
                                            <div className="_movie">
                                                <Fab
                                                    variant="extended"
                                                    onClick={handleOpen}
                                                    className={
                                                        classes.extendedIcon
                                                    }>
                                                    動画を見てみよう
                                                </Fab>
                                                <Dialog
                                                    onClose={handleClose}
                                                    aria-labelledby="simple-dialog-title"
                                                    open={openmov}>
                                                    <ReactPlayer
                                                        url="https://youtu.be/Uu9F5Pug6jI"
                                                        height="250px"
                                                        width="280px"
                                                        controls
                                                        playing
                                                        muted
                                                    />
                                                </Dialog>
                                            </div>
                                        </div>
                                    </div>
                                </FadeIn.Up>
                                <FadeIn.Up>
                                    <div className="_flex-container">
                                        <div className="_flex-item">
                                            <h2>はじめてみよう！</h2>
                                            <h3>
                                                GoogleChromeでご利用ください。
                                            </h3>
                                            <div className="_toggle">
                                                <ToggleButtonGroup
                                                    // orientation="vertical"
                                                    value={alignment}
                                                    exclusive
                                                    onChange={handleAlignment}
                                                    aria-label="text alignment">
                                                    <ToggleButton
                                                        classes={{
                                                            selected:
                                                                classes.buttonColor,
                                                            root: classes.root,
                                                        }}
                                                        value="left"
                                                        aria-label="left aligned">
                                                        作成する
                                                    </ToggleButton>
                                                    <ToggleButton
                                                        classes={{
                                                            selected:
                                                                classes.buttonColor,
                                                            root: classes.root,
                                                        }}
                                                        value="right"
                                                        aria-label="right aligned">
                                                        利用する
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                                <DialogContent>
                                                    {/* <DialogContentText></DialogContentText> */}
                                                    <TextField
                                                        inputProps={{
                                                            style: {
                                                                fontSize: 18,
                                                            },
                                                        }} // font size of input text
                                                        InputLabelProps={{
                                                            style: {
                                                                fontSize: 18,
                                                            },
                                                        }} // font size of input label
                                                        defaultValue=""
                                                        autoFocus
                                                        name="body"
                                                        margin="normal"
                                                        id="name"
                                                        label="ページ名"
                                                        type="text"
                                                        className={
                                                            classes.textField
                                                        }
                                                        fullWidth
                                                        onChange={(e) =>
                                                            setValid(
                                                                e.target.value
                                                            )
                                                        }
                                                        inputRef={register({
                                                            required: true,
                                                            minLength: 10,
                                                            // pattern: /^([a-zA-Z0-9]{10,})$/,
                                                        })}
                                                        error={Boolean(
                                                            errors.body
                                                        )}
                                                        helperText={
                                                            errors.body &&
                                                            "10文字以上にして下さい。"
                                                        }
                                                    />
                                                </DialogContent>
                                                <DialogActions>
                                                    {valid && (
                                                        <Button
                                                            disabled={Boolean(
                                                                errors.body
                                                            )}
                                                            type="submit"
                                                            onClick={handleDo}
                                                            color="primary">
                                                            OK
                                                        </Button>
                                                    )}
                                                    {!valid && (
                                                        <Button
                                                            disabled={Boolean(
                                                                alignment ===
                                                                    "right"
                                                            )}
                                                            type="submit"
                                                            onClick={makeRandom}
                                                            color="primary">
                                                            ランダム
                                                        </Button>
                                                    )}
                                                </DialogActions>
                                            </div>
                                        </div>
                                    </div>
                                </FadeIn.Up>
                                <FadeIn.Up>
                                    <div className="_user">
                                        <h2>
                                            ニーズに合わせた<br></br>
                                            使い方をしよう
                                        </h2>
                                    </div>
                                    <div className="_flex-card">
                                        <div className="_flex-use">
                                            <MediaCard
                                                shop1={
                                                    "https://thumbs.dreamstime.com/z/programing-language-design-illustration-eps-graphic-65093426.jpg"
                                                }
                                                shop2={"プログラミングの授業"}
                                                shop3={
                                                    "リモートでの教室運営に適しています"
                                                }
                                            />
                                        </div>
                                        <div className="_flex-use">
                                            <MediaCard
                                                shop1={
                                                    "https://thumbs.dreamstime.com/z/young-programmers-coding-new-project-big-tablet-ps-phone-flat-modern-illustration-programmer-laptop-using-programmimg-137771074.jpg"
                                                }
                                                shop2={"障がいがある方への支援"}
                                                shop3={
                                                    "事業所での作業や訓練に活用できます"
                                                }
                                            />
                                        </div>
                                        <div className="_flex-use">
                                            <MediaCard
                                                shop1={
                                                    "https://image.freepik.com/free-vector/programmer-concept-illustration_114360-2284.jpg"
                                                }
                                                shop2={"クライアントとの打合せ"}
                                                shop3={
                                                    "デザインの確認や共有に役に立ちます"
                                                }
                                            />
                                        </div>
                                    </div>
                                </FadeIn.Up>
                            </main>
                            <footer className="container">
                                <div style={{ marginTop: 1 + "em" }}></div>
                                <div>
                                    <p className="_footer">
                                        当サイトの利用については下記内容を確認し、承諾した上でご利用ください。
                                        次に掲げるページの作成は禁止とします。投稿内容が禁止事項に該当すると判断した場
                                        合は、作成者に事前に何ら通知することなく、ページの削除その他必要な措置を取ることとします。
                                        【禁止事項】
                                        ・本人の同意のない第三者の個人情報であって、プライバシーなど個
                                        人の権利利益を侵害するもの
                                        ・法令等に違反し、又は違反する恐れのあるもの
                                        ・公序良俗に反するもの・
                                        人権侵害となるもの・
                                        特定の個人、企業、団体等を誹謗中傷するもの
                                        ・その他、当サイトが不適切と判断したもの。
                                        一定期間後にページは完全に消去されますが、
                                        作成したページが破壊、消失または変更された場合で
                                        あっても当サイトは一切責任を負いません。
                                    </p>
                                    <div className="_credit">
                                        SONOCODE　©2021 Syehacom　
                                        <SocialIcon
                                            style={{
                                                height: 35,
                                                width: 35,
                                            }}
                                            url="https://twitter.com/sonocode_syeha"
                                        />
                                    </div>
                                    <br></br>
                                    <br></br>
                                </div>
                            </footer>
                        </div>
                    )}
                </Dialog>
            </form>
            {enter ? (
                <Redialog
                    msg={dialog}
                    isOpen={commDlg}
                    doNo={() => {
                        setCommDlg(false);
                    }}
                />
            ) : (
                <Codialog
                    msg={valid + choice}
                    isOpen={commDlg}
                    doYes={execute}
                    doNo={() => {
                        setCommDlg(false);
                        if (random === true) {
                            setValid("");
                            setRandom(false);
                        }
                    }}
                />
            )}
        </div>
    );
};

const Transition = forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} />;
});

export default FormDialog;
