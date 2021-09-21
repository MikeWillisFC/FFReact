import {Fragment,useRef,useEffect} from "react";
import {useSelector} from "react-redux";
import _ from "lodash";
import RestrictedInput from "restricted-input"; // https://github.com/braintree/restricted-input
import {
   Grid,
   GridItem,
   Input,
   Select
} from "@chakra-ui/react";

import checkoutStyles from "../../styles/checkout.module.scss";

const cardValidator = require("card-validator"); // https://github.com/braintree/card-validator

import Field from "../../components/Checkout/Field";

import {loadScript} from "../../utilities";

const Pay = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   let authorizeLoaded = useRef();
   let cardInputField_restrictedInput = useRef(false);
   let authorizeScriptID = "authorizeAcceptJS";

   useEffect(()=>{
      let unloadAuthorize = () => {
         //console.log("unloading authorize");
         if ( typeof( Accept ) !== "undefined" ) {
            Accept = null;
         }
         let existing = document.getElementById(authorizeScriptID);
         if ( existing ) {
            existing.remove();
         }
      }; // unloadAuthorize
      unloadAuthorize();
      return ()=>{
         unloadAuthorize();
      }
   },[authorizeScriptID]);

   useEffect(()=>{

      const cardPatterns = {
   		"visa": "{{9999}} {{9999}} {{9999}} {{9999}}",
   		"american-express": "{{9999}} {{999999}} {{99999}}"
   	};
      console.log("props.cardFieldRef.current",props.cardFieldRef.current);
      if ( props.cardFieldRef.current ) {
         cardInputField_restrictedInput.current = new RestrictedInput({
   			element: props.cardFieldRef.current,
   			pattern: cardPatterns.visa
   		});
      }
   },[props.cardFieldRef]);

   let getFieldName = (blurb,double=false) => {
      if ( !double ) {
         let fieldName = blurb.split( "name=\"" )[1];
         fieldName = fieldName.split( "\"" )[0];
         return fieldName;
      } else {
         let splitBlurb = blurb.split( "name=\"" );
         let firstName = splitBlurb[1];
         let secondName = splitBlurb[2];
         firstName = firstName.split( "\"" )[0];
         secondName = secondName.split( "\"" )[0];
         return [firstName,secondName];
      }
   }; // getFieldName

   let renderAuthNet = () => {
      /* 2021-09-16: for whatever reason, attempts to use an ID to make sure we don't
      * accidentally load the script twice are not working. Weird shit happens and you
      * can't even find the script in the DOM after loading the page, even though
      * it loads multiple times due to re-renders. So I'm using a ref to make sure
      * it only loads once.
      */
      if ( !authorizeLoaded.current ) {
         authorizeLoaded.current = true;
         switch( props.authorizeServer ) {
         case "production":
            loadScript("https://js.authorize.net/v1/Accept.js",authorizeScriptID);
            break;
         case "sandbox":
         default:
            loadScript("https://jstest.authorize.net/v1/Accept.js",authorizeScriptID);
            break;
         }
         //loadScript("https://www.favorfavor.com/js/test.js",authorizeScriptID);
      }

      let paymentFields = [
         { code: "cc_fname", name: "AuthorizeNet_First_Name", prompt: "First Name on Card:" },
         { code: "cc_lname", name: "AuthorizeNet_Last_Name", prompt: "Last Name on Card:" },
         { code: "cc_number", name: "AuthorizeNet_Card_Num", prompt: "Card Number:" },
         { code: "cc_exp", name: ["AuthorizeNet_CardExp_Month","AuthorizeNet_CardExp_Year"], prompt: ["Expiration Month:","Expiration Year:"] },
         { code: "cvv", name: "AuthorizeNet_Cvv", prompt: "CVV2:" }
      ];
      return (
         <Fragment>
            {renderPayment_CC(paymentFields)}
         </Fragment>
      );
   }; // renderAuthNet

   let renderPayment_CC = (fields,additional=false) => {
      return (
         <Fragment>
            <Grid
               templateRows="repeat(2, 1fr)"
               //templateColumns="repeat(5, 1fr)"
               gap={2}
               className={checkoutStyles.additionalInfo}
            >
               {
                  fields.map(field=>{
                     let fieldName;
                     switch( field.code ) {
                        case "cc_fname":
                        case "cc_lname":
                           fieldName = field.name ? field.name : getFieldName( field.field );
                           return (
                              <GridItem key={field.code} colSpan={[2,2,1]}>
                                 <Field
                                    type="input"
                                    onFieldChange={(ignoreThis,value)=>{props.updatePaymentFieldValue(ignoreThis,fieldName,value);}}
                                    title={field.prompt.replace(":","")}
                                    required={true}
                                    field={fieldName}
                                    value={(props.paymentFieldValues[fieldName] || "")}
                                 />
                              </GridItem>
                           );
                           break;
                        case "cc_number":
                           fieldName = field.name ? field.name : getFieldName( field.field );
                           return (
                              <GridItem key={field.code} colSpan={2}>
                                 <Field
                                    type="text"
                                    inputMode="numeric"
                                    onFieldChange={(ignoreThis,value)=>{props.updatePaymentFieldValue(ignoreThis,fieldName,value);}}
                                    title={field.prompt.replace(":","")}
                                    required={true}
                                    field={fieldName}
                                    value={(props.paymentFieldValues[fieldName] || "")}
                                    reff={props.cardFieldRef}
                                    cardValidator={cardValidator}
                                    icon={props.cardIcon}
                                 />
                              </GridItem>
                           );
                           break;
                     }
                  })
               }
            </Grid>

            <Grid
               //templateRows="repeat(3, 1fr)"
               templateColumns="repeat(3, 1fr)"
               gap={2}
               className={checkoutStyles.additionalInfo}
            >
               {
                  fields.map(field=>{
                     switch( field.code ) {
                        case "cvv":
                           return renderCVV(field);
                           break;
                        case "cc_exp":
                           return renderExp(field);
                           break;
                     }
                  })
               }
            </Grid>

            {
               //additional && <InnerHTML html={additional} />
            }
         </Fragment>
      );
   }; // renderPayment_CC

   let renderCVV = field => {
      let fieldName = field.name ? field.name : getFieldName( field.field );
      return (
         <GridItem key={field.code} colSpan={[3,3,1]}>
            <Field
               type="number"
               onFieldChange={(ignoreThis,value)=>{props.updatePaymentFieldValue(ignoreThis,fieldName,value);}}
               title={field.prompt.replace(":","")}
               required={true}
               field={fieldName}
               value={(props.paymentFieldValues[fieldName] || "")}
            />
         </GridItem>
      );
   }; // renderCVV

   let renderExp = field => {
      console.log("field",field);
      let [monthName,yearName] = field.name ? field.name : getFieldName( field.field, true );

      let min = new Date().getUTCFullYear();
      let max = min + 25;
      let yearRange = _.range(min, max);
      let monthValues = [
         {code: 1, name: "01"},
         {code: 2, name: "02"},
         {code: 3, name: "03"},
         {code: 4, name: "04"},
         {code: 5, name: "05"},
         {code: 6, name: "06"},
         {code: 7, name: "07"},
         {code: 8, name: "08"},
         {code: 9, name: "09"},
         {code: 10, name: "10"},
         {code: 11, name: "11"},
         {code: 12, name: "12"}
      ];
      let yearValues = yearRange.map(year=>{
         return {code: year, name: year};
      });
      return (
         <Fragment key={field.code}>
            <GridItem colSpan={[3,3,1]}>
               <Field
                  type="select"
                  onFieldChange={(ignoreThis,value)=>{props.updatePaymentFieldValue(ignoreThis,monthName,value);}}
                  title="Expiration Month"
                  required={true}
                  field={monthName}
                  values={monthValues}
                  value={props.paymentFieldValues[monthName] || ""}
               />
            </GridItem>
            <GridItem colSpan={[3,3,1]}>
               <Field
                  type="select"
                  onFieldChange={(ignoreThis,value)=>{props.updatePaymentFieldValue(ignoreThis,yearName,value);}}
                  title="Expiration Year"
                  required={true}
                  field={yearName}
                  values={yearValues}
                  value={props.paymentFieldValues[yearName] || ""}
               />
            </GridItem>
         </Fragment>
      );
   }; // renderExp

   if ( !props.opay ) {
      return "Loading..";
   } else {
      console.log("props.opay",props.opay);
      console.log("props.opay.paymentFieldsLoad", (props.opay.paymentFieldsLoad ? "true": "false"));
      console.log("props.opay.paymentFieldsLoad.data", (props.opay.paymentFieldsLoad.data ? "true": "false"));
      console.log("props.opay.paymentFieldsLoad.success === 1", (props.opay.paymentFieldsLoad.success === 1 ? "true": "false"));
      console.log("props.opay.paymentFieldsLoad.success",props.opay.paymentFieldsLoad.success);
      return (
         <fieldset className={checkoutStyles.fieldset}>
            <legend>Payment</legend>
            <form>
               {
                  props.paymentMethod === "authorize" && renderAuthNet()
               }
            </form>
         </fieldset>
      );
   }
};

export default Pay;