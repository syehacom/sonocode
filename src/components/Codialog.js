import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

const Codialog = ({ msg, isOpen, doYes, doNo }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    return (
        <div>
            <Dialog
                open={open}
                keepMounted
                onClose={() => doNo()}
                aria-labelledby="common-dialog-title"
                aria-describedby="common-dialog-description">
                <DialogContent>{msg} で良いですか</DialogContent>
                <DialogActions>
                    <Button onClick={() => doNo()} color="primary">
                        いいえ
                    </Button>
                    <Button onClick={() => doYes()} color="primary">
                        はい
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
export default Codialog;
