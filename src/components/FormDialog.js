import React, { useEffect, useState, forwardRef } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Codialog from "./Codialog";
import firebase from "../utils/Firebase";
import { useForm } from "react-hook-form";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
const database = firebase.database();

const FormDialog = ({ isOpen, doClose, setValue, value }) => {
    const [open, setOpen] = useState(false);
    const [commDlg, setCommDlg] = useState(false);
    const [title, setTitle] = useState(1);

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    const handleDo = () => {
        setCommDlg(true);
    };

    const handleCancel = () => {
        setOpen(false);
        doClose();
    };

    const execute = () => {
        setCommDlg(false);
        handleCancel();
        firebase
            .database()
            .ref(title)
            .once("value", (snapshot) => {
                if (snapshot.exists()) {
                    console.log("exists!");
                } else {
                    database
                        .ref(title)
                        .set({ title: title, html: "", css: "", js: "" });
                }
            });
    };

    const { register, handleSubmit, errors } = useForm();

    const onSubmit = (data) => {
        console.log(data); // 送信するデータ
    };

    const comment = title;

    const [alignment, setAlignment] = useState("left");
    const handleAlignment = (event, newAlignment) => {
        setAlignment(newAlignment);
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
            <form onClick={handleSubmit(onSubmit)}>
                <Dialog
                    open={open}
                    // onClose={handleCancel}
                    TransitionComponent={Transition}
                    keepMounted
                    aria-labelledby="form-dialog-title">
                    <ToggleButtonGroup
                        orientation="vertical"
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
                            onChange={(e) => setTitle(e.target.value)}
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
                        {title && (
                            <Button
                                disabled={Boolean(errors.body)}
                                type="submit"
                                onClick={handleDo}
                                color="primary">
                                OK
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            </form>
            <Codialog
                msg={title}
                isOpen={commDlg}
                doYes={execute}
                doNo={() => {
                    setCommDlg(false);
                }}
            />
        </div>
    );
};

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default FormDialog;
