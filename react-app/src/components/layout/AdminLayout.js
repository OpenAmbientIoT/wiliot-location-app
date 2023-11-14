import * as React from 'react';
import {createTheme, styled, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoHorizontal from "../common/LogoHorizontal";
import AdminMenu from "./AdminMenu";
import theme from "../../theme";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const mdTheme = createTheme();

const AdminLayoutAlt = ({children}) => {
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                {/*<AppBar position="absolute" open={open} sx={{backgroundColor: theme.palette.grey[100]}} elevation={0}>*/}
                {/*    <Toolbar*/}
                {/*        sx={{*/}
                {/*            pr: '24px', // keep right padding when drawer closed*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        <IconButton*/}
                {/*            edge="start"*/}
                {/*            color="inherit"*/}
                {/*            aria-label="open drawer"*/}
                {/*            onClick={toggleDrawer}*/}
                {/*            sx={{*/}
                {/*                marginRight: '36px',*/}
                {/*                ...(open && { display: 'none' }),*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            <MenuIcon />*/}
                {/*        </IconButton>*/}
                {/*        /!*<IconButton color="inherit">*!/*/}
                {/*        /!*    <Badge badgeContent={4} color="secondary">*!/*/}
                {/*        /!*        <NotificationsIcon />*!/*/}
                {/*        /!*    </Badge>*!/*/}
                {/*        /!*</IconButton>*!/*/}
                {/*    </Toolbar>*/}
                {/*</AppBar>*/}
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: [1],
                        }}
                    >

                        <LogoHorizontal/>

                        <IconButton onClick={toggleDrawer} sx={{transform: !open ? 'translateX(-16px)' : 'none',}}>
                            {open ? (<ChevronLeftIcon/>) : (<ChevronRightIcon/>)}
                        </IconButton>
                    </Toolbar>

                    <Divider/>

                    <Box component="nav" sx={{
                        height: '100%',
                    }}>
                        <AdminMenu/>
                    </Box>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: theme.palette.grey[100],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    {/*<Toolbar />*/}
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default AdminLayoutAlt