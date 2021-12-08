import {useState,useEffect} from "react";
import { FaCartPlus } from 'react-icons/fa';
import {
   Box,
   Stack,
   Button,
   Icon
} from "@chakra-ui/react";

import QuantityInput from "./QuantityInput";
import QuantityDropdown from "./QuantityDropdown";

const AddToCart = props => {
   const [state_quantity,setState_quantity] = useState(props.quantity);

   //console.log("AddToCart rendering, props:",props);

   useEffect(()=>{
      setState_quantity(props.quantity);
   },[props.quantity]);

   let handleQuantityChange = value =>{
      props.quantityRef.current = value;
      setState_quantity(value);
   }; // handleQuantityChange

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
                     blockSamples={props.blockSamples}
                     isValid={props.isValid}
                  />
               ) : (
                  <QuantityDropdown
                     quantity={state_quantity}
                     onChange={handleQuantityChange}
                     minimum={props.minimum}
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
            >
               Add To Cart
            </Button>
         </Box>
      </Stack>
   );
};

export default AddToCart;