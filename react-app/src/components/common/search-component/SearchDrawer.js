import React from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import SearchPanelAutoComplete from "./SearchPanelAutoComplete";
// ... any other required imports ...

const SearchDrawer = React.memo(({
                                     isDrawerOpen,
                                     onClose,
                                     assets,
                                     filteredAssets,
                                     setFilteredAssets,
                                     highlightedAssets,
                                     setHighlightedAssets,
                                     searchText,
                                     setSearchText,
                                     searchInputRef,
                                 }) => {
    return (
        <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={onClose}
        >
            <div style={{display: 'flex', alignItems: 'center', padding: '8px'}}>
                <IconButton onClick={onClose}>
                    <ChevronLeftIcon/>
                </IconButton>
            </div>
            <Divider/>
            <Box sx={{width: 500, padding: 2}}>
                <Box sx={{mb: 3}}>
                    <Paper elevation={2} sx={{p: 2, borderRadius: '8px'}}>
                        <SearchPanelAutoComplete
                            assets={assets}
                            filteredAssets={filteredAssets}
                            setFilteredAssets={setFilteredAssets}
                            highlightedAssets={highlightedAssets}
                            setHighlightedAssets={setHighlightedAssets}
                            searchText={searchText}
                            setSearchText={setSearchText}
                            searchInputRef={searchInputRef}
                        />
                    </Paper>
                </Box>
            </Box>
        </Drawer>
    );
});

export default SearchDrawer
