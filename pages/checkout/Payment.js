import { Fragment,useState,useEffect,useRef } from "react";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { FaAngleDoubleDown,FaCcVisa,FaCcMastercard,FaCcPaypal,FaCcDiscover,FaCcAmex,FaCcAmazonPay } from 'react-icons/fa';
import { motion,AnimatePresence,useAnimation } from "framer-motion";
import InnerHTML from 'dangerously-set-html-content';
import {
   Box,
   Button,
   Grid,
   GridItem,
   Table,
   Thead,
   Tbody,
   Tr,
   Th,
   Td,
   Input,
   Select
} from "@chakra-ui/react";

const store = require('store'); // https://github.com/marcuswestin/store.js, for full localStorage support
const cardValidator = require("card-validator"); // https://github.com/braintree/card-validator
const creditCardType = require("credit-card-type"); // https://github.com/braintree/credit-card-type

import ItemRow from "../../components/Basket/ItemRow";
import Footer from "../../components/Basket/Footer";
import Field from "../../components/Checkout/Field";
import Pay from "../../components/Checkout/Pay";

import {formatPrice,parseMessages} from "../../utilities";
import {messagesActions} from "../../store/slices/messages";

import baskStyles from "../../styles/basket.module.scss";
import checkoutStyles from "../../styles/checkout.module.scss";

