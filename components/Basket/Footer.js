import {Fragment} from "react";
import { Box,Stack } from "@chakra-ui/react";

import Policies from "./Policies";
import Checkout from "./Checkout";

const Footer = props => {
   return (
      <Stack direction={["column", "row"]} spacing="20px" style={{borderTop:"1px solid #ccc",paddingTop:"10px"}}>
         <Box width={["100%", "50%","60%"]}>
            <Policies />
         </Box>
         <Box width={["100%", "50%","40%"]}>
            <Checkout
               basketCharges={props.basketCharges}
               subtotal={props.subtotal}
            />
         </Box>
      </Stack>
   );
};

export default Footer;