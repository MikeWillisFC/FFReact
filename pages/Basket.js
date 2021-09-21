import { Fragment,useState,useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import _ from "lodash";
import {
   HStack,
   Box,
   Container,
   Table,
   Thead,
   Tbody,
   Tr,
   Th,
   Td
} from "@chakra-ui/react";

import ItemRow from "../components/Basket/ItemRow";
import Footer from "../components/Basket/Footer";

import baskStyles from "../styles/basket.module.scss";

const Basket = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   const [state_basketItems,setState_basketItems] = useState(null);
   const [state_basketSubtotal,setState_basketSubtotal] = useState(0);
   const [state_basketCharges,setState_basketCharges] = useState(null);
   const [state_basketID,setState_basketID] = useState(null);

   let {setNavVisibility} = props;

   useEffect(()=>{
      let getBasket = async () => {
         let response = await axios.get(`${globalConfig.apiEndpoint}&cAction=getBASK`,
            {
               withCredentials: true
            }
         );
         //console.log("response",response);
         if ( response.status ) {
            setState_basketItems( response.data.basketItems );
            setState_basketCharges( response.data.basketCharges );
            setState_basketID( response.data.basketID );
         }
      };
      setNavVisibility(false);
      getBasket();
   },[globalConfig.apiEndpoint,setNavVisibility]);

   useEffect(()=>{
      let subtotal = 0;
      if ( state_basketItems && state_basketItems.length ) {
         state_basketItems.forEach(item=>{
            console.log("adding item",item);
            console.log("item.price",item.price);
            subtotal += item.price * item.quantity;

            if ( item.options !== "false" && item.options !== "unknown" ) {
               item.options.forEach(option=>{
                  console.log("option",option);
                  if ( option.price ) {
                     console.log("adding",(parseInt(option.price) * item.quantity));
                     subtotal += (parseInt(option.price) * item.quantity);
                  }
               })
            }
         });
      }
      setState_basketSubtotal(subtotal);
   },[state_basketItems]);

   let handleQuantityChange = async (quantity, lineID) => {
      //console.log("quantity",quantity);
      /* 2021-09-01: we purposely set the state twice here. First we set the quantity,
      * which lets the page update quickly with no lag. Then we do the post and
      * update the price accordingly. If you change the quantity quickly you'll
      * notice that the price takes a split second longer to update. But at least
      * the quantity changes immediately so the user isn't annoyed by a laggy interface
      */
      setState_basketItems( prevState=>{
         return prevState.map(item=>{
            if ( item.lineID !== lineID ) {
               return item;
            } else {
               return {...item, quantity:quantity};
            }
         });
      });

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
         setState_basketItems( prevState=>{
            return prevState.map(item=>{
               if ( item.lineID !== lineID ) {
                  return item;
               } else {
                  // console.log("response.data",response.data);
                  // console.log("parseInt(response.data.quantity)",parseInt(response.data.quantity));
                  return {...item, price:parseInt(response.data.price)};
               }
            });
         });
      }
   }; // handleQuantityChange

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

   console.log("Basket props",props);

   return (
      <Fragment>
         { state_basketItems && state_basketItems.length ?

            <Fragment>
               <Container maxW="100%">
                  <HStack spacing="25px" className={`darkGrey ${baskStyles.basketTools}`}>
                     <Link href="/SavedBasket">View Your Saved Basket</Link>
                     <Link href="/SaveBasket">Save Your Basket</Link>
                     <span style={{cursor: "pointer"}}>Need Help With Your Order?</span>

                  </HStack>
                  <Table className={baskStyles.basketTable}>
                     <Thead>
                        <Tr>
                           <Th className={baskStyles.thumbColumn}>&nbsp;</Th>
                           <Th className={baskStyles.nameColumn}>Name</Th>
                           <Th className={baskStyles.priceColumn}>Price</Th>
                           <Th className={baskStyles.qtyColumn}>Quantity</Th>
                           <Th className={baskStyles.totalColumn}>Total</Th>
                           <Th className={baskStyles.editColumn}>Remove</Th>
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
               />

            </Fragment>

         : ""}
      </Fragment>
   );
};

export default Basket;