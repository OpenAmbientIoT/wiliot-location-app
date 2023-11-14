import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Button, CircularProgress} from '@material-ui/core';
import theme from "../../theme";

const useStyles = makeStyles(() => ({
    input: {
        display: 'none',
    },
    uploadBtn: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
        color: '#fff',
    },
}));

function ImageUploader({handleImageUpload, isUploading}) {
    const classes = useStyles();

    return (
        <div style={{textAlign: 'center'}}>
            <input
                className={classes.input}
                accept="image/*"
                id="contained-button-file"
                multiple
                type="file"
                onChange={handleImageUpload}
            />
            <label htmlFor="contained-button-file">
                <Button
                    variant="contained"
                    component="span"
                    size="large"
                    className={classes.uploadBtn}
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <CircularProgress size={24} color="primary"/>
                    ) : (
                        'Upload Floor Plan Image'
                    )}
                </Button>
            </label>
        </div>
    );
}

export default ImageUploader;