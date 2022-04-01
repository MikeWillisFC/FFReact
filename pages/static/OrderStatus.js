import {Fragment,useState,useEffect,useCallback} from "react";
import { useSelector,useDispatch } from "react-redux";
import Head from 'next/head';
import axios from "axios";
import DataTable from 'react-data-table-component';
import { FaExternalLinkAlt } from 'react-icons/fa';
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
} from '@chakra-ui/react';

import BasketTable from "../../components/Basket/BasketTable";
import Charges from "../../components/Basket/Charges";
import TextInput from "../../components/FormFields/TextInput";
import {messagesActions} from "../../store/slices/messages";
import {openMiscModal,parseMessages} from "../../utilities";

import checkoutStyles from "../../styles/checkout.module.scss";

let fields = [
   {
      label:"Billing Email Address:",
      name:"Order_BillEmail",
      isRequired:true,
      type:"email"
   },
   {
      label:"Billing Zip Code:",
      name:"Order_BillZip",
      isRequired:true
   }
];

let renderTrackingLink = shipment => {
   return (
      <a
         target="_blank"
         rel="noreferrer"
         href={shipment.link}
      >
         {shipment.number}
         {" "}
         <Icon as={FaExternalLinkAlt} boxSize=".8em" />
      </a>
   );
};

