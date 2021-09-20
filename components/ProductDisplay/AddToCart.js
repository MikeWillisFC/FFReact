import {useState,useEffect} from "react";
import { FaCartPlus } from 'react-icons/fa';
import {
   Box,
   Stack,
   Button,
   NumberInput,
   NumberInputField,
   NumberInputStepper,
   NumberIncrementStepper,
   NumberDecrementStepper,
   Icon
} from "@chakra-ui/react";

const AddToCart = props => {
   const [state_quantity,setState_quantity] = useState(props.quantity);

   useEffect(()=>{
      setState_quantity(props.quantity);
   },[props.quantity]);

   let handleQuantityChange = value =>{
      props.quantityRef.current = value;
      setState_quantity(value);
   }; // handleQuantityChange

   return (
      <Stack
         direction={["column", "column", "row"]}
         spacing="5px"
         style={{borderTop: "1px solid #C5DBEC", padding:"4px"}}
      >
         <Box w={["100%","100%","50%"]} className="darkBlue">
            <NumberInput
               min={0}
               placeholder="Quantity"
               value={state_quantity}
               onChange={handleQuantityChange}
            >
               <NumberInputField placeholder="Quantity" />
               <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
               </NumberInputStepper>
            </NumberInput>
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