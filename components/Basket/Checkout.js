import {Fragment,useState} from "react";
import { FaMailBulk,FaLock } from 'react-icons/fa';
import Link from "next/link";
import { Box,Stack,Flex,Button } from "@chakra-ui/react";

import {formatPrice} from "../../utilities";

import baskStyles from "../../styles/basket.module.scss";

const Checkout = props => {
   const [state_shipping,setState_shipping] = useState(null);

   let renderTotal = () => {
      let total = props.subtotal + ( state_shipping ? state_shipping : 0 );
      if ( props.basketCharges && props.basketCharges.length ) {
         props.basketCharges.forEach(charge=>{total += parseInt(charge.amount)});
      }
      return formatPrice(total);
   };

   return (
      <Stack spacing="3px" className={baskStyles.checkout}>
         <Flex>
            <Box width="70%">Merchandise Subtotal:</Box>
            <Box width="30%">{formatPrice(parseInt(props.subtotal))}</Box>
         </Flex>
         {
            props.basketCharges && props.basketCharges.length && <Fragment>
               {
                  props.basketCharges.map(charge=>{
                     return (
                        <Flex key={charge.descrip}>
                           <Box width="70%">{charge.descrip}:</Box>
                           <Box width="30%">{formatPrice(parseInt(charge.amount))}</Box>
                        </Flex>
                     )
                  })
               }
            </Fragment>
         }
         <Flex>
            <Box width="70%">
               <Button
                  leftIcon={<FaMailBulk />}
                  size="sm"
                  colorScheme="twitter"
               >
                  Click to Estimate Shipping
               </Button>
            </Box>
            <Box width="30%">
               {
                  state_shipping ?
                     formatPrice(parseInt(state_shipping))
                  : ""
               }
            </Box>
         </Flex>
         <Flex>
            <Box width="70%">Est. Total:</Box>
            <Box width="30%">
               {renderTotal()}
            </Box>
         </Flex>


         <Flex>
            <Box width="100%">
               <Link href="/checkout/Shipping" passHref>
                  <Button
                     leftIcon={<FaLock />}
                     size="lg"
                     colorScheme="blue"
                     width="100%"
                  >
                     Proceed to Secure Checkout
                  </Button>
               </Link>
            </Box>
         </Flex>
      </Stack>
   );
};

export default Checkout;