const OrderStatus = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   let {
      miscModalDisclosure,
      setMiscModal
   } = props;

   const dispatch = useDispatch();

   const [st_fields,sst_fields] = useState(fields);
   const [st_submitting,sst_submitting] = useState(false);
   const [st_allValid,sst_allValid] = useState(false);
   const [st_rows,sst_rows] = useState([]);
   const [st_fetchingDetails,sst_fetchingDetails] = useState(false);
   const [st_basketItems,sst_basketItems] = useState(false);

   let handleChange = useCallback((changedField,value) => {
      //console.log("handleChange called for changedField:",changedField);
      sst_fields(prevFields=>{
         return prevFields.map(field=>{
            //console.log("checking field",field);
            if ( field.name === changedField ) {
               //console.log("match");
               field.value = value;
               field.reset = false;
            }
            //console.log("returning field",field);
            return field;
         });
      });
   },[]) // handleChange

   let sendValidity = useCallback((changedField,isInvalid) => {
      let allValid = true;
      st_fields.forEach(field=>{
         if (
            allValid &&
            (field.isRequired && !field.value) ||
            (
               field.name === changedField &&
               isInvalid
            )
         ) {
            allValid = false;
         }
         return field;
      });
      sst_allValid(allValid);
   },[st_fields]);

   let clearForm = useCallback(() => {
      sst_fields(prevFields=>{
         return prevFields.map(field=>{
            field.reset = true;
            return field;
         });
      });
      sst_allValid(false);
   },[]) // clearForm

   let handleSubmit = useCallback(async (event) => {
      event.preventDefault();
      sst_submitting(true);
      sst_rows([]);
      const headers = { 'Content-Type': 'multipart/form-data' };
      let bodyFormData = new FormData();

      bodyFormData.set( "Order_BillEmail", event.target.elements["Order_BillEmail"].value );
      bodyFormData.set( "Order_BillZip", event.target.elements["Order_BillZip"].value );

      dispatch(messagesActions.clearMessages());

      const response = await axios.post( `${globalConfig.apiEndpoint}&cAction=orderHistory`, bodyFormData, {
         headers: headers,
         withCredentials: true
      });

      sst_submitting(false);

      if ( response.status ) {
         if ( !response.data.orderHistory ) {
            dispatch(messagesActions.setErrorMessages({
               title:"Error",
               messages: [`We're sorry, there has been an error submitting your form. Please try again. If the problem persists please call us at ${globalConfig.phoneNumber}.`]
            }));
         } else {
            console.log("response.data",response.data);
            response.data.orderHistory.shift(); // remove {"a":"1"}
            sst_rows(response.data.orderHistory.map(order=>{
               order.shipments.shift();  // remove {"a":"1"}
               return order;
            }));
            clearForm();
         }
      }
   },[
      dispatch,
      globalConfig.apiEndpoint,
      globalConfig.phoneNumber,
      clearForm
   ]);

   let fetchOrderDetails = useCallback( async (event,row) => {
      event.preventDefault();
      console.log("fetching order details");

      sst_fetchingDetails(true);
      const headers = { 'Content-Type': 'multipart/form-data' };
      let bodyFormData = new FormData();

      bodyFormData.set( "orderID", row.id );
      bodyFormData.set( "email", row.Order_BillEmail );
      bodyFormData.set( "zip", row.Order_BillZip );

      dispatch(messagesActions.clearMessages());

      const response = await axios.post( `${globalConfig.apiEndpoint}&cAction=getOrder`, bodyFormData, {
         headers: headers,
         withCredentials: true
      });

      sst_fetchingDetails(false);
      sst_basketItems(false);

      if ( response.status ) {
         console.log("response.data",response.data);
         response.data.orderDetails.items.shift(); // remove {"a":"1"}
         response.data.orderDetails.shipments.shift(); // remove {"a":"1"}
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

         let shipmentDate = false;
         let orderDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
         orderDate.setUTCSeconds(response.data.orderDetails.date);
         if ( response.data.orderDetails.shipments.length ) {
            // just use the first one
            shipmentDate = new Date(0);
            shipmentDate.setUTCSeconds(response.data.orderDetails.shipments[0].date);
         }
         openMiscModal({
            setModal: setMiscModal,
            disclosure: miscModalDisclosure,
            title: "Order Details",
            size: "5xl",
            minHeight: "500px",
            maxHeight: "80vh",
            content: (
               <Fragment>
                  <fieldset className={checkoutStyles.fieldset}>
                     <legend>Status</legend>
                     <UnorderedList>
                        <ListItem><b>Order #:</b> {row.id}</ListItem>
                        <ListItem><b>Order Date:</b> {orderDate.getMonth() + 1}/{orderDate.getDate()}/{orderDate.getFullYear()} {orderDate.getHours()}:{orderDate.getMinutes()} (America/New York)</ListItem>
                        {
                           shipmentDate ? (
                              <ListItem>
                                 <b>Shipped:</b>
                                 {" "}
                                 {shipmentDate.getMonth() + 1}/{shipmentDate.getDate()}/{shipmentDate.getFullYear()}
                                 {" | "}
                                 Tracking #: {renderTrackingLink(row.shipments[0])}
                              </ListItem>
                           ) : (
                              ""
                           )
                        }
                     </UnorderedList>
                  </fieldset>
                  <fieldset className={checkoutStyles.fieldset}>
                     <legend>Details</legend>
                     <Grid templateColumns='repeat(2, 1fr)' gap={6}>
                        <GridItem w='100%'>
                           <b>Shipping Address:</b><br />
                           {response.data.orderDetails.shippingAddress.firstName}{" "}{response.data.orderDetails.shippingAddress.lastName}<br />
                           {response.data.orderDetails.shippingAddress.address1}<br />
                           {response.data.orderDetails.shippingAddress.city}{" "}{response.data.orderDetails.shippingAddress.state},{" "}{response.data.orderDetails.shippingAddress.zip}{" "}{response.data.orderDetails.shippingAddress.country}<br />
                           {response.data.orderDetails.shippingAddress.phoneNumber}<br />
                           {response.data.orderDetails.shippingAddress.emailAddress}<br />
                        </GridItem>
                        <GridItem w='100%'>
                           <b>Billing Address:</b><br />
                           {response.data.orderDetails.billingAddress.firstName}{" "}{response.data.orderDetails.billingAddress.lastName}<br />
                           {response.data.orderDetails.billingAddress.address1}<br />
                           {response.data.orderDetails.billingAddress.city}{" "}{response.data.orderDetails.billingAddress.state},{" "}{response.data.orderDetails.billingAddress.zip}{" "}{response.data.orderDetails.billingAddress.country}<br />
                           {response.data.orderDetails.billingAddress.phoneNumber}<br />
                           {response.data.orderDetails.billingAddress.emailAddress}<br />
                        </GridItem>
                     </Grid>
                     <BasketTable
                        items={items}
                        viewType="orderStatus"
                     />
                     <Charges
                        viewType="summary"
                        basketCharges={response.data.orderDetails.charges}
                        items={items}
                     />
                  </fieldset>

               </Fragment>

            )
         });
      }

      console.log(response);
   },[
      dispatch,
      globalConfig.apiEndpoint,
      miscModalDisclosure,
      setMiscModal
   ]);

   let columns = [
      {
         name: 'Order Number',
         selector: row=>row.id,
         width:"150px",
         sortable: true,
         sortFunction: (rowA, rowB) => {
            let a = rowA.id !== "" ? parseInt(rowA.id) : 0;
            let b = rowB.id !== "" ? parseInt(rowB.id) : 0;
            if ( a > b ) { return 1; }
            if ( b > a ) { return -1; }
            return 0;
         }
      },
      {
         name: 'Date',
         selector: row=>row.date,
         sortable: true,
         sortFunction: (rowA, rowB) => {
            let getSeconds = value => {
               if ( !value ) {
                  return 999999999999999;
               } else {
                  let val = value.split("/");
                  let date = new Date(`${val[2]}-${val[0]}-${val[1]}T00:00:00.000Z`);
                  return date.getTime() / 1000;
               }
            }; // getSeconds
            let a = getSeconds(rowA.date);
            let b = getSeconds(rowB.date);
            if ( a > b ) { return 1; }
            if ( b > a ) { return -1; }
            return 0;
         }
      },
      {
         name: 'Total',
         selector: row=>row.total,
         sortable: true
      },
      {
         name: 'Status',
         selector: row=>row.status,
         sortable: true
      },
      {
         name: 'Tracking Number',
         selector: row=>row.shipments,
         sortable: true,
         width:"200px",
         cell: row=>{
            if ( row.shipments.length ) {
               return (
                  <Fragment>
                     {renderTrackingLink(row.shipments[0])}
                  </Fragment>
               )
            } else {
               return "";
            }
         }
      },
      {
         name: 'Details',
         selector: row=>row.total,
         sortable: false,
         cell: row=>{
            /* 2022-04-01: if you get rid of this if true, you get an error during build:
            *
            * ./pages/static/OrderStatus.js
            * 351:16  Error: Component definition is missing display name  react/display-name
            *
            * I have no idea why.
            */
            if ( true ) {
               return (
                  <Button
                     colorScheme='blue'
                     isLoading={st_fetchingDetails}
                     disabled={st_fetchingDetails}
                     type='submit'
                     margin="2px"
                     onClick={event=>fetchOrderDetails(event,row)}
                  >
                     View
                  </Button>
               )
            }
         }
      },
   ];

   return (
      <Box>
         <Head>
            <title>Check your Order Status</title>
            <meta name="robots" content="noodp, noydir" />
         </Head>

         <Heading as='h2' size='lg'  className="darkBlue">
            Check your Order Status
         </Heading>

         {
            globalConfig.phonesDown && (
               <Alert status='warning' style={{padding:"2px"}}>
                  <AlertIcon />
                  We are experiencing technical problems with our phone system, for now it is best to use the contact form to get in touch with us and we will respond as soon as possible. We hope to have this problem solved shortly, and we apologize for the inconvenience.
               </Alert>
            )
         }

         <Center>
            <Box width={["95%","95%","80%"]}>
               <form
                  method="post"
                  onSubmit={handleSubmit}
                  style={{paddingBottom:"10px",marginBottom:"10px",borderBottom:"1px solid #ccc"}}
               >
                  {
                     st_fields.map(field=>{
                        return (
                           <TextInput
                              key={field.name}
                              label={field.label}
                              name={field.name}
                              isRequired={field.isRequired}
                              type={field.type || null}
                              onChange={handleChange}
                              reset={field.reset}
                              sendValidity={sendValidity}
                           />
                        );
                     })
                  }
                  <Button
                     marginTop="5px"
                     colorScheme='blue'
                     isLoading={st_submitting}
                     type='submit'
                     disabled={!st_allValid || st_submitting}
                  >
                     Submit
                  </Button>
               </form>
            </Box>
         </Center>
         {
            st_rows.length ? (
               <Fragment>
                  <Heading as="h2" size="md">
                     Your Order List
                  </Heading>
                  <DataTable
                     data={st_rows}
                     columns={columns}
                     selectableRows={false}

                     defaultSortFieldId={0}
                     defaultSortAsc={false}

                     pagination={true}

                     highlightOnHover={true}
                     striped={true}
                     dense={true}
                     persistTableHead={false}
                     responsive={true}
                  />
               </Fragment>

            ) : ""
         }
      </Box>
   );
};

export default OrderStatus;