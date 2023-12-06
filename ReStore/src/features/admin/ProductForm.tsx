import { Typography, Grid, Paper, Box, Button } from "@mui/material";
import { Field, FieldValues, useForm } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import { Product } from "../../app/models/product";
import { useEffect } from "react";
import useProducts from "../../app/hooks/useProducts";
import AppSelectList from "../../app/components/AppSelectList";

import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./productValidation";
import agent from "../../app/api/agent";
import { useAppDispatch } from "../../app/store/configureStore";
import { setProduct } from "../catalog/CatalogSlice";
import { LoadingButton } from "@mui/lab";
interface Props {
    product?: Product;
    cancelEdit: () => void;
}


export default function ProductForm({product,cancelEdit}: Props) {
    const { control,reset,handleSubmit} = useForm({
        resolver: yupResolver<any>(validationSchema),
    });
    const {brands,types}=useProducts();
    const dispatch=useAppDispatch();

    useEffect(() => {
        if(product) reset(product);
    }, [product,reset])
    
    async function handleSubmitData(data: FieldValues) {
        console.log(data);
        try{
            let response: Product;
            if(product){
                response=await agent.Admin.updateProduct(data);
            }else{
                response=await agent.Admin.createProduct(data);
            }
            dispatch(setProduct(response));
            cancelEdit();
        }catch(error){
            console.log(error);
        }
    }
    return (
        <Box component={Paper} sx={{p: 4}}>
            <Typography variant="h4" gutterBottom sx={{mb: 4}}>
                Product Details
            </Typography>
            <form onSubmit={handleSubmit(handleSubmitData)}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                    <AppTextInput control={control} name='name' label='Product name' />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppSelectList control={control} items={brands} name='brand' label='Brand' />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppSelectList control={control} items={types} name='type' label='Type' />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppTextInput type='number' control={control} name='price' label='Price' />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppTextInput  type='number' control={control} name='quantityInStock' label='Quantity in Stock' />
                </Grid>
                <Grid item xs={12}>
                    <AppTextInput multiline={true} rows={4} control={control} name='description' label='Description' />
                </Grid>
                <Grid item xs={12}>
                    <AppTextInput control={control} name='pictureUrl' label='Image' />
                </Grid>
            </Grid>
            </form>
            <Box display='flex' justifyContent='space-between' sx={{mt: 3}}>
                <Button onClick={cancelEdit} variant='contained' color='inherit'>Cancel</Button>
                <LoadingButton type='submit' variant='contained' color='success'>Submit</LoadingButton>
            </Box>
        </Box>
    )
}