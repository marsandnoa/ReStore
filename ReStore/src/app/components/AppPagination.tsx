import Pagination from "@mui/lab/Pagination/Pagination";
import { Box, Typography } from "@mui/material";
import { MetaData } from "../models/pagination";
import { current } from "@reduxjs/toolkit";
import { useState } from "react";

interface Props{
    metaData:MetaData;
    onPageChange:(page:number)=>void;
}
export default function AppPagination({metaData,onPageChange}:Props) {
    const{currentPage,totalCount,totalPages,pageSize}=metaData;
    const[pageNumber,setPageNumber]=useState(currentPage);

    function handlePageChange(page:number){
        setPageNumber(page);
        onPageChange(page);
    }
    return (
        <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography>
          Displaying {(currentPage - 1) * pageSize + 1}  -  {currentPage * pageSize ? currentPage*pageSize:totalCount} of {totalCount}
        </Typography>
        <Pagination
          color='secondary'
          size='large'
          count={totalPages}
          page={pageNumber}
          onChange={(event,page)=>handlePageChange(page)}
        />
      </Box>
    )
}