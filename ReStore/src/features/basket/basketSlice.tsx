import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";
import agent from "../../app/api/agent";

interface BasketState{
    basket: Basket|undefined;
    status:string;
}

const initialState: BasketState={
    basket: undefined,
    status:'idle'
}

export const addBasketItemAsync=createAsyncThunk<Basket,{productId:number,quantity:number}>(
    'basket/addBasketItem',
    async ({productId, quantity},thunkAPI)=>{
        try{
            return await agent.Basket.addItem(productId, quantity);
        }catch(error:any){
            return thunkAPI.rejectWithValue({error:error.data});
        }
    }
)


export const removeBasketItemAsync=createAsyncThunk<void,{productId:number,quantity?:number,isGarbage:boolean}>(
    'basket/removeBasketItem',
    async ({productId, quantity},thunkAPI)=>{
        try{
            await agent.Basket.remove(productId, quantity);
        }catch(error:any){
            return thunkAPI.rejectWithValue({error:error.data});
        }
    }
)

export const basketSlice=createSlice({
    name:'basket',
    initialState,
    reducers:{
        setBasket: (state, action)=>{
            state.basket=action.payload;
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(addBasketItemAsync.pending, (state,action)=>{
            state.status='pendingAddItem'+action.meta.arg.productId;
        })
        .addCase(addBasketItemAsync.fulfilled, (state, action)=>{
            state.status='idle';
            state.basket=action.payload;
        })
        .addCase(addBasketItemAsync.rejected, (state,action)=>{
            state.status='idle';
            console.log(action.payload);
        })

        builder
        .addCase(removeBasketItemAsync.pending, (state,action)=>{
            if(action.meta.arg.isGarbage){
                state.status='pendingGarbRemoveItem'+action.meta.arg.productId;
            }else{
                state.status='pendingRemoveItem'+action.meta.arg.productId;
            }
        })
        .addCase(removeBasketItemAsync.fulfilled, (state, action)=>{
            const {productId, quantity}=action.meta.arg;
            const itemIndex=state.basket?.items.findIndex(item=>item.productId===productId);
            if(itemIndex===-1||itemIndex===undefined) return;
            state.basket!.items[itemIndex].quantity-=quantity!;
            if(state.basket!.items[itemIndex].quantity===0){
                state.basket!.items.splice(itemIndex,1);
            }
            state.status='idle';
        })
        .addCase(removeBasketItemAsync.rejected, (state,action)=>{
            state.status='idle';
            console.log(action.payload);
        })
    }
})

export const {setBasket}=basketSlice.actions;