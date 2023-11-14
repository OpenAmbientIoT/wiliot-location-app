import React, {useState} from "react";
import {Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack} from "@mui/material";
import {Link} from "react-router-dom";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonIcon from '@mui/icons-material/Person';
import FlagIcon from '@mui/icons-material/Flag';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import {makeStyles} from "@material-ui/core/styles";
import theme from "../../theme";

const drawerWidth = 240; // todo move to external config/styles


const useStyles = makeStyles((theme) => ({
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    list: {},
    listItem: {
        padding: 0,
    },
}));

const AdminMenu = () => {
    const classes = useStyles(theme);


    const sidebarMenu = [
        {
            path: '/admin/view',
            title: 'Admin View',
            icon: '',
        },
        {
            path: '/user/view',
            title: 'User View',
            icon: '',
        },
        {
            path: '/reports/issues',
            title: 'Reported Issues',
            icon: '',
        },
        {
            path: '/assets',
            title: 'Assets',
            icon: '',
        },
        {
            path: '/configuration',
            title: 'Configuration',
            icon: '',
        },
    ]


    const [displayedComponent, setDisplayedComponent] = useState(null);
    const handleDisplayComponent = (component) => {
        setDisplayedComponent(component);
    };

    return (


        <Stack
            direction="column"
            justifyContent="space-between"
            spacing={2}
            sx={{
                height: '100%',
            }}
        >
            <Box>

                <List className={classes.list}>
                    <ListItem disablePadding className={classes.listItem}>
                        <ListItemButton
                            component={Link}
                            to={'/admin/view'}
                            sx={{
                                minHeight: 48,
                                //justifyContent: open ? "initial" : "center",
                                px: 2.5
                            }}>
                            <ListItemIcon>
                                <ManageAccountsIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'Admin View'}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding className={classes.listItem}>
                        <ListItemButton
                            component={Link}
                            to={'/user/view'}
                            sx={{
                                minHeight: 48,
                                //justifyContent: open ? "initial" : "center",
                                px: 2.5
                            }}>
                            <ListItemIcon>
                                <PersonIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'User View'}/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
            <Box>
                <List>
                    <ListItem disablePadding className={classes.listItem}>
                        <ListItemButton
                            component={Link}
                            to={'/reports/issues'}
                            sx={{
                                minHeight: 48,
                                //justifyContent: open ? "initial" : "center",
                                px: 2.5
                            }}>
                            <ListItemIcon>
                                <FlagIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'Reported Issues'}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding className={classes.listItem}>
                        <ListItemButton
                            component={Link}
                            to={'/assets'}
                            sx={{
                                minHeight: 48,
                                //justifyContent: open ? "initial" : "center",
                                px: 2.5
                            }}>
                            <ListItemIcon>
                                <ListAltIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'Assets'}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding className={classes.listItem}>
                        <ListItemButton
                            component={Link}
                            to={'/configuration'}
                            sx={{
                                minHeight: 48,
                                //justifyContent: open ? "initial" : "center",
                                px: 2.5
                            }}>
                            <ListItemIcon>
                                <SettingsIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'Configuration'}/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Stack>
    );
}

export default AdminMenu;