import React, { useState, useEffect, forwardRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
import Fab from "@material-ui/core/Fab"
import Slide from "@material-ui/core/Slide";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: 500,
        position: 'relative',
        minHeight: 200,
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(4),
    },
}))
    
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const PageDialog = ({ src, page, title }) => {
    const classes = useStyles();
    const [pageOpen, setPageOpen] = useState(false);

    useEffect(() => {
        setPageOpen(page);
    }, [page]);

    const handleClose = () => {
        setPageOpen(false);
    };

    return (
        <div>
            <Dialog fullScreen open={pageOpen} TransitionComponent={Transition}>
                <Fab
                    color="primary"
                    aria-label="add"
                    className={classes.fab}>
                    <CloseIcon onClick={handleClose} />
                </Fab>
                <iframe
                    srcDoc={src}
                    title="output"
                    id="iframe"
                    sandbox="allow-scripts allow-popups allow-modals"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                />
            </Dialog>
        </div>
    );
};
export default PageDialog;
