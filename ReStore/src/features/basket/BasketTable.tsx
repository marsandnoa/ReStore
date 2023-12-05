import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import { removeBasketItemAsync, addBasketItemAsync } from "./basketSlice";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { BasketItem } from "../../app/models/basket";

interface Props{
    items:BasketItem[];
    isBasket?:boolean;
}
export default function BasketTable({items,isBasket=true}:Props){
    const {status}=useAppSelector(state=>state.basket);
    const dispatch=useAppDispatch();

    return(
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item Name</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                      {isBasket&&
                      <TableCell align="right"></TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map(item => (
                      <TableRow
                        key={item.productId}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                            <Box display='flex' alignItems='center'>
                                <img src={item.pictureUrl} alt={item.name} style={{height:50, marginRight: 20}}/>
                                <span>{item.name}</span>
                            </Box>
                        </TableCell>
                        <TableCell align="right">${(item.price/100).toFixed(2)}</TableCell>
                        <TableCell align="center">

                            {isBasket&&
                            <LoadingButton 
                            color='error' 
                            onClick={()=>dispatch(removeBasketItemAsync({productId:item.productId,quantity:1,isGarbage:false}))} 
                            loading={status===('pendingRemoveItem'+item.productId)}>
                                <Remove />
                            </LoadingButton>}

                                {item.quantity}

                                {isBasket&&
                            <LoadingButton 
                            loading={status===('pendingAddItem'+item.productId)}
                            color='secondary' 
                            onClick={()=>dispatch(addBasketItemAsync({productId:item.productId,quantity:1}))} 
                            >
                                <Add />
                            </LoadingButton>}
                        </TableCell>
                        <TableCell align="right">${(item.price/100*item.quantity).toFixed(2)}</TableCell>
                        {isBasket&&
                        <TableCell align="right">
                            <LoadingButton
                            color='error' 
                            onClick={()=>dispatch(removeBasketItemAsync({productId:item.productId,quantity:item.quantity,isGarbage:true}))}  
                            loading={status===('pendingGarbRemoveItem'+item.productId)}
                            >
                                <Delete />
                            </LoadingButton>
                        </TableCell>}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
        </>
    );
}