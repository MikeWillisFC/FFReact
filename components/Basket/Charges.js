import {Fragment,useState,useEffect} from "react";
import { FaMailBulk,FaLock } from 'react-icons/fa';
import Link from "next/link";
import { Box,Stack,Flex,Button } from "@chakra-ui/react";

import EstimateShipping from "./EstimateShipping";
import {formatPrice,openMiscModal} from "../../utilities";

import styles from "../../styles/basket.module.scss";

const Charges = props => {
   /* props.viewType can be:
   * cart: estimate shipping and checkout buttons can be displayed
   * summary: just a list, no interactivity
   */

   const [st_shipping,sst_shipping] = useState(null);
   const [st_allowCheckout,sst_allowCheckout] = useState(true);
   const [st_highlightShipping,sst_highlightShipping] = useState(false);
   const [st_subtotal,sst_subtotal] = useState(0);
   const [st_ignoredCharges,sst_ignoredCharges] = useState([]);

   let {
      items,
      viewType
   } = props;

   useEffect(()=>{
      let subtotal = 0;
      if ( items && items.length ) {
         items.forEach(item=>{
            subtotal += item.price * item.quantity;

            if ( item.options !== "false" && item.options !== "unknown" ) {
               item.options.forEach(option=>{
                  //console.log("option",option);
                  if ( option.price ) {
                     //console.log("adding",(parseInt(option.price) * item.quantity));
                     subtotal += (parseInt(option.price) * item.quantity);
                  }
               })
            }
         });
      }
      sst_subtotal(subtotal);
   },[items]);

   let renderTotal = () => {
      let total = st_subtotal + ( st_shipping ? st_shipping : 0 );
      if ( props.basketCharges && props.basketCharges.length ) {
         props.basketCharges.filter(charge=>{
            for( let i = 0; i < st_ignoredCharges.length; i++ ) {
               if ( charge.descrip.substr(0,st_ignoredCharges[i].length).toLowerCase() === st_ignoredCharges[i] )  {
                  return false;
               }
            }
            return true;
         }).forEach(charge=>{total += parseInt(charge.amount)});
      }
      return formatPrice(total);
   }; // renderTotal

   useEffect(()=>{
      if ( viewType !== "cart" ) {
         sst_allowCheckout(false);
         sst_ignoredCharges([]);
      } else {
         sst_ignoredCharges(["shipping","sales tax","delivery confirmation signature"]);
         let badItems = items.filter(item=>{
            return !item.quantityIsValid;
         });
         if ( badItems.length ) {
            sst_allowCheckout(false);
         } else {
            sst_allowCheckout( true );
         }
      }
   },[items,viewType]);

   useEffect(()=>{
      sst_highlightShipping(true);
      let timeout = setTimeout(()=>{
         sst_highlightShipping(false);
      },[4000]);

      return ()=>{
         clearTimeout(timeout);
      };
   },[st_shipping]);

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
               setShipping={sst_shipping}
               miscModalDisclosure={props.miscModalDisclosure}
            />
         )
      });
   };

   return (
      <Stack spacing="3px" className={styles.checkout}>
         <Flex>
            <Box width="70%">Merchandise Subtotal:</Box>
            <Box width="30%">{formatPrice(parseInt(st_subtotal))}</Box>
         </Flex>

         <hr />

         {
            props.basketCharges && props.basketCharges.length && (
               <Fragment>
                  {
                     props.basketCharges.filter(charge=>{
                        for( let i = 0; i < st_ignoredCharges.length; i++ ) {
                           if ( charge.descrip.substr(0,st_ignoredCharges[i].length).toLowerCase() === st_ignoredCharges[i] )  {
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
            )
         }

         {
            props.viewType === "cart" ? (
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
                        st_shipping ?
                           formatPrice(parseInt(st_shipping))
                        : ""
                     }
                  </Box>
               </Flex>
            ) : ( "" )
         }

         <hr />
         <Flex>
            <Box width="70%">
               { props.viewType === "cart" ? "Est. " : "" }
               Total:
            </Box>
            <Box width="30%" className={`${styles.highlightTransition} ${(st_highlightShipping ? styles.highlighted : "")}`}>
               {renderTotal()}
            </Box>
         </Flex>

         {
            (props.viewType === "cart" && st_allowCheckout) ? (
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
            ) : ""
         }

      </Stack>
   );
};

export default Charges;