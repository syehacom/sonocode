import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

const Codialog = ({ emOpen, emYes, emNo }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(emOpen);
    }, [emOpen]);

    return (
        <div>
            <Dialog
                open={open}
                keepMounted
                onClose={() => emNo()}
                aria-labelledby="common-dialog-title"
                aria-describedby="common-dialog-description">
                <DialogContent>完全に削除しますか</DialogContent>
                <DialogActions>
                    <Button onClick={() => emNo()} color="primary">
                        いいえ
                    </Button>
                    <Button onClick={() => emYes()} color="primary">
                        はい
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
export default Codialog;
