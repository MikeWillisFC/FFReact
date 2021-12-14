/* 2021-12-10: NOT IN USE
* see components/QuantityEdit/Input.js, which is meant as a replacement for this that can
* be more easily reused elsewhere, such as in the cart
*/











































import {useState,useEffect} from "react";
import {
   NumberInput,
   NumberInputField,
   NumberInputStepper,
   NumberIncrementStepper,
   NumberDecrementStepper,
   Tooltip,
} from "@chakra-ui/react";

import tooltipStyles from "../../styles/chakra/tooltip.module.scss";

const QuantityInput = props => {
   // all fields will be considered touched if the user clicks add to cart
   const [state_touched,setState_touched] = useState(props.touched || false);
   const [state_valid,setState_valid] = useState(true);

   let {isValid,touched,blockSamples} = props;
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

   let checkQuantity = quantity => {
      console.log("blockSamples",blockSamples);
      if ( props.enforceMinimum && parseInt(quantity) < parseInt(props.minimum) ) {
         if ( parseInt(quantity) === 1 && !blockSamples ) {
            // ok then
            console.log("valid true A");
            setState_valid(true);
         } else {
            console.log("valid false A");
            setState_valid(false);
         }
      } else {
         console.log("valid true B");
         setState_valid(true);
      }
   }

   let handleChange = value => {
      checkQuantity(value);
      props.onChange(value);
   };

   return (
      <Tooltip
         hasArrow
         //label={minQuantityNote}
         className={tooltipStyles.tooltip}
         //isOpen={!state_quantityValid || state_quantityFocused}
         //data-status={(!state_quantityValid ? "error" : "info")}
      >
         <NumberInput
            min={0}
            placeholder="Quantity"
            value={props.quantity}
            onChange={handleChange}
            onBlur={event=>setState_touched(true)}
            isInvalid={!state_valid}
         >
            <NumberInputField
               placeholder="Quantity"
            />
            <NumberInputStepper>
               <NumberIncrementStepper />
               <NumberDecrementStepper />
            </NumberInputStepper>
         </NumberInput>
      </Tooltip>
   );
}; // QuantityInput

export default QuantityInput;