const Payment = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   const [state_basketItems,setState_basketItems] = useState(null);
   const [state_basketSubtotal,setState_basketSubtotal] = useState(0);
   const [state_basketTotals,setState_basketTotals] = useState(null);
   const [state_shipping,setState_shipping] = useState(null);
   const [state_orderSummaryView,setState_orderSummaryView] = useState("collapsed");
   const [state_opay,setState_opay] = useState(false);
   const [state_paymentFieldValues,setState_paymentFieldValues] = useState({});
   const [state_cardIcon,setState_cardIcon] = useState(false);
   const [state_paymentMethod,setState_paymentMethod] = useState(false);
   const [state_errorMessages,setState_errorMessages] = useState([]);

   let cardFieldRef = useRef();
   const dispatch = useDispatch();

   // clear any existing error messages
   useEffect(()=>{
      dispatch(messagesActions.setErrorMessages([]));
      return ()=>{dispatch(messagesActions.setErrorMessages([]));}
   },[dispatch]);

   let {setNavVisibility} = props;
   useEffect(()=>{
      let getPaymentScreen = () => {
         const opay = store.get("opay");
         //store.remove("opay");
         //console.log("asdf",asdf);
         if ( !opay ) {
            // that's weird.
         } else {
            console.log("opay",opay);
            setState_basketItems( opay.basketItems );
            setState_opay(opay);
            setState_basketTotals({
               merchSubtotal: opay.basketSubtotal,
               charges: opay.basketCharges,
               total: opay.basketTotal
            });

            let shippingMethod = false;
            opay.basketCharges.forEach(charge=>{
               if ( charge.descrip.substr( 0,8 ) === "Shipping" ) {
                  shippingMethod = {
                     descrip: charge.descrip.split(":")[1].trim(),
                     amount: charge.amount
                  }
               }
            });
            setState_shipping({
               billingAddress: opay.customer.billingAddress,
               shippingAddress: opay.customer.shippingAddress,
               method: shippingMethod
            });

            if ( opay.payment.PaymentMethod.substr(0,7) === "authnet" ) {
               setState_paymentMethod( "authorize" );
            }
         }
      }; // getPaymentScreen
      setNavVisibility(false);
      getPaymentScreen();

      return ()=>{
         //store.remove("opay");
      }
   },[setNavVisibility]);

   useEffect(()=>{
      console.log("state_shipping",state_shipping);
   },[state_shipping]);

   const orderSummaryControls = useAnimation();

   const authorizeServer = "production"; // production or sandbox

   let renderAddress = () => {
      return (
         <fieldset className={checkoutStyles.fieldset}>
            <legend>Billing and Shipping Summary</legend>
            <Grid
               templateColumns="repeat(2, 1fr)"
               gap={2}
               className={checkoutStyles.additionalInfo}
            >
               <GridItem colSpan={[2,2,1]}>
                  <b>Billing Address:</b><br />
                  {
                     state_shipping && state_shipping.billingAddress ?
                        <Box className={checkoutStyles.addressSummary}>
                           {state_shipping.billingAddress.firstName} {state_shipping.billingAddress.lastName}<br />
                           {state_shipping.billingAddress.address1}<br />
                           {state_shipping.billingAddress.address2 && <Fragment>{state_shipping.billingAddress.address2}<br /></Fragment>}
                           {state_shipping.billingAddress.city}, {state_shipping.billingAddress.state}, {state_shipping.billingAddress.zip}, {state_shipping.billingAddress.country}<br />
                           {state_shipping.billingAddress.emailAddress}<br />
                           {state_shipping.billingAddress.company && <Fragment>{state_shipping.billingAddress.company}</Fragment>}
                        </Box>
                     : ""
                  }
               </GridItem>
               <GridItem colSpan={[2,2,1]}>
                  <b>Shipping Address:</b><br />
                  {
                     state_shipping && state_shipping.shippingAddress ?
                        <Box className={checkoutStyles.addressSummary}>
                           {state_shipping.shippingAddress.firstName} {state_shipping.shippingAddress.lastName}<br />
                           {state_shipping.shippingAddress.address1}<br />
                           {state_shipping.shippingAddress.address2 && <Fragment>{state_shipping.shippingAddress.address2}<br /></Fragment>}
                           {state_shipping.shippingAddress.city}, {state_shipping.shippingAddress.state}, {state_shipping.shippingAddress.zip}, {state_shipping.shippingAddress.country}<br />
                           {state_shipping.shippingAddress.emailAddress}<br />
                           {state_shipping.shippingAddress.company && <Fragment>{state_shipping.shippingAddress.company}</Fragment>}
                        </Box>
                     : ""
                  }
               </GridItem>
               <GridItem colSpan={2}>
                  <b>Shipping Method: </b>
                  {
                     state_shipping && state_shipping.method ? (
                        <Fragment>
                           {state_shipping.method.descrip}
                        </Fragment>
                     )
                     : ""
                  }
               </GridItem>
            </Grid>
         </fieldset>
      );
   }; // renderAddress

   let renderBasket = () => {
      let className = `${checkoutStyles.fieldset} ${checkoutStyles.orderSummary}`;
      if ( state_orderSummaryView === "collapsed" ) {
         className = `${className} ${checkoutStyles.collapsed}`;
      }

      let variants = {
         open: { height: "auto", paddingBottom: "3px", overflowY:"hidden",overflowX:"hidden" },
         collapsed: { height: "220px", paddingBottom: "3px", overflowY:"scroll",overflowX:"hidden" }
      };
      let transition = { duration: 1 };

      return (
         <motion.fieldset
            className={className}
            variants={variants}
            transition={transition}
            initial="collapsed"
            exit="open"
            animate={orderSummaryControls}
            onAnimationComplete={()=>{}}
         >
            <legend>Order Summary</legend>
            <Table className={baskStyles.basketTable}>
               <Thead>
                  <Tr>
                     <Th className={baskStyles.thumbColumn}>&nbsp;</Th>
                     <Th className={baskStyles.nameColumn}>Name</Th>
                     <Th className={baskStyles.priceColumn}>Price</Th>
                     <Th className={baskStyles.qtyColumn}>Quantity</Th>
                     <Th className={baskStyles.totalColumn}>Total</Th>
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
                              editable={false}
                           />
                        )
                     })
                  }
               </Tbody>
            </Table>
            {
               state_orderSummaryView === "collapsed" && (
                  <Box
                     className={checkoutStyles.expand}
                     onClick={()=>{orderSummaryControls.start("open");setState_orderSummaryView("expanded");}}
                  >
                     <span className="darkBlue">
                        <FaAngleDoubleDown />
                        Expand
                        <FaAngleDoubleDown />
                     </span>
                  </Box>
               )
            }
         </motion.fieldset>
      );
   }; // renderBasket

   let renderTotals = () => {
      return (
         <fieldset className={checkoutStyles.fieldset}>
            <legend>Order Total</legend>
            {
               state_basketTotals && (
                  <Grid
                     templateColumns="repeat(8, 1fr)"
                     gap="5px"
                     className={checkoutStyles.orderTotals}
                  >
                     <GridItem colSpan={6} className={checkoutStyles.chargeDescrip}>Merchandise Subtotal:</GridItem>
                     <GridItem colSpan={2}>{formatPrice(state_basketTotals.merchSubtotal)}</GridItem>

                     {
                        state_basketTotals.charges.map(charge=>{
                           charge.descrip = charge.descrip.replace( "Shipping:", "Shipping & Handling:" );
                           return (
                              <Fragment key={`${charge.descrip}`}>
                                 <GridItem colSpan={6} className={checkoutStyles.chargeDescrip}><i>{charge.descrip}:</i></GridItem>
                                 <GridItem colSpan={2}>{formatPrice(charge.amount)}</GridItem>
                              </Fragment>
                           )
                        })
                     }

                     <GridItem colSpan={6} className={checkoutStyles.chargeDescrip}>Total:</GridItem>
                     <GridItem colSpan={2}>{formatPrice(state_basketTotals.total)}</GridItem>
                  </Grid>
               )
            }
         </fieldset>
      );
   }; // renderTotals

   // see https://stackoverflow.com/a/53069683/1042398
   let getFormattedCCNumber = (number,type) => {
      let blocks = [];

      number = number.replace( / /g, "" );

      // all support card types have a 4 digit firt block
      blocks.push( number.substring(0, 4) );

      switch( type ) {
      case "American Express":
         if ( number.length > 4 ) {
            blocks.push( number.substring(4, 10) );
            if ( number.length > 10 ) {
               blocks.push( number.substring(10, 15) );
            }
         }
         break;
      case "Visa":
      case "Master Card":
      case "MasterCard":
      case "Discover":
      default:
         if ( number.length > 4 ) {
            blocks.push( number.substring(4, 8) );
            if ( number.length > 8 ) {
               blocks.push( number.substring(8, 12) );
               if ( number.length > 12 ) {
                  blocks.push( number.substring(12, 16) );
               }
            }
         }
         break;
      }

      return blocks.join(" ");
   }; // getFormattedCCNumber

   let updatePaymentFieldValue = (event,fieldName,value=false) => {
      console.log("fieldName",fieldName);
      if ( !value ) {
         if ( event && event.target ) {
            console.log("event",event);
            value = event.target.value;
         }
      } else {
         // yay
      }

      if ( fieldName === "AuthorizeNet_Card_Num" ) {
         value = value.trim();
         if ( value.length >= 4 ) {
            console.log("cardFieldRef",cardFieldRef);
            let cardValidation = cardValidator.number(value);
            if ( !cardValidation.isPotentiallyValid ) {
               console.log("invalid card");
            } else {
               console.log("valid card");

            	let cardType = creditCardType( value );
               console.log("cardType",cardType);

               // FaCcVisa,FaCcMastercard,FaCcPaypal,FaCcDiscover,FaCcAmex,FaCcAmazonPay
               switch( cardType[0].type ) {
               case "visa":
                  setState_cardIcon( <FaCcVisa className={checkoutStyles.cardIcon} /> );
                  break;
               }

               // let formattedNumber = getFormattedCCNumber( value, cardType[0].niceType );
               // console.log("formattedNumber",formattedNumber);
               // value = formattedNumber;

               //cardInputField_restrictedInput.setPattern( cardPatterns[cardType] );

               console.log("cardFieldRef.current.value",cardFieldRef.current.value);
               value = cardFieldRef.current.value;
            }
         }

      }

      setState_paymentFieldValues(prevState=>{
         console.log("prevState",prevState);
         prevState[fieldName] = value;
         console.log("returning prevState",prevState);
         return {...prevState};
      });
   }; // updatePaymentFieldValue

   let renderPlaceOrder = () => {
      return (
         <fieldset className={`darkBlue ${checkoutStyles.fieldset} ${checkoutStyles.placeOrder}`}>
            Please make sure you have fully reviewed your order. Clicking Place Order will finalize your transaction.
            <Button
               width="100%"
               size="lg"
               colorScheme="blue"
               onClick={placeOrder}
            >
               Place Order
            </Button>
            (order processing may take 30 - 60 seconds)
         </fieldset>
      );
   }; // renderPlaceOrder

   let authorize = async () => {

   }

   let placeOrder = async () => {
      console.log("placeOrder called, state_paymentMethod:",state_paymentMethod);
      if ( state_paymentMethod === "authorize" ) {
         let authData = {
            clientKey: globalConfig.authorize[authorizeServer].publicKey,
            apiLoginID: globalConfig.authorize[authorizeServer].loginID
         };
         let cardData = {
            cardNumber: state_paymentFieldValues["AuthorizeNet_Card_Num"].replace( / /g, "" ),
            month: state_paymentFieldValues["AuthorizeNet_CardExp_Month"],
            year: state_paymentFieldValues["AuthorizeNet_CardExp_Year"],
            cardCode: state_paymentFieldValues["AuthorizeNet_Cvv"]
         };
         let secureData = {
            authData: authData,
            cardData: cardData
         };
         console.log("dispatching authorize");
         Accept.dispatchData(secureData, response=>{
            console.log("response received",response);
            if ( response.opaqueData ) {
               submitForm({
                  authorize: response.opaqueData
               });
            }
         });
      }
   }; // placeOrder

   let submitForm = async (options) => {
      dispatch(messagesActions.setErrorMessages([]));
      console.log("submitForm",state_opay);
      // shippingCharges=26.03&taxCharges=34.69&Action=AUTH&Screen=INVC&Store_Code=FF&PaymentMethod=authnet%3AVisa&AuthorizeNet_Method_Type=CC&AuthorizeNet_Data_Descriptor=&AuthorizeNet_Data_Value=&PaymentAuthorizationToken=ea4589530f2943eedeb7cd100e135a57&AuthorizeNet_First_Name=&AuthorizeNet_Last_Name=Willis&AuthorizeNet_Card_Num=4111%201111%201111%201111&AuthorizeNet_CardExp_Month=&AuthorizeNet_CardExp_Year=&AuthorizeNet_Cvv=&question1=&question2=TEST&question3=&question4=1&question5=Yes&maxquestions=5

      let paymentAuthToken = getPaymentAuthToken( state_opay.payment.html );

      const headers = { 'Content-Type': 'multipart/form-data' };
      let bodyFormData = new FormData();
      bodyFormData.set( "Action", "AUTH" );
      bodyFormData.set( "Store_Code", "FF" );
      bodyFormData.set( "Screen", "api_invc" );
      bodyFormData.set( "question1", "aaa" );
      bodyFormData.set( "question2", "aaa" );
      bodyFormData.set( "question3", "aaa" );
      bodyFormData.set( "question4", "aaa" );
      bodyFormData.set( "question5", "aaa" );
      bodyFormData.set( "maxquestions", "5" );
      bodyFormData.set( "PaymentAuthorizationToken", paymentAuthToken );

      if ( state_paymentMethod === "authorize" ) {
         bodyFormData.set( "PaymentMethod", "authnet:Visa" );
         bodyFormData.set( "AuthorizeNet_Method_Type", "CC" );
         bodyFormData.set( "AuthorizeNet_Data_Descriptor", options.authorize.dataDescriptor );
         bodyFormData.set( "AuthorizeNet_Data_Value", options.authorize.dataValue );
         bodyFormData.set( "AuthorizeNet_First_Name", state_paymentFieldValues["AuthorizeNet_First_Name"] );
         bodyFormData.set( "AuthorizeNet_Last_Name", state_paymentFieldValues["AuthorizeNet_Last_Name"] );
      }
      // Object.keys(state_paymentFieldValues).forEach(key => {
      //    if ( key === "AuthorizeNet_Card_Num" ) {
      //       bodyFormData.set( key, state_paymentFieldValues[key].replace( / /g, "" ) );
      //    } else {
      //       bodyFormData.set( key, state_paymentFieldValues[key] );
      //    }
      //
      // });

      // console.log("bodyFormData",bodyFormData.values());
      // console.log("bodyFormData",bodyFormData.entries());
      // console.log("bodyFormData",Array.from(bodyFormData.entries()));

      dispatch(messagesActions.clearMessages());
      const response = await axios.post( `https://${globalConfig.domain}/mm5/merchant.mvc`, bodyFormData, {
         headers: headers,
         withCredentials: true
      });
      if ( response.status ) {
         parseMessages(response.data,dispatch,messagesActions);
         console.log("response.data",response.data);
         //messagesActions.setErrorMessages

         if ( response.data.errorMessages.length ) {
            // that's not good
            console.log("dispatching setErrorMessages");
            store.set( 'opay', response.data );
            setState_opay( response.data );
         }

      }
   }; // submitForm

   let getPaymentAuthToken = blurb => {
      let token = blurb.split("PaymentAuthorizationToken\" value=\"")[1];
      token = token.split("\"")[0];
      return token;
   }; // getPaymentAuthToken

   return (
      <Box
         width={["95%","90%","80%"]}
         marginLeft="auto"
         marginRight="auto"
         marginTop="10px"
      >
         {renderAddress()}
         {state_basketItems && renderBasket()}
         {renderTotals()}

         <Pay
            opay={state_opay}
            paymentMethod={state_paymentMethod}
            paymentFieldValues={state_paymentFieldValues}
            updatePaymentFieldValue={updatePaymentFieldValue}
            cardIcon={state_cardIcon}
            cardFieldRef={cardFieldRef}
            authorizeServer={authorizeServer}
         />

         {renderPlaceOrder()}
      </Box>
   );
};

export default Payment;