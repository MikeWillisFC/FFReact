import { Fragment,useState,useEffect,useCallback } from "react";
import { useSelector,useDispatch } from "react-redux";
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
   Divider,
   AlertTitle,
   AlertDescription,
   Heading
} from "@chakra-ui/react";

import ItemRow from "../components/Basket/ItemRow";
import Footer from "../components/Basket/Footer";
import Login from "../components/Login";
import {messagesActions} from "../store/slices/messages";
import {globalActions} from "../store/slices/global";
import {parseMessages,isLoggedIn} from "../utilities";

import styles from "../styles/basket.module.scss";

const SavedBasket = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });
   const dispatch = useDispatch();

   console.log("Saved Basket props",props);

   const [st_isLoggedIn,sst_isLoggedIn] = useState(null);

   const [state_basketItems,setState_basketItems] = useState(null);
   const [state_basketSubtotal,setState_basketSubtotal] = useState(0);
   const [state_basketLoading,setState_basketLoading] = useState(false);
   const [state_itemValidities,setState_itemValidities] = useState([]);

   let {
      setNavVisibility
   } = props;

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

   useEffect(()=>{setNavVisibility(false);},[setNavVisibility]);

   useEffect(()=>{
      let checkLogin = async () => {
         let result = await isLoggedIn(globalConfig.apiEndpoint);
         console.log("isLoggedIn result",result);
         sst_isLoggedIn(result);
         dispatch(globalActions.setLogin(result));
      }
      /* retrieving the saved basket requires login to be true.
      * But maybe this page has been sitting open for 3000 years, and the login
      * is no longer valid. Or maybe they have multiple tabs open and they
      * logged out on another tab. Anyway, we must always revalidate the login
      */
      checkLogin();
   },[globalConfig.apiEndpoint,dispatch]);

   useEffect(()=>{
      let getBasket = async () => {
         setState_basketLoading(true);
         dispatch(messagesActions.clearMessages());
         let response = await axios.get(`${globalConfig.apiEndpoint}&cAction=getSavedBasket`, {
            withCredentials: true
         });
         if ( response ) {
            let messages = parseMessages(response.data,dispatch,messagesActions);
            console.log("response",response);
            if ( response.status ) {
               setState_basketLoading(false);

               if ( response.data.basketItems ) {
                  setState_basketItems( response.data.basketItems.filter(item=>!item.a).map(item=>{
                     return {
                        ...item,
                        options:item.options.filter(option=>!option.a),
                        quantityIsValid:quantityIsValid(item)
                     }
                  }));
               }
            }
         }
      };

      if ( st_isLoggedIn ) {
         getBasket();
      }

   },[
      globalConfig.apiEndpoint,
      st_isLoggedIn,
      dispatch,
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

   },[
   ]); // handleQuantityChange

   let handleLogin = useCallback(() => {
      console.log("log in B");
      sst_isLoggedIn(true);
   },[]);

   let handleRemoveItem = useCallback(async (lineID)=>{
      console.log("removing from saved  cart, lineID:",lineID);

      setState_basketItems( prevState=>{
         return prevState.map(sItem=>{
            if ( sItem.lineID === lineID ) {
               return {...sItem,collapse:true};
            } else {
               return sItem;
            }
         })
         //return prevState.filter(sItem=>sItem.lineID !== item.lineID);
      });

      /* 2022-02-17: note that even though we're posting to screen MYREG,
      * Sebenza's module renders the BASK screen.
      */

      const headers = { 'Content-Type': 'multipart/form-data' };
      let bodyFormData = new FormData();

      bodyFormData.set( "api", "1" );
      bodyFormData.set( "Screen", "MYREG" );
      bodyFormData.set( "Action", "MYREG" );
      bodyFormData.set( "Store_Code", "FF" );
      bodyFormData.set( "reg_update_all", "1" );
      // bodyFormData.set( "reg_add2bask", "1" );
      //bodyFormData.set( "Registry:search", "" );
      //bodyFormData.set( "qty[31701]", "133" );

      bodyFormData.set( "delete_line", lineID );

      //bodyFormData.set( "FixAttributes", "1" );
      //bodyFormData.set( `qty[${item.lineID}]`, item.quantity );

      dispatch(messagesActions.clearMessages());
      const response = await axios.post( `https://${globalConfig.apiDomain}/mm5/merchant.mvc`, bodyFormData, {
         headers: headers,
         withCredentials: true
      });
      console.log("response",response);
      if ( response.status ) {
         let messages = parseMessages(response.data,dispatch,messagesActions);
         if (
            !messages.errorMessages.length &&
            !messages.informationMessages.length &&
            response.data.status === "1"
         ) {
            console.log("all good");

            if ( true ) {
               /* as of 2022-02-17, the collapse animation is set for .8 seconds
               * so we can wait 1 full second before deleting the row
               */
               setTimeout(()=>{
                  setState_basketItems( prevState=>{
                     return prevState.filter(sItem=>sItem.lineID !== lineID);
                  });
               }, 1000);
            }
         }
      }
   },[
      dispatch,
      globalConfig.apiDomain
   ]);

   let handleMoveToBasket = useCallback(async (item)=>{
      console.log("moving to basket, item:",item);

      /* 2022-02-17: note that even though we're posting to screen MYREG,
      * Sebenza's module renders the BASK screen.
      */

      const headers = { 'Content-Type': 'multipart/form-data' };
      let bodyFormData = new FormData();

      bodyFormData.set( "api", "1" );
      bodyFormData.set( "Screen", "MYREG" );
      bodyFormData.set( "Action", "MYREG" );
      bodyFormData.set( "Store_Code", "FF" );
      bodyFormData.set( "reg_update_all", "1" );
      bodyFormData.set( "reg_add2bask", "1" );
      bodyFormData.set( "Registry:search", "" );
      //bodyFormData.set( "qty[31701]", "133" );

      bodyFormData.set( `qty[${item.lineID}]`, item.quantity );
      bodyFormData.set( `add[${item.lineID}]`, "1" );

      bodyFormData.set( "FixAttributes", "1" );
      //bodyFormData.set( `qty[${item.lineID}]`, item.quantity );

      dispatch(messagesActions.clearMessages());
      const response = await axios.post( `https://${globalConfig.apiDomain}/mm5/merchant.mvc`, bodyFormData, {
         headers: headers,
         withCredentials: true
      });
      console.log("response",response);
      if ( response.status ) {
         let messages = parseMessages(response.data,dispatch,messagesActions);
         if (
            !messages.errorMessages.length &&
            !messages.informationMessages.length &&
            response.data.status === "1"
         ) {
            console.log("all good");

            // ok now let's remove the item from the saved cart
            handleRemoveItem(item.lineID);
         }
      }
   },[
      dispatch,
      globalConfig.apiDomain,
      handleRemoveItem
   ]);

   return (
      <Fragment>
         {
            st_isLoggedIn === null ? (
               <Stack>
                  <Box>Checking Login...</Box>
                  <Skeleton height='20px' />
                  <Skeleton height='20px' />
                  <Skeleton height='20px' />
               </Stack>
            ) : (
               !st_isLoggedIn ? (
                  <Fragment>
                     <Heading as='h2' size='lg'  className="darkBlue">
                        Log in to View Your Saved Basket
                     </Heading>
                     <Login
                        returnPath="/SavedBasket"
                        onLogin={handleLogin}
                     />
                  </Fragment>
               ) : (
                  ( !(state_basketItems && state_basketItems.length) ) ? (
                     state_basketLoading ? (
                        <Stack>
                           <Box>Loading your saved basket...</Box>
                           <Skeleton height='20px' />
                           <Skeleton height='20px' />
                           <Skeleton height='20px' />
                        </Stack>
                     ) : (
                        <Alert status='info' style={{marginTop: "30px"}}>
                           <AlertIcon />
                           Your saved basket is currently empty.
                        </Alert>
                     )
                  ) : (
                     <Fragment>
                        <Container maxW="100%">
                           <Alert style={{marginBottom:"10px"}} status='info'>
                              <AlertIcon />
                              <b>Welcome to Your Saved Item List</b>
                           </Alert>
                           <Table className={styles.basketTable}>
                              <Thead>
                                 <Tr>
                                    <Th className={styles.thumbColumn}>&nbsp;</Th>
                                    <Th className={styles.nameColumn}>Name</Th>
                                    <Th className={styles.qtyColumn}>Quantity</Th>
                                    <Th className={styles.editColumn}>Date Added</Th>
                                    <Th className={styles.editColumn}>Move To Cart</Th>
                                    <Th className={styles.editColumn}>Remove</Th>
                                 </Tr>
                              </Thead>
                              <Tbody>
                                 {
                                    state_basketItems.map( item => {
                                       return (
                                          <ItemRow
                                             columns={["thumb","name","quantity","dateAdded","moveToCart","remove"]}
                                             key={item.lineID}
                                             item={item}
                                             domain={globalConfig.domain}
                                             editable={false}
                                             apiEndpoint={globalConfig.apiEndpoint}
                                             basketID={false}
                                             onQuantityChange={handleQuantityChange}
                                             onRemoveItem={handleRemoveItem}
                                             quantityIsValid={quantityIsValid}
                                             isSavedBasketItem={true}
                                             onMoveToBasket={handleMoveToBasket}
                                             collapse={item.collapse}
                                          />
                                       )
                                    })
                                 }
                              </Tbody>
                           </Table>
                        </Container>
                     </Fragment>
                  )
               )
            )
         }
      </Fragment>
   );
};

export default SavedBasket;