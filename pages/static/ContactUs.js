import {useState,useEffect,useCallback} from "react";
import { useSelector,useDispatch } from "react-redux";
import Head from 'next/head';
import axios from "axios";
import {
   Box,
   Heading,
   AlertIcon,
   Alert,
   Button
} from '@chakra-ui/react';

import TextInput from "../../components/FormFields/TextInput";
import {messagesActions} from "../../store/slices/messages";
import {openMiscModal,parseMessages} from "../../utilities";

let fields = {
   name: {
      label:"Full Name:",
      name:"name",
      isRequired:true
   },
   emailAddress: {
      label:"E-Mail Address:",
      name:"email",
      isRequired:true,
      type:"email"
   },
   message: {
      label:"Enquiry:",
      name:"enquiry",
      isRequired:true,
      type:"textarea"
   }
};

const ContactUs = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   const dispatch = useDispatch();

   const [st_fields,sst_fields] = useState([]);
   const [st_submitting,sst_submitting] = useState(false);
   const [st_allValid,sst_allValid] = useState(false);

   let setLoginFields = () => {
      sst_fields([fields.name,fields.emailAddress,fields.message]);
   };

   useEffect(()=>{
      setLoginFields();
   },[]);

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

      const headers = { 'Content-Type': 'multipart/form-data' };
      let bodyFormData = new FormData();

      bodyFormData.set( "name", event.target.elements["name"].value );
      bodyFormData.set( "email", event.target.elements["email"].value );
      bodyFormData.set( "enquiry", event.target.elements["enquiry"].value );

      dispatch(messagesActions.clearMessages());

      window.googleRecaptcha.execute('contact').then( async (token) => {
         bodyFormData.set( "GoogleReCaptchaResponse", token );
         const response = await axios.post( `https://${globalConfig.apiDomain}/pscripts/form/contactus.php`, bodyFormData, {
            headers: headers,
            withCredentials: true
         });

         sst_submitting(false);

         if ( response.status ) {
            if ( !response.data.status ) {
               dispatch(messagesActions.setErrorMessages({
                  title:"Error",
                  messages: [`We're sorry, there has been an error submitting your form. Please try again. If the problem persists please call us at ${globalConfig.phoneNumber}.`]
               }));
            } else {
               dispatch(messagesActions.setInformationMessages({
                  title:"Success",
                  messages: [`Thank you, your message has been successfully sent to Customer Service.`]
               }));
               clearForm();
            }
         }
      }).catch(error=>{
         sst_submitting(false);
         dispatch(messagesActions.setErrorMessages([`We're sorry, there has been an error submitting your form. Please try again. If the problem persists please call us at ${globalConfig.phoneNumber}.`]));
      }).finally(()=>{
         sst_submitting(false);
      });
   },[
      dispatch,
      globalConfig.apiDomain,
      globalConfig.phoneNumber,
      clearForm
   ]);

   return (
      <Box>
         <Head>
            <title>Contact Us at Favor Favor</title>
            <meta name="robots" content="noodp, noydir" />
         </Head>

         <Heading as="h2" size="lg">
            Contact Favor Favor
         </Heading>

         {
            globalConfig.phonesDown && (
               <Alert status='warning' style={{padding:"2px"}}>
                  <AlertIcon />
                  We are experiencing technical problems with our phone system, for now it is best to use the contact form to get in touch with us and we will respond as soon as possible. We hope to have this problem solved shortly, and we apologize for the inconvenience.
               </Alert>
            )
         }

         <form
            method="post"
            onSubmit={handleSubmit}
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

            <br />
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
   );
};

export default ContactUs;