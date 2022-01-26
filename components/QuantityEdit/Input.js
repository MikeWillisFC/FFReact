import {useState,useEffect,useCallback,useMemo} from "react";
import {
   Fragment,
   InputGroup,
   InputLeftAddon,
   NumberInput,
   NumberInputField,
   NumberInputStepper,
   NumberIncrementStepper,
   NumberDecrementStepper,
   Tooltip,
   Input,
   Box
} from "@chakra-ui/react";

import tooltipStyles from "../../styles/chakra/tooltip.module.scss";

const MyInput = props => {
   const [state_quantity,setState_quantity] = useState(props.quantity);
   const [state_quantityValid,setState_quantityValid] = useState(true);
   const [state_quantityFocused,setState_quantityFocused] = useState(false);

   let {onValidityChange,quantity,touched,samplesPermitted,minimum,enforceMinimum,onChange} = props;

   if ( typeof( enforceMinimum ) !== "boolean" ) {
      enforceMinimum = enforceMinimum.trim() === "yes" || enforceMinimum.trim() === "1";
   }

   let allowSamples = useMemo(()=>{
      return minimum > 1 && samplesPermitted;
   },[
      minimum,
      samplesPermitted
   ]);
   let minQuantityNote = useMemo(()=>{
      let result = `The minimum quantity for this item is ${minimum}`;
      if ( minimum > 1 && allowSamples ) {
         result = `${result}, or 1 for samples`;
      }
      return result;
   },[
      minimum,
      allowSamples
   ]);

   let checkQuantity = useCallback(quantity => {
      if ( !quantity ) {
         setState_quantityValid(false);
      } else {
         if ( enforceMinimum && parseInt(quantity) < parseInt(minimum) ) {
            if ( parseInt(quantity) === 1 && samplesPermitted ) {
               // ok then
               setState_quantityValid(true);
            } else {
               setState_quantityValid(false);
            }
         } else {
            setState_quantityValid(true);
         }
      }
   },[samplesPermitted,minimum,enforceMinimum]);

   useEffect(()=>{
      if ( !state_quantity ) {
         /* if it's undefined that means the component just loaded and the user hasn't touched it yet.
         * it must be showing the default value, it's not invalid yet
         */
         if ( typeof(state_quantity) !== "undefined" ) {
            setState_quantityValid(false);
         }
      } else {
         if ( enforceMinimum && parseInt(state_quantity) < parseInt(minimum) ) {
            if ( parseInt(state_quantity) === 1 && samplesPermitted ) {
               // ok then
               setState_quantityValid(true);
            } else {
               setState_quantityValid(false);
            }
         } else {
            setState_quantityValid(true);
         }
      }
   },[state_quantity,samplesPermitted,minimum,enforceMinimum]);

   useEffect(()=>{
      if ( onValidityChange ) {
         onValidityChange(state_quantityValid);
      }
   },[onValidityChange,state_quantityValid]);

   let handleChange = useCallback(value => {
      checkQuantity(value);
      setState_quantity(value);
      onChange(value);
   },[checkQuantity,onChange]);

   useEffect(()=>{
      if ( typeof(state_quantity) === "undefined" ) {
         // just set it to the minimum
         handleChange(minimum);
      }
   },[minimum,state_quantity,handleChange]);

   return (
      <Tooltip
         hasArrow
         label={minQuantityNote}
         className={tooltipStyles.tooltip}
         isOpen={!state_quantityValid || state_quantityFocused}
         data-status={(!state_quantityValid ? "error" : "info")}
      >

         <NumberInput
            min={minimum}
            placeholder="Quantity"
            name="Quantity"
            value={state_quantity}
            onChange={handleChange}
            isInvalid={!state_quantityValid}
            onMouseOver={event=>setState_quantityFocused(true)}
            onMouseOut={event=>setState_quantityFocused(false)}
            onFocus={event=>setState_quantityFocused(true)}
            onBlur={event=>setState_quantityFocused(false)}
         >
            {
               props.showLabel ? (
                  <InputGroup>
                     <InputLeftAddon>Quantity</InputLeftAddon>
                     <NumberInputField
                        placeholder="Quantity"
                     />
                     <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                     </NumberInputStepper>
                  </InputGroup>
               ) : (
                  <Box>
                     <NumberInputField
                        placeholder="Quantity"
                     />
                     <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                     </NumberInputStepper>
                  </Box>
               )
            }
         </NumberInput>

      </Tooltip>
   );
}; // MyInput

export default MyInput;