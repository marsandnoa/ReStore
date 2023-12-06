import { Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import useProducts from "../../app/hooks/useProducts";
import AppPagination from "../../app/components/AppPagination";
import { useAppDispatch } from "../../app/store/configureStore";
import { removeProduct, setPageNumber } from "../catalog/CatalogSlice";
import { useState } from "react";
import ProductForm from "./ProductForm";
import { Product } from "../../app/models/product";
import { LoadingButton } from "@mui/lab";
import agent from "../../app/api/agent";

export default function Inventory() {
    const{products,metaData}=useProducts();
    const dispatch=useAppDispatch();

    const[editMode, setEditMode]=useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

    const [loading,setLoading]=useState(false);
    const [target,setTarget]=useState(0);

    function handleDeleteProduct(id:number){
        setTarget(id);
        setLoading(true);
        agent.Admin.deleteProduct(id).then(()=>dispatch(removeProduct(id))).catch(error=>console.log(error)).finally(()=>setLoading(false));
    }

    function handleSelectProduct(product:Product){
        setSelectedProduct(product);
        setEditMode(true);
    }

    function cancelEdit(){
        if(selectedProduct){
            setSelectedProduct(undefined);
        }
        setEditMode(false);
    }

    if(editMode) return(<ProductForm product={selectedProduct} cancelEdit={cancelEdit}/>)

    return (
        <>
            <Box display='flex' justifyContent='space-between'>
                <Typography sx={{ p: 2 }} variant='h4'>Inventory</Typography>
                <Button onClick={()=> setEditMode(true)} sx={{ m: 2 }} size='large' variant='contained'>Create</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="left">Product</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Type</TableCell>
                            <TableCell align="center">Brand</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow
                                key={product.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {product.id}
                                </TableCell>
                                <TableCell align="left">
                                    <Box display='flex' alignItems='center'>
                                        <img src={product.pictureUrl} alt={product.name} style={{ height: 50, marginRight: 20 }} />
                                        <span>{product.name}</span>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">{(product.price/100).toFixed(2)}</TableCell>
                                <TableCell align="center">{product.type}</TableCell>
                                <TableCell align="center">{product.brand}</TableCell>
                                <TableCell align="center">{product.quantityInStock}</TableCell>
                                <TableCell align="right">
                                    <Button onClick={()=>handleSelectProduct(product)} startIcon={<Edit />} />
                                    <LoadingButton 
                                    loading={loading && target===product.id}
                                    onClick={()=>handleDeleteProduct(product.id)} 
                                    startIcon={<Delete />} 
                                    color='error' />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {metaData &&
                <Box>
                    <AppPagination metaData={metaData} onPageChange={(pageNumber:number)=>dispatch(setPageNumber({pageNumber}))}/>
                </Box>
            }
        </>
    )
}