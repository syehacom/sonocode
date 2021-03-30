import React, { useState } from "react";
import Alert from "@material-ui/lab/Alert";
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
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

const Contact = ({ doNo }) => {
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
    const onSubmit = () => {
        // e.preventDefault();
        setLoading(true);

        let sendMail = firebase.functions().httpsCallable("sendMail");
        sendMail(sendData)
            .then(() => {
                setSnackBarInfo({
                    severity: "success",
                    message: "お問合せありがとうございます。送信完了しました。",
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

    const { register, handleSubmit, errors } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                        inputRef={register({
                            required: "required!",
                            pattern: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/,                            
                        })}
                        error={Boolean(errors.email)}
                        helperText={
                            errors.email &&
                            "メールアドレス形式で入力してください。"
                        }
                    />
                    <TextField
                        name="name"
                        label="お名前"
                        type="text"
                        required
                        className={classes.textField}
                        value={sendData.name}
                        onChange={handleChange}
                        inputRef={register({
                            required: "required!",
                        })}
                        error={Boolean(errors.name)}
                        helperText={errors.name && "お名前を入力してください"}
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
                        inputRef={register({
                            required: "required!",
                            maxLength: 300,
                        })}
                        error={Boolean(errors.content)}
                        helperText={
                            errors.content && "300文字以内にして下さい。"
                        }
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        className={classes.textField}
                    >
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
        </form>
    );
}

export default Contact;
