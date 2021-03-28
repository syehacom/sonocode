import React, { useEffect, useState, forwardRef } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogTitle from "@material-ui/core/DialogTitle";
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
const database = firebase.database();

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
    const [openmov, setOpenmov] = React.useState(false);

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
                .ref(valid)
                .once("value", (snapshot) => {
                    if (snapshot.exists()) {
                        console.log("exists!");
                        setEnter(true);
                        setDialog("すでに使われています");
                    } else {
                        setTitle(valid);
                        setEnter(true);
                        database.ref(valid).set({
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
                .ref(valid)
                .once("value", (snapshot) => {
                    if (snapshot.exists()) {
                        setTitle(valid);
                        setCommDlg(false);
                        handleCancel();
                    } else {
                        console.log("not exists!");
                        setEnter(true);
                        setDialog("ページがありません");
                    }
                });
        }
    };

    const { register, handleSubmit, errors } = useForm();

    const onSubmit = (data) => {
        console.log(data); // 送信するデータ
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
        },
    }));
    const classes = useStyles();

    return (
        <div>
            <p>{setValue(comment)}</p>
            <form onChange={handleSubmit(onSubmit)}>
                <Dialog
                    fullScreen
                    open={open}
                    // onClose={handleCancel}
                    TransitionComponent={Transition}
                    transitionDuration="0"
                    keepMounted
                    aria-labelledby="form-dialog-title">
                    <div>
                        <header>
                            <div
                                className="two"
                                height="400px"
                                width="400px"></div>
                            <div className="carousel-caption">
                                <div className="content">SONOCODE</div>
                            </div>
                        </header>
                        <main>
                            <div className="flex-container">
                                <div className="flex-item">
                                    <h1>
                                        そのコードを簡単&amp;便利に <br />{" "}
                                        共有しよう
                                    </h1>
                                    <p>
                                        まずは、ページを作成してみよう。
                                        {/* <span role="img" aria-label="emoji">
                                            😃
                                        </span> */}
                                        ページ名を共有して音声チャットやプレビューを
                                        使いウェブデザインを教えたり、一緒に考えたりしよう！
                                    </p>
                                    <div className="movie">
                                        <Fab
                                            variant="extended"
                                            onClick={handleOpen}
                                            className={classes.extendedIcon}>
                                            動画をみてみる
                                        </Fab>
                                        <Dialog
                                            onClose={handleClose}
                                            aria-labelledby="simple-dialog-title"
                                            open={openmov}>
                                            <ReactPlayer
                                                url="https://youtu.be/aXHZe1Tf9bg"
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
                            <div className="flex-container">
                                <div className="four flex-item"></div>
                                <div className="flex-item">
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
                                        {/* <DialogTitle id="form-dialog-title">
                        ページを作成or利用する
                    </DialogTitle> */}
                                        <DialogContent>
                                            {/* <DialogContentText></DialogContentText> */}
                                            <TextField
                                                inputProps={{
                                                    style: { fontSize: 18 },
                                                }} // font size of input text
                                                InputLabelProps={{
                                                    style: { fontSize: 18 },
                                                }} // font size of input label
                                                defaultValue=""
                                                autoFocus
                                                name="body"
                                                margin="normal"
                                                id="name"
                                                label="ページ名"
                                                type="text"
                                                className={classes.textField}
                                                fullWidth
                                                onChange={(e) =>
                                                    setValid(e.target.value)
                                                }
                                                inputRef={register({
                                                    required: true,
                                                    minLength: 10,
                                                    // pattern: /^([a-zA-Z0-9]{10,})$/,
                                                })}
                                                error={Boolean(errors.body)}
                                                helperText={
                                                    errors.body &&
                                                    "10文字以上にして下さい。"
                                                }
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                            {/* <Button onClick={handleCancel} color="primary">
                        キャンセル
                    </Button> */}
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
                                                        alignment === "right"
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
                            <div className="user">
                                <h1>ニーズに合ったカスタマイズが可能</h1>
                            </div>
                            <div className="flex-card">
                                <div className="flex-item">
                                    <MediaCard
                                        shop1={
                                            "https://image.shutterstock.com/image-vector/ui-designer-creates-structure-information-600w-1833782983.jpg"
                                        }
                                        shop2={"プログラミング教室"}
                                        shop3={"リモートでの運営に適しています"}
                                    />
                                </div>
                                <div className="flex-item">
                                    <MediaCard
                                        shop1={
                                            "https://image.shutterstock.com/image-vector/business-team-working-on-big-600w-1215394804.jpg"
                                        }
                                        shop2={"障がい者就労支援"}
                                        shop3={
                                            "日々の作業や訓練にご利用ください"
                                        }
                                    />
                                </div>
                                <div className="flex-item">
                                    <MediaCard
                                        shop1={
                                            "https://image.shutterstock.com/image-vector/man-works-sitting-table-laptop-600w-1746221000.jpg"
                                        }
                                        shop2={"クライアントとの打合せ"}
                                        shop3={"デザインの確認に役に立ちます"}
                                    />
                                </div>
                            </div>
                        </main>
                        <footer className="container">
                            <div style={{ marginTop: 1 + "em" }}></div>
                            <div>
                                <p className="footer">
                                    当サイトの利用については下記内容を確認し、承諾した上でご利用ください。
                                    次に掲げるページの作成は禁止とします。投稿内容が禁止事項に該当すると判断した場
                                    合は、作成者に事前に何ら通知することなく、投稿の削除その他必要な措置を取ることとします。
                                    【禁止事項】
                                    ・本人の同意のない第三者の個人情報であって、プライバシーなど個
                                    人の権利利益を侵害するもの
                                    ・法令等に違反し、又は違反する恐れのあるもの
                                    ・ 公序良俗に反するもの・
                                    人権侵害となるもの・
                                    特定の個人、企業、団体等を誹謗中傷するもの
                                    ・ 虚偽や事実誤認の内容を含むもの ・
                                    わいせつな表現等不適切な内容を含むもの ・
                                    その他、当サイトが不適切と判断したもの。
                                    一定期間後にページは完全に削除されます。
                                    作成したページが破壊、消失または変更された場合、当サイトは一切責任を負いません。
                                    <br></br>
                                </p>
                                <div className="credit">
                                    SONOCODE　　©2021 Syehacom
                                </div>
                                <br></br>
                                <br></br>
                            </div>
                        </footer>
                    </div>
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
