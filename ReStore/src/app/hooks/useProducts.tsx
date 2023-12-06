import { useEffect } from "react";
import { productSelectors, fetchProductsAsync, fetchFilters } from "../../features/catalog/CatalogSlice";
import { useAppSelector, useAppDispatch } from "../store/configureStore";

export default function useProducts(){
    const products=useAppSelector(productSelectors.selectAll);
    const {productsLoaded,status,filtersLoaded,brands,types,productParams,metaData}=useAppSelector(state=>state.catalog);
    const dispatch=useAppDispatch();

    useEffect(()=>{
      if(!productsLoaded){
        dispatch(fetchProductsAsync());
      }
    },[dispatch,productsLoaded])

    useEffect(()=>{
        if(!filtersLoaded){
            dispatch(fetchFilters());
        }
    },[dispatch,filtersLoaded,productParams])

    return{
        products,
        productsLoaded,
        filtersLoaded,
        brands,
        types,
        metaData,
    }
}