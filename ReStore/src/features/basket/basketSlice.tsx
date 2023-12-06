import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";
import agent from "../../app/api/agent";
import { getCookie } from "../../app/util/util";
import Cookies from "js-cookie";

interface BasketState{
    basket: Basket|undefined;
    status:string;
}

const initialState: BasketState={
    basket: undefined,
    status:'idle'
}

export const fetchBasketAsync=createAsyncThunk<'basket/fetchBasketAsync'>(
    'basket/fetchBasket',
    async (_,thunkAPI)=>{
        try{
            return await agent.Basket.get();
        }catch(error:any){
            return thunkAPI.rejectWithValue({error:error.data});
        }
    },
    {
        condition: ()=>{
            if(!getCookie('buyerId')){
                return false;
            }
        }
    }
)
export const addBasketItemAsync=createAsyncThunk<Basket,{productId:number,quantity:number}>(
    'basket/addBasketItem',
    async ({productId, quantity},thunkAPI)=>{
        try{
            console.log("about to hit backedn");
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
        clearBasket: (state)=>{
            state.basket=undefined;
            Cookies.remove('buyerId');

        }

    },
    extraReducers:(builder)=>{
        builder.addCase(addBasketItemAsync.pending, (state,action)=>{
            state.status='pendingAddItem'+action.meta.arg.productId;
        })

        builder.addCase(removeBasketItemAsync.pending, (state,action)=>{
            if(action.meta.arg.isGarbage){
                state.status='pendingGarbRemoveItem'+action.meta.arg.productId;
            }else{
                state.status='pendingRemoveItem'+action.meta.arg.productId;
            }
        })
        builder.addCase(removeBasketItemAsync.fulfilled, (state, action)=>{
            const {productId, quantity}=action.meta.arg;
            const itemIndex=state.basket?.items.findIndex(item=>item.productId===productId);
            if(itemIndex===-1||itemIndex===undefined) return;
            state.basket!.items[itemIndex].quantity-=quantity!;
            if(state.basket!.items[itemIndex].quantity===0){
                state.basket!.items.splice(itemIndex,1);
            }
            state.status='idle';
        })
        builder.addCase(removeBasketItemAsync.rejected, (state,action)=>{
            state.status='idle';
            console.log(action.payload);
        })

        builder.addMatcher(isAnyOf(addBasketItemAsync.fulfilled,fetchBasketAsync.fulfilled), (state, action)=>{
            state.status='idle';
            state.basket = action.payload as Basket;
        })
        builder.addMatcher(isAnyOf(addBasketItemAsync.rejected,fetchBasketAsync.rejected), (state,action )=>{
            state.status='idle';
            console.log(action.payload);
        })
    }
})

export const {setBasket,clearBasket}=basketSlice.actions;