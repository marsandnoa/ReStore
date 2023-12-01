import { createSlice } from "@reduxjs/toolkit";

export interface CounterState{
    data: number;
    title: string;
}

const initialState: CounterState={
    data: 42,
    title:'Redux Toolkit'
}

export const counterSlice=createSlice({
    name:'counter',
    initialState,
    reducers:{
        increment: (state, action: PayloadAction<number | undefined>)=>{
            state.data+=action.payload ?? 1;
        },
        decrement: (state, action: PayloadAction<number | undefined>)=>{
            state.data-=action.payload ?? 1;
        }
    }
})

export const {increment, decrement}=counterSlice.actions;