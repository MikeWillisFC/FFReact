import {useState,useEffect,useRef} from "react";
import { Select } from "@chakra-ui/react"

const QuantityDropdown = props => {
   // all fields will be considered touched if the user clicks add to cart
   const [state_touched,setState_touched] = useState(props.touched || false);
   const [state_valid,setState_valid] = useState(true);

	const quantityFieldRef = useRef();

	useEffect(()=>{
		// why the useEffect? because window might not be defined outside the useEffect in NextJS
		if ( !window.fashioncraftFormFields ) { window.fashioncraftFormFields = {}; }
		window.fashioncraftFormFields.quantity = quantityFieldRef.current;
	},[]);
	
   let {isValid,touched,samplesPermitted} = props;
   useEffect(()=>{
      if ( !isValid ) {
         setState_touched(prevState=>{
            if ( !prevState ) {
               // do nothing, yet
            } else {
               setState_valid(false);
            }
            return prevState;
         });
      } else {
         setState_valid(true);
      }
   },[isValid]);

   useEffect(()=>{
      if ( touched ) {
         setState_touched( true );
      }
   },[touched]);

   console.log("QuantityDropdown rendering, props:",props);

   let {prodMin,quantityIncrement,prodQuantityMax} = props.minimum;
   if ( !prodQuantityMax || prodQuantityMax > 600 ) {
      prodQuantityMax = 600;
   }
   // console.log("prodMin",prodMin);
   // console.log("quantityIncrement",quantityIncrement);
   // console.log("prodQuantityMax",prodQuantityMax);

   return (
      <Select
         placeholder={props.placeholder || null}
         value={props.quantity}
         onChange={props.onChange}
         onBlur={event=>setState_touched(true)}
         isInvalid={!state_valid}
			ref={quantityFieldRef}
      >
         { samplesPermitted && <option value="1">1 - Sample Orders Only</option> }
         {
            Array.from({length:Math.floor(prodQuantityMax/quantityIncrement)}).map((el,index)=>{
               let val = index * quantityIncrement;
               // console.log("index",index);
               // console.log("quantityIncrement",quantityIncrement);
               if ( val < prodMin ) {
                  return "";
               } else {
                  return <option key={val} value={val}>{val}</option>;
               }
            })
         }
      </Select>
   );
}; // QuantityDropdown

export default QuantityDropdown;