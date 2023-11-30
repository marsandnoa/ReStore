import { Button, ButtonGroup, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { CounterState } from "./counterReducer";

export default function ContactPage(){
    const dispatch=useDispatch();
    const {data,title}=useSelector((state:CounterState)=>state);
    return(
        <>
            <Typography variant="h2">
                {title}
            </Typography>
            <Typography variant="h4">
                {data}
            </Typography>
            <ButtonGroup>
                <Button variant="contained" onClick={()=>dispatch({type:'INCREMENT_COUNTER'})}>Increment</Button>
                <Button variant="contained" onClick={()=>dispatch({type:'DECREMENT_COUNTER'})}>Decrement</Button>
            </ButtonGroup>
        </>
    )
}