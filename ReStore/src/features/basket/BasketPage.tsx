import { Button, Grid, Typography } from "@mui/material";
import BasketSummary from "./BasketSummary";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import BasketTable from "./BasketTable";
export default function BasketPage(){

    const {basket}=useAppSelector(state=>state.basket);


    if(!basket||basket.items.length===0) return <Typography variant='h4'>Your cart is empty</Typography>

    return(
        <>
              <BasketTable items={basket.items}/>
              <Grid container>
                <Grid item xs={6}/>
                <Grid item xs={6}>
                    <BasketSummary />
                    <Button
                        component={Link}
                        to='/checkout'
                        variant='contained'
                        size='large'
                        fullWidth
                    >
                        Checkout
                    </Button>
                </Grid>
              </Grid>
        </>
            );
}