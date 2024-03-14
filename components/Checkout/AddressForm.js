import {useState,useEffect} from "react";
import { Grid,GridItem } from "@chakra-ui/react";

import Field from "./Field";

import styles from "../../styles/checkout.module.scss";

const AddressForm = props => {
   // console.log("AddressForm props",props);
   const [state_valid,setState_valid] = useState(false);

   const [state_fieldValidities_firstName,setState_fieldValidities_firstName] = useState(false);
   const [state_fieldValidities_lastName,setState_fieldValidities_lastName] = useState(false);
   const [state_fieldValidities_address1,setState_fieldValidities_address1] = useState(false);
   const [state_fieldValidities_address2,setState_fieldValidities_address2] = useState(false);
   const [state_fieldValidities_zip,setState_fieldValidities_zip] = useState(false);
   const [state_fieldValidities_state,setState_fieldValidities_state] = useState(false);
   const [state_fieldValidities_city,setState_fieldValidities_city] = useState(false);
   const [state_fieldValidities_country,setState_fieldValidities_country] = useState(false);
   const [state_fieldValidities_phone,setState_fieldValidities_phone] = useState(false);
   const [state_fieldValidities_email,setState_fieldValidities_email] = useState(false);
   const [state_fieldValidities_company,setState_fieldValidities_company] = useState(false);

   const [state_fieldValidities,setState_fieldValidities] = useState({
      firstName: false,
      lastName: false,
      address1: false,
      address2: false,
      zip: false,
      state: false,
      city: false,
      country: false,
      phone: false,
      email: false,
      company: false
   });

   // useEffect(()=>{
   //    if ( false ) {
   //       let valid = true;
   //       Object.keys(state_fieldValidities).forEach(key => {
   //          console.log("checking key",key,state_fieldValidities[key]);
   //          if ( valid && !state_fieldValidities[key] ) {
   //             valid = false;
   //          }
   //       });
   //       console.log("setting state_valid",state_valid);
   //       setState_valid( valid );
   //    }
   // },[
   //    state_fieldValidities.firstName,
   //    state_fieldValidities.lastName,
   //    state_fieldValidities.address1,
   //    state_fieldValidities.address2,
   //    state_fieldValidities.zip,
   //    state_fieldValidities.state,
   //    state_fieldValidities.city,
   //    state_fieldValidities.country,
   //    state_fieldValidities.phone,
   //    state_fieldValidities.email,
   //    state_fieldValidities.company
   // ]);

   useEffect(()=>{
      if (
         state_fieldValidities_firstName &&
         state_fieldValidities_lastName &&
         state_fieldValidities_address1 &&
         state_fieldValidities_address2 &&
         state_fieldValidities_zip &&
         state_fieldValidities_state &&
         state_fieldValidities_city &&
         state_fieldValidities_country &&
         state_fieldValidities_phone &&
         state_fieldValidities_email &&
         state_fieldValidities_company
      ) {
         // console.log("setting state_valid to true");
         setState_valid( true );
      } else {
         // console.log("setting state_valid to false");
         setState_valid( false );
      }
   },[
      state_fieldValidities_firstName,
      state_fieldValidities_lastName,
      state_fieldValidities_address1,
      state_fieldValidities_address2,
      state_fieldValidities_zip,
      state_fieldValidities_state,
      state_fieldValidities_city,
      state_fieldValidities_country,
      state_fieldValidities_phone,
      state_fieldValidities_email,
      state_fieldValidities_company
   ]);

   let {addressType,onValidityChange} = props;
   useEffect(()=>{
      onValidityChange(addressType,state_valid);
   },[state_valid,addressType,onValidityChange]);

   let handleValidityChange = (field,status) => {
      //console.log("handling validity change",field,status);
      if ( false ) {
         setState_fieldValidities( prevState=>{
            prevState[field] = status;
            //console.log("returning",prevState);
            return prevState;
         });
      } else {
         switch( field ) {
            case "firstName": setState_fieldValidities_firstName(status); break;
            case "lastName": setState_fieldValidities_lastName(status); break;
            case "address1": setState_fieldValidities_address1(status); break;
            case "address2": setState_fieldValidities_address2(status); break;
            case "zip": setState_fieldValidities_zip(status); break;
            case "state": setState_fieldValidities_state(status); break;
            case "city": setState_fieldValidities_city(status); break;
            case "country": setState_fieldValidities_country(status); break;
            case "phone": setState_fieldValidities_phone(status); break;
            case "email": setState_fieldValidities_email(status); break;
            case "company": setState_fieldValidities_company(status); break;
            default: break;
         }
      }
   };

   return (
      <div className={styles.editableAddress}>
         <fieldset className={styles.fieldset}>
            <legend>{props.title}</legend>
            <p className={styles.requiredIndicator}>* Indicates required field</p>
            <Grid
               templateRows="repeat(2, 1fr)"
               //templateColumns="repeat(5, 1fr)"
               gap={2}
            >
               <GridItem colSpan={[2,2,1]}><Field disabled={!props.isVisible} onValidityChange={handleValidityChange} addressType={props.addressType} onFieldChange={props.onFieldChange} title="First Name" required={true} field="firstName" value={props.address.firstName} /></GridItem>
               <GridItem colSpan={[2,2,1]}><Field disabled={!props.isVisible} onValidityChange={handleValidityChange} addressType={props.addressType} onFieldChange={props.onFieldChange} title="Last Name" required={true} field="lastName" value={props.address.lastName} /></GridItem>
               <GridItem colSpan={2}><Field disabled={!props.isVisible} onValidityChange={handleValidityChange} addressType={props.addressType} onFieldChange={props.onFieldChange} title="Address Line 1" required={true} field="address1" value={props.address.address1} /></GridItem>
               <GridItem colSpan={2}><Field disabled={!props.isVisible} onValidityChange={handleValidityChange} addressType={props.addressType} onFieldChange={props.onFieldChange} title="Address Line 2" required={false} field="address2" value={props.address.address2} /></GridItem>
               <GridItem colSpan={[2,2,1]}><Field disabled={!props.isVisible} onValidityChange={handleValidityChange} addressType={props.addressType} onFieldChange={props.onFieldChange} title="Zip" required={true} field="zip" value={props.address.zip} /></GridItem>
               <GridItem colSpan={[2,2,1]}><Field disabled={!props.isVisible} onValidityChange={handleValidityChange} addressType={props.addressType} onFieldChange={props.onFieldChange} type="select" values={props.states} title="State" required={true} field="state" value={props.address.state} /></GridItem>
               <GridItem colSpan={2}><Field disabled={!props.isVisible} onValidityChange={handleValidityChange} addressType={props.addressType} onFieldChange={props.onFieldChange} title="City" required={true} field="city" value={props.address.city} /></GridItem>
               <GridItem colSpan={[2,2,1]}><Field disabled={!props.isVisible} onValidityChange={handleValidityChange} addressType={props.addressType} onFieldChange={props.onFieldChange} type="select" values={props.countries} title="Country" required={true} field="country" value={props.address.country} /></GridItem>
               <GridItem colSpan={[2,2,1]}><Field disabled={!props.isVisible} onValidityChange={handleValidityChange} addressType={props.addressType} onFieldChange={props.onFieldChange} title="Phone" required={true} field="phone" value={props.address.phone} /></GridItem>
               <GridItem colSpan={2}><Field disabled={!props.isVisible} onValidityChange={handleValidityChange} addressType={props.addressType} onFieldChange={props.onFieldChange} title="Email" required={true} field="email" value={props.address.email} /></GridItem>
               <GridItem colSpan={2}><Field disabled={!props.isVisible} onValidityChange={handleValidityChange} addressType={props.addressType} onFieldChange={props.onFieldChange} title="Company" required={false} field="company" value={props.address.company} /></GridItem>
            </Grid>
         </fieldset>
      </div>
   );
};

export default AddressForm;