import React, { useState } from "react";
import Alert from "@material-ui/lab/Alert";
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "firebase/app";
import "firebase/functions";

const useStyles = makeStyles((theme) => ({
    textField: {
        display: "flex",
        width: "500px",
    },
    contactForm: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "10px",
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
}));

export default function Contact() {
    const classes = useStyles();
    const [sendData, setSendData] = useState({
        email: "",
        name: "",
        content: "",
    });
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackBarOpen] = useState(false);
    const [snackbarInfo, setSnackBarInfo] = useState({
        severity: "",
        message: "",
    });

    //  Submit Button
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        let sendMail = firebase.functions().httpsCallable("sendMail");
        sendMail(sendData)
            .then(() => {
                setSnackBarInfo({
                    severity: "success",
                    message:
                        "お問合せありがとうございます。送信完了しました。",
                });
                setSnackBarOpen(true);
                console.log("Successed send mail.");
                setSendData({
                    email: "",
                    name: "",
                    content: "",
                });
            })
            .catch((err) => {
                setSnackBarInfo({
                    severity: "error",
                    message:
                        "送信に失敗しました。時間をおいて再度お試しください。",
                });
                setSnackBarOpen(true);
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    //  Change TextField
    const handleChange = (e) => {
        setSendData({ ...sendData, [e.target.name]: e.target.value });
    };

    //  Close SnackBar
    const handleSnackBarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackBarOpen(false);
    };

    return (
        <main>
            <Container maxWidth="sm" className={classes.contactForm}>
                <TextField
                    name="email"
                    label="メールアドレス"
                    type="mail"
                    required
                    className={classes.textField}
                    value={sendData.email}
                    onChange={handleChange}
                />
                <TextField
                    name="name"
                    label="お名前"
                    type="text"
                    required
                    className={classes.textField}
                    value={sendData.name}
                    onChange={handleChange}
                />
                <TextField
                    name="content"
                    label="お問合せ内容"
                    required
                    multiline
                    rows="5"
                    margin="normal"
                    variant="outlined"
                    className={classes.textField}
                    value={sendData.content}
                    onChange={handleChange}
                />
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.textField}
                    onClick={handleSubmit}>
                    送信
                </Button>
                <Backdrop className={classes.backdrop} open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackBarClose}>
                    <Alert
                        onClose={handleSnackBarClose}
                        severity={snackbarInfo.severity}>
                        {snackbarInfo.message}
                    </Alert>
                </Snackbar>
            </Container>
        </main>
    );
}
