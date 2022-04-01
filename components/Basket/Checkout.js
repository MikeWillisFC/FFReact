/* 2022-03-29: NO LONGER IN USE
*
*
*
*
* replaced by ./Charges.js
*
*
*
*
*
*
*
*
*
*
*/




























































import {Fragment,useState,useEffect} from "react";
import { FaMailBulk,FaLock } from 'react-icons/fa';
import Link from "next/link";
import { Box,Stack,Flex,Button } from "@chakra-ui/react";

import EstimateShipping from "./EstimateShipping";
import {formatPrice,openMiscModal} from "../../utilities";

import styles from "../../styles/basket.module.scss";

const Checkout = props => {
   const [state_shipping,setState_shipping] = useState(null);
   const [state_allowCheckout,setState_allowCheckout] = useState(true);
   const [st_highlightShipping,sst_highlightShipping] = useState(false);

   let {items} = props;

   let ignoredCharges = ["shipping","sales tax","delivery confirmation signature"];

   let renderTotal = () => {
      let total = props.subtotal + ( state_shipping ? state_shipping : 0 );
      if ( props.basketCharges && props.basketCharges.length ) {
         props.basketCharges.filter(charge=>{
            for( let i = 0; i < ignoredCharges.length; i++ ) {
               if ( charge.descrip.substr(0,ignoredCharges[i].length).toLowerCase() === ignoredCharges[i] )  {
                  return false;
               }
            }
            return true;
         }).forEach(charge=>{total += parseInt(charge.amount)});
      }
      return formatPrice(total);
   }; // renderTotal

   useEffect(()=>{
      let badItems = items.filter(item=>{
         return !item.quantityIsValid;
      });
      if ( badItems.length ) {
         setState_allowCheckout(false);
      } else {
         setState_allowCheckout( true );
      }
   },[items]);

   useEffect(()=>{
      sst_highlightShipping(true);
      let timeout = setTimeout(()=>{
         sst_highlightShipping(false);
      },[4000]);

      return ()=>{
         clearTimeout(timeout);
      };
   },[state_shipping]);

   let estimateShipping = event => {
      event.preventDefault();
      // console.log("estimateShipping clicked");
      openMiscModal({
         setModal: props.setMiscModal,
         disclosure: props.miscModalDisclosure,
         title: "Estimate Shipping",
         size: "2xl",
         minHeight: "300px",
         content: (
            <EstimateShipping
               singleSupplier={props.singleSupplier}
               setShipping={setState_shipping}
               miscModalDisclosure={props.miscModalDisclosure}
            />
         )
      });
   };

   return (
      <Stack spacing="3px" className={styles.checkout}>
         <Flex>
            <Box width="70%">Merchandise Subtotal:</Box>
            <Box width="30%">{formatPrice(parseInt(props.subtotal))}</Box>
         </Flex>
         {
            props.basketCharges && props.basketCharges.length && <Fragment>
               {
                  props.basketCharges.filter(charge=>{
                     for( let i = 0; i < ignoredCharges.length; i++ ) {
                        if ( charge.descrip.substr(0,ignoredCharges[i].length).toLowerCase() === ignoredCharges[i] )  {
                           return false;
                        }
                     }
                     return true;
                  }).map(charge=>{
                     let description = charge.descrip;
                     if ( description.indexOf("|") !== -1 ) {
                        description = description.split("|")[0];
                     }
                     return (
                        <Flex key={description}>
                           <Box width="70%">{description}:</Box>
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
                  onClick={estimateShipping}
               >
                  Click to Estimate Shipping
               </Button>
            </Box>
            <Box width="30%" className={`${styles.highlightTransition} ${(st_highlightShipping ? styles.highlighted : "")}`}>
               {
                  state_shipping ?
                     formatPrice(parseInt(state_shipping))
                  : ""
               }
            </Box>
         </Flex>
         <Flex>
            <Box width="70%">Est. Total:</Box>
            <Box width="30%" className={`${styles.highlightTransition} ${(st_highlightShipping ? styles.highlighted : "")}`}>
               {renderTotal()}
            </Box>
         </Flex>

         {
            state_allowCheckout && (
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
            )
         }

      </Stack>
   );
};

export default Checkout;