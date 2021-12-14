import { Fragment,useState,useEffect,useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import _ from "lodash";
import {
   HStack,
   Stack,
   Skeleton,
   Box,
   Center,
   Container,
   Table,
   Thead,
   Tbody,
   Tr,
   Th,
   Td,
   AlertIcon,
   Alert,
   Divider
} from "@chakra-ui/react";

import ItemRow from "../components/Basket/ItemRow";
import Footer from "../components/Basket/Footer";

import styles from "../styles/basket.module.scss";

const Basket = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   const [state_basketItems,setState_basketItems] = useState(null);
   const [state_basketSubtotal,setState_basketSubtotal] = useState(0);
   const [state_basketCharges,setState_basketCharges] = useState(null);
   const [state_basketID,setState_basketID] = useState(null);
   const [state_basketLoading,setState_basketLoading] = useState(false);
   const [state_itemValidities,setState_itemValidities] = useState([]);

   let {setNavVisibility} = props;

   let quantityIsValid = useCallback(item=>{
      //console.log("quantityIsValid, item:", item);
      if ( item.customFields.minimum && (item.customFields.enforceMinimum === "1" || item.customFields.enforceMinimum === "yes") ) {
         let quantity = parseInt(item.quantity);
         // there's a minimum and it's enforced
         if ( quantity >= parseInt( item.customFields.minimum ) ) {
            return true;
         } else {
            if ( quantity === 1 && !item.customFields.blockSamples.trim() ) {
               // samples are allowed, we're good
               return true;
            } else {
               // no good
               return false;
            }
         }
      } else {
         return true;
      }
   },[]);

   useEffect(()=>{
      let getBasket = async () => {
         setState_basketLoading(true);
         let response = await axios.get(`${globalConfig.apiEndpoint}&cAction=getBASK`,
            {
               withCredentials: true
            }
         );
         //console.log("response",response);
         if ( response.status ) {
            setState_basketLoading(false);
            setState_basketItems( response.data.basketItems.map(item=>{
               return {
                  ...item,
                  quantityIsValid:quantityIsValid(item)
               }
            }));
            setState_basketCharges( response.data.basketCharges );
            setState_basketID( response.data.basketID );
         }
      };
      setNavVisibility(false);
      getBasket();
   },[
      globalConfig.apiEndpoint,
      setNavVisibility,
      quantityIsValid
   ]);

   useEffect(()=>{
      let subtotal = 0;
      if ( state_basketItems && state_basketItems.length ) {
         state_basketItems.forEach(item=>{
            // console.log("adding item",item);
            // console.log("item.price",item.price);
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
      setState_basketSubtotal(subtotal);
   },[state_basketItems]);

   let handleQuantityChange = useCallback(async (quantity, lineID) => {
      //console.log("quantity",quantity);
      /* 2021-09-01: we purposely set the state twice here. First we set the quantity,
      * which lets the page update quickly with no lag. Then we do the post and
      * update the price accordingly. If you change the quantity quickly you'll
      * notice that the price takes a split second longer to update. But at least
      * the quantity changes immediately so the user isn't annoyed by a laggy interface
      */
      if ( !quantity ) {
         /* maybe they hit backspace or something in prep to
         * type a new quantity. Anyway, do nothing for now.
         */
      } else {
         /* this change will already have taken place on the ItemRow component,
         * but we should do it here as well so the Basket has the correct
         * info stored.
         */
         setState_basketItems( prevState=>{
            return prevState.map(item=>{
               if ( item.lineID !== lineID ) {
                  return item;
               } else {
                  let price = false;
                  if ( item.volPrices.length ) {
                     // console.log("quantity",quantity);
                     // console.log("item.volPrices",item.volPrices);
                     let volPrice = item.volPrices.filter(price=>{
                        if ( price.high === "0" ) {
                           price.high = "9999";
                        }
                        return parseInt(price.low) <= quantity && parseInt(price.high) >= quantity;
                     });
                     if ( volPrice.length && volPrice.length === 1 ) {
                        price = parseInt(volPrice[0].amount);
                     }
                  }
                  // console.log("price",price);
                  return {
                     ...item,
                     quantity:quantity,
                     quantityIsValid:quantityIsValid({...item,quantity:quantity}),
                     price:(price || item.price)
                  };
               }
            });
         });

         /* now make the cart aware of the change. We'll use the return to get the updated
         * basket charges.
         */
         const headers = { 'Content-Type': 'multipart/form-data' };
         let bodyFormData = new FormData();

         // Action: QNTY
         // Store_Code: FF
         // Basket_Line: 3228864
         // Old_Screen: BASK
         // Offset:
         // AllOffset:
         // CatListingOffset:
         // RelatedOffset:
         // SearchOffset:
         // Quantity: 134

         bodyFormData.set( "Action", "QNTY" );
         bodyFormData.set( "Store_Code", "FF" );
         bodyFormData.set( "basketID", state_basketID );
         bodyFormData.set( "Basket_Line", lineID );
         bodyFormData.set( "Quantity", quantity );

         //console.log("globalConfig",globalConfig);
         const response = await axios.post( `${globalConfig.apiEndpoint}`, bodyFormData, {
            headers: headers,
            withCredentials: true
         });
         if ( response.status ) {
            //console.log("response.data",response.data);
            setState_basketCharges( response.data.basketCharges );
            /* 2021-12-10: I know include volume pricing as part of the item on basket load.
            * Since we already know the price, the below code is not needed. The price update
            * on the item line has already been done above.
            */
            // setState_basketItems( prevState=>{
            //    return prevState.map(item=>{
            //       if ( item.lineID !== lineID ) {
            //          return item;
            //       } else {
            //          //console.log("response.data",response.data);
            //          // console.log("parseInt(response.data.quantity)",parseInt(response.data.quantity));
            //          return {...item, price:parseInt(response.data.price)};
            //       }
            //    });
            // });
         }
      }
   },[
      quantityIsValid,
      globalConfig.apiEndpoint,
      state_basketID
   ]); // handleQuantityChange

   let handleRemoveItem = async (lineID) => {
      /* 2021-09-01: we purposely set the state twice here, it makes process feel
      * quick for the user
      */
      setState_basketItems( prevState=>{
         return prevState.filter(item=>item.lineID !== lineID);
      });

      const headers = { 'Content-Type': 'multipart/form-data' };
      let bodyFormData = new FormData();

      // Action: RPRD
      // Store_Code: FF
      // Basket_Line: 3230336

      bodyFormData.set( "Action", "RPRD" );
      bodyFormData.set( "Store_Code", "FF" );
      bodyFormData.set( "Basket_Line", lineID );

      //console.log("globalConfig",globalConfig);
      const response = await axios.post( `${globalConfig.apiEndpoint}`, bodyFormData, {
         headers: headers,
         withCredentials: true
      });
      if ( response.status ) {
         setState_basketCharges( response.data.basketCharges );
         //console.log("response.data",response.data);
      }
   }; // handleRemoveItem

   //console.log("Basket props",props);

   return (
      <Fragment>
         {
            state_basketItems && state_basketItems.length ? (
               <Fragment>
                  <Container maxW="100%">
                     <HStack spacing="25px" className={`darkGrey ${styles.basketTools}`}>
                        <Link href="/SavedBasket">View Your Saved Basket</Link>
                        <Link href="/SaveBasket">Save Your Basket</Link>
                        <span style={{cursor: "pointer"}}>Need Help With Your Order?</span>
                     </HStack>
                     <Table className={styles.basketTable}>
                        <Thead>
                           <Tr>
                              <Th className={styles.thumbColumn}>&nbsp;</Th>
                              <Th className={styles.nameColumn}>Name</Th>
                              <Th className={styles.priceColumn}>Price</Th>
                              <Th className={styles.qtyColumn}>Quantity</Th>
                              <Th className={styles.totalColumn}>Total</Th>
                              <Th className={styles.editColumn}>Remove</Th>
                           </Tr>
                        </Thead>
                        <Tbody>
                           {
                              state_basketItems.map( item => {
                                 return (
                                    <ItemRow
                                       key={item.lineID}
                                       item={item}
                                       domain={globalConfig.domain}
                                       editable={true}
                                       apiEndpoint={globalConfig.apiEndpoint}
                                       basketID={state_basketID}
                                       onQuantityChange={handleQuantityChange}
                                       onRemoveItem={handleRemoveItem}
                                       quantityIsValid={quantityIsValid}
                                    />
                                 )
                              })
                           }
                        </Tbody>
                     </Table>
                  </Container>

                  <Footer
                     basketCharges={state_basketCharges}
                     subtotal={state_basketSubtotal}
                     items={state_basketItems}
                  />
               </Fragment>
            ) : (
               <Fragment>
                  {
                     state_basketLoading ? (
                        <Stack>
                           <Box>Loading your basket...</Box>
                           <Skeleton height='20px' />
                           <Skeleton height='20px' />
                           <Skeleton height='20px' />
                        </Stack>
                     ) : (
                        <Box margin="30px">
                           <Center>
                              <Alert status='info'>
                                 <AlertIcon />
                                 Your shopping basket is currently empty.
                              </Alert>
                           </Center>
                        </Box>
                     )
                  }
               </Fragment>
            )
         }
      </Fragment>
   );
};

export default Basket;