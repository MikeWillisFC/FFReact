import {useState,useEffect} from "react";
import {
   NumberInput,
   NumberInputField,
   NumberInputStepper,
   NumberIncrementStepper,
   NumberDecrementStepper
} from "@chakra-ui/react";

const QuantityInput = props => {
   // all fields will be considered touched if the user clicks add to cart
   const [state_touched,setState_touched] = useState(props.touched || false);
   const [state_valid,setState_valid] = useState(true);

   let {isValid,touched} = props;
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

   return (
      <NumberInput
         min={0}
         placeholder="Quantity"
         value={props.quantity}
         onChange={props.handleQuantityChange}
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
   );
}; // QuantityInput

export default QuantityInput;