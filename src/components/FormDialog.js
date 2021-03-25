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
import firebase from "../utils/Firebase";
import { useForm } from "react-hook-form";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
const database = firebase.database();

const FormDialog = ({ isOpen, doClose, setValue, value }) => {
    const [open, setOpen] = useState(false);
    const [commDlg, setCommDlg] = useState(false);
    const [enter, setEnter] = useState(false);
    const [title, setTitle] = useState("");
    const [valid, setValid] = useState("");
    const [alignment, setAlignment] = useState("left");
    const [dialog, setDialog] = useState("");
    const [random, setRandom] = useState(false);
    // const [random, setRandom] = useState("");

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
        console.log(alignment);
    };

    const comment = title;

    const handleAlignment = (event, newAlignment) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment);
        }
    };

    const useStyles = makeStyles({
        buttonColor: {
            "&.Mui-selected": {
                backgroundColor: "#3f51b5",
                color: "#ffffff",
            },
        },
    });
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
                                <div className="content">
                                    ウェブページのデザインを試しましょう
                                </div>
                            </div>
                            {/* <img src={hero} /> */}
                            <div>
                                <h1>
                                    We build &amp; design <br /> web
                                    applications.
                                </h1>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit. Proin luctus congue
                                    dignissim. Vestibulum et ex nisl. Vestibulum
                                    eu luctus nisi. Fusce sit amet vehicula
                                    nisl.
                                </p>
                            </div>
                        </header>
                        <ToggleButtonGroup
                            // orientation="vertical"
                            value={alignment}
                            exclusive
                            onChange={handleAlignment}
                            aria-label="text alignment">
                            <ToggleButton
                                classes={{ selected: classes.buttonColor }}
                                value="left"
                                aria-label="left aligned">
                                作成する
                            </ToggleButton>
                            <ToggleButton
                                classes={{ selected: classes.buttonColor }}
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
                                defaultValue=""
                                autoFocus
                                name="body"
                                margin="dense"
                                id="name"
                                label="ページ名"
                                type="text"
                                fullWidth
                                onChange={(e) => setValid(e.target.value)}
                                inputRef={register({
                                    required: true,
                                    minLength: 10,
                                    // pattern: /^([a-zA-Z0-9]{10,})$/,
                                })}
                                error={Boolean(errors.body)}
                                helperText={
                                    errors.body && "10文字以上にして下さい。"
                                }
                            />
                        </DialogContent>
                        <DialogActions>
                            {/* <Button onClick={handleCancel} color="primary">
                        キャンセル
                    </Button> */}
                            {valid && (
                                <Button
                                    disabled={Boolean(errors.body)}
                                    type="submit"
                                    onClick={handleDo}
                                    color="primary">
                                    OK
                                </Button>
                            )}
                            {!valid && (
                                <Button
                                    disabled={Boolean(alignment === "right")}
                                    type="submit"
                                    onClick={makeRandom}
                                    color="primary">
                                    ランダム
                                </Button>
                            )}
                        </DialogActions>
                        <section className="container">
                            <div style={{ marginTop: 1 + "em" }}></div>
                            <div>
                                <p className="footer">
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry. Lorem
                                    Ipsum has been the industry's standard dummy
                                    text ever since the 1500s, when an unknown
                                    printer took a galley of type and scrambled
                                    it to make a type specimen book. It has
                                    survived not only five centuries, but also
                                    the leap into electronic typesetting,
                                    remaining essentially unchanged.Lorem Ipsum
                                    has been the industry's standard dummy text
                                    ever since the 1500s, when an unknown
                                    printer took a galley of type and scrambled
                                    it to make a type specimen book. It has
                                    survived not only five centuries, but also
                                    the leap into electronic typesetting,
                                    remaining essentially unchanged. It was
                                    popularised in the 1960s with the release of
                                    Letraset sheets containing Lorem Ipsum
                                    passages, and more recently with desktop
                                    publishing software like Aldus PageMaker
                                    including versions of Lorem Ipsum.
                                </p>
                            </div>
                        </section>
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
                    msg={valid}
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
