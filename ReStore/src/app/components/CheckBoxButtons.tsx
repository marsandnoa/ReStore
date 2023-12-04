import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";

interface Props{
    items: string[];
    checked?: string[];
    onChange:(item:string[])=>void;
}

export default function CheckboxButtons({items,checked,onChange}:Props){
    const[checkedItems, setCheckedItems]=useState(checked||[]);

    function handleChecked(value:string){
        const currentIndex=checkedItems.findIndex(item=>item===value);
        console.log(currentIndex);
        let newChecked:string[]=[];
        if(currentIndex===-1){
            newChecked=[...checkedItems,value];
            setCheckedItems(newChecked);
            onChange(newChecked);
            console.log(checkedItems);
        }else{
            newChecked=checkedItems.filter(item=>item!==value);
            setCheckedItems(newChecked);
            onChange(newChecked);
        }
    }

    return(
        <FormGroup>
        {items.map(item=>(
          <FormControlLabel 
          control={
            <Checkbox
                checked={checkedItems.indexOf(item)!==-1}
                onChange={()=>handleChecked(item)} 
            />}
          key={item} 
          label={item} />
        ))}
      </FormGroup>
    )
}