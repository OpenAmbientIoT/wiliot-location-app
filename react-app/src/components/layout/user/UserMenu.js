import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import {Link} from "react-router-dom";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';


import {Box} from "@mui/material";
import theme from "../../../theme";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    menuButton: {
        padding: 6,
    },
    menuList: {
        display: 'flex',
        flexDirection: 'column',
    },
    menuItem: {
        display: 'block',
        padding: '6px 24px 6px 16px',
        '& span': {
            marginLeft: '12px',
        },
        '& svg': {
            opacity: .7,
        }
    },
}));


export default function UserMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const classes = useStyles();


    return (
        <Box style={{backgroundColor: theme.palette.grey[200], borderRadius: theme.spacing(1)}}>
            <IconButton className={classes.menuButton}
                        onClick={handleClick}
            >
                <MenuIcon/>
            </IconButton>
            <Menu className={classes.menuList}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
            >
                <MenuItem
                    className={classes.menuItem}
                    component={Link}
                    to={'/admin/view'}
                    disableRipple
                >
                    <ManageAccountsIcon/>
                    <span>Admin View</span>
                </MenuItem>
                <MenuItem
                    className={classes.menuItem}
                    component={Link}
                    to={'/user/view'}
                    disableRipple
                >
                    <PersonIcon/>
                    <span>User View</span>
                </MenuItem>
            </Menu>
        </Box>
    );
}