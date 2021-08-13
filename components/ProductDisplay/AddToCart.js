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
               value={props.quantity}
               onChange={value=>{props.setQuantity(value)}}
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