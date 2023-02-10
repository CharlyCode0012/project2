import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import CrudContext from "../../../Context/CrudContext";



export const SelectOption = ({ url }) => {
  const { getSelect, categories } = useContext(CrudContext);
  useEffect(() => {
    getSelect(url, false);
  }, [])
  
  console.log(categories);

/*   value.then((resolve)=>{
    values.push(resolve);
    console.log(values[0]);
  }); */
  
  

  return (
    <>
      
      {/* {categories.forEach((element) => {
          values.forEach((element) => {
          <option key={element.id} value={element.id}>
            {element.name}
          </option>;
        })} */}
    </>
  );
};
