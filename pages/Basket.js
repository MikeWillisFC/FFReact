import { Fragment,useState,useEffect,useCallback } from "react";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import {useRouter} from 'next/router';
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
   AlertDescription,
   Divider,
   Button,
   Drawer,
   DrawerBody,
   DrawerHeader,
   DrawerOverlay,
   DrawerContent,
   DrawerCloseButton,

   useDisclosure
} from "@chakra-ui/react";

import BasketTable from "../components/Basket/BasketTable";
import ItemRow from "../components/Basket/ItemRow";
import Footer from "../components/Basket/Footer";
import LoginOrCreate from "../components/LoginOrCreate";
import {messagesActions} from "../store/slices/messages";
import {globalActions} from "../store/slices/global";
import {quantityIsValid,parseMessages,isLoggedIn} from "../utilities";

import styles from "../styles/basket.module.scss";

const Basket = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   const dispatch = useDispatch();
   const router = useRouter();
   const drawerDisclosure = useDisclosure();

   const [st_drawer,sst_drawer] = useState({header:"",body:""});
   const [st_isLoggedIn,sst_isLoggedIn] = useState(globalConfig.isLoggedIn);
   const [st_showLoginOrCreate,sst_showLoginOrCreate] = useState({show:false});
   const [state_basketItems,setState_basketItems] = useState(null);
   const [state_basketSubtotal,setState_basketSubtotal] = useState(0);
   const [state_basketCharges,setState_basketCharges] = useState(null);
   const [state_basketID,setState_basketID] = useState(null);
   const [state_basketLoading,setState_basketLoading] = useState(false);
   const [state_itemValidities,setState_itemValidities] = useState([]);
   const [state_singleSupplier,setState_singleSupplier] = useState("");

   let {setNavVisibility} = props;

   let getBasketCharges = useCallback(async ()=>{
      let response = await axios.get(`${globalConfig.apiEndpoint}&cAction=getBasketCharges&action=factnitdn&saction=mf_rcmf`,
         {
            withCredentials: true
         }
      );

      console.log("getBasketCharges response",response);
      if ( response.status && response.data.basketCharges ) {
         setState_basketCharges( response.data.basketCharges );
      }
   },[
      globalConfig.apiEndpoint
   ]);

   useEffect(()=>{
      let getBasket = async () => {
         setState_basketLoading(true);
         dispatch(messagesActions.clearMessages());
         // factnitdn = fake action ignore this do nothing
         let response = await axios.get(`${globalConfig.apiEndpoint}&cAction=getBASK`,
            {
               withCredentials: true
            }
         );
         console.log("getBasket response",response);
         if ( response.status ) {
            parseMessages(response.data,dispatch,messagesActions);
            setState_basketLoading(false);
            setState_basketItems( response.data.basketItems.map(item=>{
               return {
                  ...item,
                  quantityIsValid:quantityIsValid(item)
               }
            }));
            setState_basketID( response.data.basketID );
            setState_singleSupplier( response.data.singleSupplier );
            getBasketCharges();
         }
      };
      setNavVisibility(false);
      getBasket();
   },[
      globalConfig.apiEndpoint,
      setNavVisibility,
      getBasketCharges,
      dispatch
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
         dispatch(messagesActions.clearMessages());
         const response = await axios.post( globalConfig.apiEndpoint, bodyFormData, {
            headers: headers,
            withCredentials: true
         });
         if ( response.status ) {
            parseMessages(response.data,dispatch,messagesActions);
            //console.log("response.data",response.data);
            getBasketCharges();
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
      globalConfig.apiEndpoint,
      state_basketID,
      getBasketCharges,
      dispatch
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
      dispatch(messagesActions.clearMessages());
      const response = await axios.post( globalConfig.apiEndpoint, bodyFormData, {
         headers: headers,
         withCredentials: true
      });
      if ( response.status ) {
         parseMessages(response.data,dispatch,messagesActions);
         getBasketCharges();
         //console.log("response.data",response.data);
      }
   }; // handleRemoveItem

   let checkLogin = async () => {
      let result = await isLoggedIn(globalConfig.apiEndpoint);
      //console.log("isLoggedIn result",result);
      sst_isLoggedIn(result);
      dispatch(globalActions.setLogin(result));
      return result;
   }

   let saveBasket = async () => {
      const headers = { 'Content-Type': 'multipart/form-data' };
      let bodyFormData = new FormData();

      bodyFormData.set( "Screen", "MYREG" );
      bodyFormData.set( "Action", "SAVEBASK" );
      bodyFormData.set( "Remove", "1" );
      bodyFormData.set( "api", "1" );

      //console.log("globalConfig",globalConfig);
      dispatch(messagesActions.clearMessages());
      const response = await axios.post( `https://${globalConfig.apiDomain}/mm5/merchant.mvc`, bodyFormData, {
         headers: headers,
         withCredentials: true
      });
      if ( response.status ) {
         let messages = parseMessages(response.data,dispatch,messagesActions);
         if (
            !messages.errorMessages.length &&
            !messages.informationMessages.length &&
            response.data.status === "1"
         ) {
            router.push({
               pathname: `/SavedBasket`
            });
         }
      }
   }; // saveBasket

   let handleSaveBasket = async (event)=>{
      event.preventDefault();

      /* 2022-02-18: if they're not logged in, we need to show them
      * the create-account modal
      */
      let isLoggedIn = await checkLogin();
      if ( isLoggedIn ) {
         saveBasket();
      } else {
         sst_showLoginOrCreate({
            show: true,
            onComplete: ()=>{
               console.log("it's done homie");
               saveBasket();
            },
            onClose: ()=>{
               sst_showLoginOrCreate({show:false});
            }
         });
      }
   };

   let basketHelp = (event) => {
      event.preventDefault();
      sst_drawer({
         header:"Having trouble checking out?",
         body: (
            <Alert status="info" >
               <AlertIcon />
               <AlertDescription>
                  Call us at <a style={{fontWeight:"bold"}} href="tel:516-986-3285">(516) 986-3285</a>, we&apos;ll be glad to help
               </AlertDescription>
            </Alert>
         )
      });
      drawerDisclosure.onOpen();

      // 2022-02-18: this works but redux doesn't like receiving the react component
      // dispatch(messagesActions.setTitle("Having trouble checking out?"));
      // dispatch(messagesActions.setInformationMessages([<Fragment>Call us toll-free at <b>(516) 986-3285</b>, we'll be glad to help</Fragment>]));
   };

   //console.log("Basket props",props);

   return (
      <Fragment>

         <Drawer
            isOpen={drawerDisclosure.isOpen}
            placement='top'
            onClose={drawerDisclosure.onClose}
            preserveScrollBarGap={true}
         >
            <DrawerOverlay />
            <DrawerContent>
               <DrawerCloseButton />
               <DrawerHeader
                  style={{borderBottom:"1px solid #ccc"}}
               >
                  {st_drawer.header}
               </DrawerHeader>

               <DrawerBody
                  style={{paddingTop:"30px",paddingBottom:"20px"}}
               >
                  {st_drawer.body}
               </DrawerBody>
            </DrawerContent>
         </Drawer>

         {
            st_showLoginOrCreate.show && (
               <LoginOrCreate
                  onComplete={st_showLoginOrCreate.onComplete}
                  onClose={st_showLoginOrCreate.onClose}
                  miscModalDisclosure={props.miscModalDisclosure}
                  setMiscModal={props.setMiscModal}
               />
            )
         }

         {
            state_basketItems && state_basketItems.length ? (
               <Fragment>
                  <Container maxW="100%">
                     <HStack spacing="25px" className={`${styles.basketTools}`}>
                        <Button
                           size="sm"
                           colorScheme='teal'
                           variant='ghost'
                        >
                           <Link href="/SavedBasket">View Your Saved Basket</Link>
                        </Button>
                        <Button
                           size="sm"
                           colorScheme='teal'
                           variant='ghost'
                           onClick={handleSaveBasket}
                        >
                           Save Your Basket
                        </Button>
                        <Button
                           size="sm"
                           colorScheme='teal'
                           variant='ghost'
                           onClick={basketHelp}
                        >
                           Need Help With Your Order?
                        </Button>
                     </HStack>

                     <BasketTable
                        items={state_basketItems}
                        viewType="shoppingCart"
                        
                        basketID={state_basketID}
                        onQuantityChange={handleQuantityChange}
                        onRemoveItem={handleRemoveItem}
                     />

                     {
                        false ? (
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
                                             columns={["thumb","name","price","quantity","total","remove"]}
                                             key={item.lineID}
                                             item={item}
                                             editable={true}
                                             basketID={state_basketID}
                                             onQuantityChange={handleQuantityChange}
                                             onRemoveItem={handleRemoveItem}
                                          />
                                       )
                                    })
                                 }
                              </Tbody>
                           </Table>
                        ) : ""
                     }
                  </Container>

                  <Footer
                     basketCharges={state_basketCharges}
                     subtotal={state_basketSubtotal}
                     items={state_basketItems}
                     miscModalDisclosure={props.miscModalDisclosure}
                     setMiscModal={props.setMiscModal}
                     singleSupplier={state_singleSupplier}
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