import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import useMedia from "use-media";
// import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
    root: {
        maxWidth: 350,
    },
    rootmobile: {
        maxWidth: 1000,
    },
    media: {
        height: 300,
    },
});

export default function MediaCard({ shop1, shop2, shop3 }) {

    const classes = useStyles();
    const isWide = useMedia({ minWidth: "1025px" });
    
    return (
        <div>
            {isWide ? (
                <Card className={classes.root}>
                    <CardActionArea>
                        <CardMedia
                            className={classes.media}
                            image={shop1}
                            title="Contemplative Reptile"
                        />
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="h2">
                                {shop2}
                            </Typography>
                            <Typography
                                variant="body1"
                                color="h3"
                                component="p">
                                {shop3}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        {/* <Button size="small" color="primary">
                    LINK
                </Button> */}
                    </CardActions>
                </Card>
            ) : (
                <Card className={classes.rootmobile}>
                    <CardActionArea>
                        <CardMedia
                            className={classes.media}
                            image={shop1}
                            title="Contemplative Reptile"
                        />
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="h6"
                                component="h6">
                                {shop2}
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                color="h3"
                                component="h5">
                                {shop3}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        {/* <Button size="small" color="primary">
                    LINK
                </Button> */}
                    </CardActions>
                </Card>
            )}
        </div>
    );
}
