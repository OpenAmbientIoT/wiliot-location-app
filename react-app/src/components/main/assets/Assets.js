import React, {useEffect, useState} from "react";
import "./Assets.css";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core";
import {fetchAssets, fetchCategories} from "../../../services/firebase/firebase-data-service";
import AdminLayout from "../../layout/AdminLayout";
import CircularProgress from '@mui/material/CircularProgress';
import Container from "@mui/material/Container";
import {Box, Grid, Stack} from "@mui/material";
import Paper from "@mui/material/Paper";

const Asset = () => {
    const [assets, setAssets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState("");

    useEffect(() => {
        const fetchAllData = async () => {
            const fetchedAssets = await fetchAssets();
            const fetchedCategories = await fetchCategories();
            setAssets(fetchedAssets);
            setCategories(fetchedCategories);
        };
        fetchAllData();
    }, []);

    const handleCategoryFilterChange = (event) => {
        setCategoryFilter(event.target.value);
    };

    const renderAssetTable = () => {
        const filteredAssets = assets.filter(
            (asset) =>
                categoryFilter === "" ? true : asset.categoryId === categoryFilter
        );

        if (filteredAssets.length === 0) {
            return <><p>No assets found</p> <CircularProgress></CircularProgress></>;
        }

        return (
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Asset ID</TableCell>
                            <TableCell>Category ID</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAssets.map((asset) => (
                            <TableRow key={asset.id}>
                                <TableCell>{asset.id}</TableCell>
                                <TableCell>{asset.categoryId}</TableCell>
                                <TableCell>{asset.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <AdminLayout>
            <Container maxWidth="false" sx={{mt: 3, mb: 2}}>
                <Grid container spacing={1} mb={1}>
                    <Grid item xs={12} md={12} lg={12} p={0}>

                        <Paper sx={{p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                            <Stack direction="row" justifyContent="space-between">
                                <Box>
                                    <h2 className="assets-heading">Assets ({assets.length})</h2>
                                </Box>
                                <Box>
                                    <FormControl className="assets-category-filter" style={{minWidth: '300px'}}>
                                        <InputLabel id="category-filter-label">Filter by category</InputLabel>
                                        <Select
                                            labelId="category-filter-label"
                                            value={categoryFilter}
                                            onChange={handleCategoryFilterChange}
                                        >
                                            <MenuItem value="">All</MenuItem>
                                            {categories.map((category) => (
                                                <MenuItem key={category.id} value={category.id}>
                                                    {category.name} ({category.id})
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Stack>

                            {renderAssetTable()}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </AdminLayout>
    );
};

export default Asset;
