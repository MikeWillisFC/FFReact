import {useState,useEffect,useCallback,useMemo} from "react";
import {
   NumberInput,
   NumberInputField,
   NumberInputStepper,
   NumberIncrementStepper,
   NumberDecrementStepper,
   Tooltip,
} from "@chakra-ui/react";

import tooltipStyles from "../../styles/chakra/tooltip.module.scss";

const Input = props => {
   const [state_quantity,setState_quantity] = useState(props.quantity);
   const [state_quantityValid,setState_quantityValid] = useState(true);
   const [state_quantityFocused,setState_quantityFocused] = useState(false);

   let {onValidityChange,quantity,touched,blockSamples,minimum,enforceMinimum,onChange} = props;

   if ( typeof( blockSamples ) !== "boolean" ) {
      blockSamples = blockSamples.trim() === "yes" || blockSamples.trim() === "1";
   }
   if ( typeof( enforceMinimum ) !== "boolean" ) {
      enforceMinimum = enforceMinimum.trim() === "yes" || enforceMinimum.trim() === "1";
   }

   let minQuantity = useMemo(()=>{
      return minimum && enforceMinimum ? parseInt(minimum) : 1;
   },[
      minimum,
      enforceMinimum
   ]);
   let allowSamples = useMemo(()=>{
      return minQuantity > 1 && !blockSamples;
   },[
      minQuantity,
      blockSamples
   ]);
   let minQuantityNote = useMemo(()=>{
      let result = `The minimum quantity for this item is ${minQuantity}`;
      if ( minQuantity > 1 && allowSamples ) {
         result = `${result}, or 1 for samples`;
      }
      return result;
   },[
      minQuantity,
      allowSamples
   ]);

   let checkQuantity = useCallback(quantity => {
      if ( !quantity ) {
         setState_quantityValid(false);
      } else {
         if ( enforceMinimum && parseInt(quantity) < parseInt(minimum) ) {
            if ( parseInt(quantity) === 1 && !blockSamples ) {
               // ok then
               setState_quantityValid(true);
            } else {
               setState_quantityValid(false);
            }
         } else {
            setState_quantityValid(true);
         }
      }
   },[blockSamples,minimum,enforceMinimum]);

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
            if ( parseInt(state_quantity) === 1 && !blockSamples ) {
               // ok then
               setState_quantityValid(true);
            } else {
               setState_quantityValid(false);
            }
         } else {
            setState_quantityValid(true);
         }
      }
   },[state_quantity,blockSamples,minimum,enforceMinimum]);

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
         handleChange(minQuantity);
      }
   },[minQuantity,state_quantity,handleChange]);

   return (
      <Tooltip
         hasArrow
         label={minQuantityNote}
         className={tooltipStyles.tooltip}
         isOpen={!state_quantityValid || state_quantityFocused}
         data-status={(!state_quantityValid ? "error" : "info")}
      >
         <NumberInput
            min={1}
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
}; // Input

export default Input;