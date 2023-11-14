import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import {Box} from "@mui/material";

const useStyles = makeStyles((theme) => ({
    input: {
        padding: theme.spacing(2),
        backgroundColor: 'white',
        fontSize: 20,
        borderRadius: '2px',
    },
    inputExpanded: {
        padding: theme.spacing(2),
        backgroundColor: 'white',
        fontSize: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    clearButton: {
        position: "absolute",
        top: "50%",
        right: 10,
        transform: "translateY(-50%)",
        zIndex: 1,
    },
    suggestionsList: {
        position: "absolute",
        width: 'calc(100% - 32px)',
        zIndex: 2,
        maxHeight: 400,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        backgroundColor: "#fff"
    },
    suggestionItem: {
        padding: theme.spacing(2),
        fontSize: 20,
        cursor: "pointer",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: 'calc(100% - 32px)',
        "&:hover": {
            backgroundColor: theme.palette.grey[200],
        },
    },
    highlighted: {
        fontWeight: "bold",
        color: theme.palette.primary.main,
    },
}));

const AutoComplete = ({
                          placeholder,
                          value,
                          suggestions,
                          onChange,
                          onSelect,
                          searchInputRef,
                      }) => {
    const classes = useStyles();

    const handleClear = () => {
        onChange({target: {value: ""}});
    };

    const handleSelect = (e, suggestion) => {
        if (onSelect) {
            onSelect(suggestion, suggestion.zones);
        }
    };

    const Suggestion = (suggestion, inputValue) => {
        const index = suggestion.name.toLowerCase().indexOf(inputValue.toLowerCase());
        const beforeMatch = suggestion.name.slice(0, index);
        const match = suggestion.name.slice(index, index + inputValue.length);
        const afterMatch = suggestion.name.slice(index + inputValue.length);

        return (
            <div
                key={suggestion.id}
                onClick={(e) => handleSelect(e, suggestion)}
                className={classes.suggestionItem}
            >
                <span>{beforeMatch}</span>
                <span className={classes.highlighted}>{match}</span>
                <span>{afterMatch}</span>
            </div>
        );
    };


    // todo sx={{backgroundColor: 'white'}}
    return (
        <Box className={classes.root}
             sx={{position: 'relative', px: 2, pt: 4, pb: 2,}}>
            <TextField
                autoFocus
                fullWidth
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                ref={searchInputRef}
                InputProps={{
                    classes: {
                        input: suggestions.length > 0 ? classes.inputExpanded : classes.input,
                    },
                    endAdornment: (
                        <>
                            {value && (
                                <IconButton className={classes.clearButton} onClick={handleClear}>
                                    <ClearIcon/>
                                </IconButton>
                            )}
                        </>
                    ),
                }}
            />
            <Box>
                {suggestions.length > 0 && (
                    <div className={classes.suggestionsList}>
                        {suggestions.map((suggestion) =>
                            Suggestion(suggestion, value)
                        )}
                    </div>
                )}
            </Box>
        </Box>
    );
};

export default AutoComplete;
