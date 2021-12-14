import {useState,useEffect,useCallback} from "react";
import { FaCartPlus } from 'react-icons/fa';
import {
   Box,
   Stack,
   Button,
   Icon
} from "@chakra-ui/react";

//import QuantityInput from "./QuantityInput";
import {default as QuantityInput} from "../QuantityEdit/Input";
import QuantityDropdown from "./QuantityDropdown";

const AddToCart = props => {
   const [state_quantity,setState_quantity] = useState(props.quantity);
   const [state_disabled,setState_disabled] = useState(props.disabled);

   //console.log("AddToCart rendering, props:",props);

   useEffect(()=>{
      setState_quantity(props.quantity);
   },[props.quantity]);

   let handleQuantityChange = value => {
      //console.log("handleQuantityChange", value);
      props.quantityRef.current = value;
      setState_quantity(value);
   }; // handleQuantityChange

   let handleQuantityValidityChange = useCallback(isValid => {
      // console.log("handleQuantityValidityChange isvalid:",isValid);
      setState_disabled(!isValid);
   },[]);

   let inputType = props.minimum && props.minimum.indexOf("^") !== -1 ? "dropdown" : "input";

   return (
      <Stack
         direction={["column", "column", "row"]}
         spacing="5px"
         style={{borderTop: "1px solid #C5DBEC", padding:"4px"}}
      >
         <Box w={["100%","100%","50%"]} className="darkBlue">
            {
               inputType === "input" ? (
                  <QuantityInput
                     quantity={state_quantity}
                     onChange={handleQuantityChange}
                     minimum={props.minimum}
                     enforceMinimum={props.enforceMinimum}
                     blockSamples={props.blockSamples}
                     onValidityChange={handleQuantityValidityChange}
                  />
               ) : (
                  <QuantityDropdown
                     quantity={state_quantity}
                     onChange={handleQuantityChange}
                     minimum={props.minimum}
                     enforceMinimum={props.enforceMinimum}
                     blockSamples={props.blockSamples}
                     isValid={props.isValid}
                  />
               )
            }
         </Box>
         <Box
            width={["100%","100%","50%"]}
         >
            <Button
               type="submit"
               leftIcon={<Icon as={FaCartPlus} color="black" />}
               className="mediumBlueButton_Horizontal"
               width="100%"
               form={props.formID}
               disabled={state_disabled}
            >
               Add To Cart
            </Button>
         </Box>
      </Stack>
   );
};

export default AddToCart;