import {Box, Button, Table, TableBody, TableCell, TableHead, TableRow} from '@material-ui/core';

const AssetDetails = ({assets, onClose, width, height}) => {

    const mobileBreakpoint = 768; // defining a breakpoint for mobile devices

    function isMobileDevice() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }

    const modalStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: window.innerWidth <= mobileBreakpoint ? 0 : 50,
        left: window.innerWidth <= mobileBreakpoint ? 0 : 20,
        right: window.innerWidth <= mobileBreakpoint ? 0 : 20,
        bottom: window.innerWidth <= mobileBreakpoint ? 0 : 50,
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10,
    };

    const contentStyle = {
        background: '#fff',
        borderRadius: '5px',
        padding: '20px',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
        width: window.innerWidth <= mobileBreakpoint ? '98vw' : '90%', // increased width
        height: window.innerWidth <= mobileBreakpoint ? '98vh' : '90%', // increased height
        overflowY: 'scroll',
        zIndex: 11,
    };


    return (
        <div style={modalStyle}>
            <Box style={contentStyle}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <h4>Assets</h4>
                    <Button variant="outlined" color="primary" onClick={onClose}>Close</Button>
                </Box>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Asset Name</TableCell>
                            <TableCell>Asset ID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assets.map(asset => (
                            <TableRow key={asset.id}>
                                <TableCell>{asset.name}</TableCell>
                                <TableCell>{asset.id}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </div>
    );
};

export default AssetDetails;
