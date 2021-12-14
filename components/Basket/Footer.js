import {Fragment} from "react";
import { Box,Stack } from "@chakra-ui/react";

import Policies from "./Policies";
import Checkout from "./Checkout";

import styles from "../../styles/basket.module.scss";

const Footer = props => {
   return (
      <Stack
         direction={["column", "row"]}
         spacing="20px"
         className={styles.footer}
      >
         <Box width={["100%", "50%","60%"]}>
            <Policies />
         </Box>
         <Box width={["100%", "50%","40%"]}>
            <Checkout
               basketCharges={props.basketCharges}
               subtotal={props.subtotal}
               items={props.items}
            />
         </Box>
      </Stack>
   );
};

export default Footer;