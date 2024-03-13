import {useState,useEffect} from "react";
import { useSelector,useDispatch } from "react-redux";
import { useRouter } from 'next/router';
import axios from "axios";
import {
   Center,
   Box,
   Heading,
   AlertIcon,
   Alert,
   Button,
   Icon,
   Grid,
   GridItem,
   UnorderedList,
   ListItem,
   Skeleton,
   Stack
} from '@chakra-ui/react';

const store = require('store'); // https://github.com/marcuswestin/store.js, for full localStorage support

import BasketTable from "../../components/Basket/BasketTable";
import Charges from "../../components/Basket/Charges";
import {messagesActions} from "../../store/slices/messages";
import {openMiscModal,parseMessages} from "../../utilities";

import checkoutStyles from "../../styles/checkout.module.scss";

const Invoice = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   const [st_order,sst_order] = useState(false);

   const router = useRouter();
   const dispatch = useDispatch();

   useEffect(()=>{
      const email = store.get("email");
      const zip = store.get("zip");
      if ( !email || !zip || !router.query.orderID ) {
         // well that's weird
         console.log("not set");
      } else {
         // ok we have everything we need, let's display the order data
         console.log("router.query",router.query);
         let fetchOrderDetails = async () => {
            event.preventDefault();
            console.log("fetching order details");

            const headers = { 'Content-Type': 'multipart/form-data' };
            let bodyFormData = new FormData();

            bodyFormData.set( "orderID", router.query.orderID );
            bodyFormData.set( "email", email );
            bodyFormData.set( "zip", zip );

            dispatch(messagesActions.clearMessages());

            const response = await axios.post( `${globalConfig.apiEndpoint}&cAction=getOrder`, bodyFormData, {
               headers: headers,
               withCredentials: true
            });

            sst_order(false);

            if ( response.status ) {
               console.log("response.data",response.data);
               response.data.orderDetails.items.shift(); // remove {"a":"1"}
               response.data.orderDetails.charges.shift(); // remove {"a":"1"}

               let items = response.data.orderDetails.items.map(item=>{
                  if ( item.volPrices !== "none" ) {
                     item.volPrices.shift(); // remove {"a":"1"}
                  }
                  if ( item.options !== "false" ) {
                     item.options.shift(); // remove {"a":"1"}
                  }
                  return {
                     ...item,
                     quantityIsValid:true // the quantity is always valid for an order, no need to check and test
                  }
               });

               let orderDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
               orderDate.setUTCSeconds(response.data.orderDetails.date);

               console.log("items",items);

               sst_order({
                  date: orderDate,
                  items: items,
                  charges: response.data.orderDetails.charges,
                  shippingAddress: response.data.orderDetails.shippingAddress,
                  billingAddress: response.data.orderDetails.billingAddress
               });
            }
         }; // fetchOrderDetails

         fetchOrderDetails();

      }

      /* 2022-04-05: uncomment this for production, we want the opay data
      * cleared after first page load here.
      */
      //store.remove("opay");
   },[router,dispatch]);

   return (
      <Box>
         {
            !st_order ? (
               <Stack>
                  <Skeleton height='20px' />
                  <Skeleton height='20px' />
                  <Skeleton height='20px' />
               </Stack>
            ) : (
               <Box>
                  <fieldset className={checkoutStyles.fieldset}>
                     <legend>Order Placed</legend>
                     <UnorderedList>
                        <ListItem><b>Order #:</b> {router.query.orderID}</ListItem>
                        <ListItem><b>Order Date:</b> {st_order.date.getMonth() + 1}/{st_order.date.getDate()}/{st_order.date.getFullYear()} {st_order.date.getHours()}:{st_order.date.getMinutes()} (America/New York)</ListItem>
                     </UnorderedList>
                  </fieldset>
                  <fieldset className={checkoutStyles.fieldset}>
                     <legend>Details</legend>
                     <Grid templateColumns='repeat(2, 1fr)' gap={6}>
                        <GridItem w='100%'>
                           <b>Shipping Address:</b><br />
                           {st_order.shippingAddress.firstName}{" "}{st_order.shippingAddress.lastName}<br />
                           {st_order.shippingAddress.address1}<br />
                           {st_order.shippingAddress.city}{" "}{st_order.shippingAddress.state},{" "}{st_order.shippingAddress.zip}{" "}{st_order.shippingAddress.country}<br />
                           {st_order.shippingAddress.phoneNumber}<br />
                           {st_order.shippingAddress.emailAddress}<br />
                        </GridItem>
                        <GridItem w='100%'>
                           <b>Billing Address:</b><br />
                           {st_order.billingAddress.firstName}{" "}{st_order.billingAddress.lastName}<br />
                           {st_order.billingAddress.address1}<br />
                           {st_order.billingAddress.city}{" "}{st_order.billingAddress.state},{" "}{st_order.billingAddress.zip}{" "}{st_order.billingAddress.country}<br />
                           {st_order.billingAddress.phoneNumber}<br />
                           {st_order.billingAddress.emailAddress}<br />
                        </GridItem>
                     </Grid>
                     <BasketTable
                        items={st_order.items}
                        viewType="orderStatus"
                     />
                     <Charges
                        viewType="summary"
                        basketCharges={st_order.charges}
                        items={st_order.items}
                     />
                  </fieldset>
               </Box>
            )
         }
      </Box>
   );
};

export default Invoice;