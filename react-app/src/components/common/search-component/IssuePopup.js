import {useRef, useState} from "react";
import {logIssue} from "../../../services/firebase/firebase-data-service";
import theme from "../../../theme";
import {getSpacing} from "../../../utils/helpers";

import {Button, TextField,} from "@material-ui/core";
import {Box, Stack, ToggleButton as MuiToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import CloseIcon from '@mui/icons-material/Close';
import {makeStyles} from "@material-ui/core/styles";
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import {styled} from "@mui/material/styles";
import {alpha} from '@material-ui/core/styles/colorManipulator';

const useStyles = makeStyles(() => ({
    issueTypeRadioButton: {
        minWidth: '100px',
        padding: '18px 36px',
        backgroundColor: '#fff',
        fontWeight: 'bold',
        fontSize: '18px',
        lineHeight: '24px',
        textTransform: 'inherit',
        marginRight: theme.spacing(1),
    },
    takePhotoButton: {
        backgroundColor: theme.palette.grey[300],
        color: theme.palette.grey[700],
        textTransform: 'inherit',
        borderRadius: 50,
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
    },
    submitButton: {
        backgroundColor: theme.palette.secondary.main,
        color: 'white',
        textTransform: 'capitalize',
        fontWeight: 'bold',
        borderRadius: 50,
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
    }
}));

const ToggleButton = styled(MuiToggleButton)({
    borderRadius: `${theme.spacing(1)} !important`,
    border: `1px solid ${theme.palette.grey[500]} !important`,
    "&.Mui-selected, &.Mui-selected:hover": {
        backgroundColor: alpha(theme.palette.primary.main, .5),
        border: `1px solid ${theme.palette.primary.main} !important`,
    }
});

function FormatAlignLeftIcon() {
    return null;
}

function FormatAlignCenterIcon() {
    return null;
}

function FormatAlignRightIcon() {
    return null;
}

function FormatAlignJustifyIcon() {
    return null;
}

const IssuePopup = ({asset, onSubmit, onCancel, setSearchText}) => {
    const fileInputRef = useRef(null);

    const [selectedIssue, setSelectedIssue] = useState("");
    const [customIssue, setCustomIssue] = useState("");
    const [issueImage, setIssueImage] = useState(null);

    const handleIssueChange = (e) => {
        setSelectedIssue(e.target.value);
        setCustomIssue(""); // Clear custom issue text when a checkbox is selected
    };

    const classes = useStyles()
    const handleCustomIssueChange = (e) => {
        setCustomIssue(e.target.value);
        setSelectedIssue(""); // Clear selected issue when custom issue text is entered
    };

    const handleImageChange = (e) => {
        setIssueImage(e.target.files[0]);
    };


    const handleSubmit = async () => {
        const issueDescription = selectedIssue || customIssue;
        if (!issueDescription) {
            alert("Please select an issue or provide a custom description");
            return;
        }
        try {
            await logIssue(asset, issueDescription, issueImage);
            onSubmit();
        } catch (error) {
            console.error("Failed to log issue:", error);
        }
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <Box className="issue-popup"
             sx={{
                 padding: theme.spacing(4),
                 overflow: 'hidden',
             }}>
            <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                spacing={1}
                mb={4}
                sx={{
                    backgroundColor: theme.palette.secondary.main,
                    marginTop: `-${getSpacing(theme, 4)}px`,
                    marginRight: `-${getSpacing(theme, 4)}px`,
                    marginLeft: `-${getSpacing(theme, 4)}px`,
                    paddingLeft: theme.spacing(4),
                    paddingTop: theme.spacing(1),
                    paddingBottom: theme.spacing(1),
                    paddingRight: theme.spacing(1),
                    overflow: 'hidden',
                }}
            >
                <Typography variant={'h6'} component={'h6'} color={'white'}>What is the issue?</Typography>
                <IconButton variant="contained" onClick={handleCancel}><CloseIcon sx={{color: 'white',}}/></IconButton>

            </Stack>
            <Box mb={4}>
                <Box mb={2}>
                    <ToggleButtonGroup
                        value={selectedIssue}
                        exclusive
                        onChange={handleIssueChange}
                        fullWidth
                        size={'large'}
                    >
                        <ToggleButton className={classes.issueTypeRadioButton} value="Not there">
                            Not<br/>there
                        </ToggleButton>
                        <ToggleButton className={classes.issueTypeRadioButton} value="Cant Find">
                            Can't<br/>find&nbsp;it
                        </ToggleButton>
                        <ToggleButton className={classes.issueTypeRadioButton} value="Issue Code 3">
                            Issue<br/>Code&nbsp;3
                        </ToggleButton>
                        <ToggleButton className={classes.issueTypeRadioButton} value="Issue Code 4">
                            Issue<br/>Code&nbsp;4
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>


                <div style={{display: 'none',}}>
                    <input type="radio" name="issue" value="Not there" checked={selectedIssue === "Not there"}
                           onChange={handleIssueChange}/>Not<br/>there
                    <input type="radio" name="issue" value="Cant Find" checked={selectedIssue === "Cant Find"}
                           onChange={handleIssueChange}/>Can't<br/>find&nbsp;it
                    <input type="radio" name="issue" value="Issue Code 3" checked={selectedIssue === "Issue Code 3"}
                           onChange={handleIssueChange}/>Issue<br/>Code&nbsp;3
                    <input type="radio" name="issue" value="Issue Code 4" checked={selectedIssue === "Issue Code 4"}
                           onChange={handleIssueChange}/>Issue<br/>Code&nbsp;4
                    <input type="text" placeholder="Something else" value={customIssue}
                           onChange={handleCustomIssueChange}/>
                </div>

                <Box sx={{display: 'flex', alignItems: 'flex-end'}} mb={6}>
                    <ModeOutlinedIcon sx={{color: 'action.active', mr: 1, my: 0.5}}/>
                    <TextField id="input-with-sx" label="Other" variant="standard" fullWidth value={customIssue}
                               onChange={handleCustomIssueChange}/>
                </Box>
            </Box>

            <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                spacing={1}
            >
                <Button startIcon={<CameraAltOutlinedIcon/>}
                        variant="contained"
                        component="label"
                        className={classes.takePhotoButton} size='large'
                >
                    Take a photo
                    <input ref={fileInputRef}
                           accept="image/*"
                           type="file"
                           hidden
                    />
                </Button>


                {/* Add checkboxes and text input here */}
                <Button variant="contained" onClick={handleSubmit} className={classes.submitButton}
                        size='large'>Submit</Button>
            </Stack>
        </Box>
    );
};

export default IssuePopup;
