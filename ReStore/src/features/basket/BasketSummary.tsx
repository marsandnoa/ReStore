import { TableContainer, Paper, Table, TableBody, TableRow, TableCell, Typography } from "@mui/material";
import { useStoreContext } from "../../app/context/StoreContext";
import { useAppSelector } from "../../app/store/configureStore";

interface Props{
    subtotal?:number;
}
export default function BasketSummary({subtotal}:Props) {

    const {basket}=useAppSelector(state=>state.basket);
    if(subtotal===undefined){
        subtotal = basket?.items.reduce((sum,item)=>sum+item.price*item.quantity,0);
    }
    const deliveryFee = subtotal <= 10000 ? '$5.00' : '$0.00';
    const total=deliveryFee==='$0.00' ? subtotal : '$'+((subtotal+500)/100).toFixed(2);
    return (
        <>
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">${(subtotal/100).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="right">{deliveryFee}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">${(total/100).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <span style={{fontStyle: 'italic'}}>*Orders over $100 qualify for free delivery</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}