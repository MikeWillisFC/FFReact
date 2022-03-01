import {Fragment,useState,useEffect,useCallback} from "react";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";
import {
   Center,
   Box,
   Button,
   Heading
} from '@chakra-ui/react';

import TextInput from "../FormFields/TextInput";
import {messagesActions} from "../../store/slices/messages";
import {openMiscModal,parseMessages} from "../../utilities";

let fields = {
   username: {
      label:"Email Address:",
      name:"Customer_Login",
      isRequired:true,
      type:"email"
   },
   password: {
      label:"Password:",
      name:"Customer_Password",
      isRequired:true,
      type:"password"
   }
};

const CreateAccount = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   const dispatch = useDispatch();

   const [st_fields,sst_fields] = useState([]);
   const [st_submitting,sst_submitting] = useState(false);
   const [st_allValid,sst_allValid] = useState(false);

   let {
      miscModalDisclosure,
      setMiscModal,
      onComplete
   } = props;

   let setLoginFields = () => {
      console.log("setLoginFields called");
      sst_fields([fields.username,fields.password]);
   };

   useEffect(()=>{
      setLoginFields();
   },[]);

   let handleChange = useCallback((changedField,value) => {
      //console.log("handleChange called for changedField:",changedField);
      let allValid = true;
      sst_fields(prevFields=>{
         return prevFields.map(field=>{
            //console.log("checking field",field);
            if ( field.name === changedField ) {
               //console.log("match");
               field.value = value;
            }
            if ( allValid && field.isRequired && !field.value ) {
               allValid = false;
            }
            //console.log("returning field",field);
            return field;
         });
      });
      sst_allValid(allValid);
   },[]) // handleChange

   let handleSubmit = useCallback(async (event) => {
      event.preventDefault();
      console.log("submitting, event:",event);

      const headers = { 'Content-Type': 'multipart/form-data' };
      let bodyFormData = new FormData();

      window.googleRecaptcha.execute('AccountCreate_BASK').then( async (token) => {
         console.log("token",token);
         bodyFormData.set( "GoogleReCaptchaResponse", token );

         bodyFormData.set( "Customer_PasswordEmail", event.target.elements["Customer_Login"].value );
         bodyFormData.set( "Customer_LoginEmail", event.target.elements["Customer_Login"].value );
         bodyFormData.set( "Customer_BillEmail", event.target.elements["Customer_Login"].value );
         bodyFormData.set( "Customer_Password", event.target.elements["Customer_Password"].value );
         bodyFormData.set( "Customer_VerifyPassword", event.target.elements["Customer_Password"].value );

         bodyFormData.set( "Store_Code", "FF" );
         bodyFormData.set( "Action", "ICST" );
         bodyFormData.set( "Customer_BillFirstName", "FirstName" );
         bodyFormData.set( "Customer_BillLastName", "LastName" );
         bodyFormData.set( "Customer_BillPhone", "5555555" );
         bodyFormData.set( "Customer_BillAddress", "Address" );
         bodyFormData.set( "Customer_BillCity", "City" );
         bodyFormData.set( "Customer_BillStateSelect", "NY" );
         bodyFormData.set( "Customer_BillZip", "55555" );
         bodyFormData.set( "Customer_BillCountry", "US" );

         bodyFormData.set( "Customer_ShipFirstName", "" );
         bodyFormData.set( "Customer_ShipLastName", "" );
         bodyFormData.set( "Customer_ShipEmail", "" );
         bodyFormData.set( "Customer_ShipPhone", "" );
         bodyFormData.set( "Customer_ShipAddress", "" );
         bodyFormData.set( "Customer_ShipCity", "" );
         bodyFormData.set( "Customer_ShipStateSelect", "" );
         bodyFormData.set( "Customer_ShipZip", "" );
         bodyFormData.set( "Customer_ShipCountry", "" );

         //console.log("globalConfig",globalConfig);
         dispatch(messagesActions.clearMessages());
         const response = await axios.post( globalConfig.apiEndpoint, bodyFormData, {
            headers: headers,
            withCredentials: true
         });
         console.log("response",response);
         if ( response.status ) {
            let messages = parseMessages(response.data,dispatch,messagesActions);
            if ( !messages.errorMessages.length ) {
               // yay
               onComplete();
            } else {
               // boo
            }

         }
      });
   },[
      onComplete,
      dispatch,
      globalConfig.apiEndpoint
   ]);

   let handleWhatIsThis = useCallback(async (event) => {
      event.preventDefault();

      openMiscModal({
         setModal: setMiscModal,
         disclosure: miscModalDisclosure,
         title: "Saving Your Basket",
         href: `https://${globalConfig.apiDomain}/includes/ajax/whatIsThisBask.php?api`,
         size: "md"
      });
   },[
      miscModalDisclosure,
      setMiscModal,
      globalConfig
   ]);

   return (
      <Box style={{position:"relative"}}>
         <Heading as='h2' size='lg'>
            Create Account
         </Heading>

         <Button
            style={{position: "absolute",top:"5px",right:"5px"}}
            size="sm"
            colorScheme='teal'
            variant='ghost'
            onClick={handleWhatIsThis}
         >
            what is this?
         </Button>

         <Center>
            <Box width={["95%","95%","80%"]}>
               <form method="post" onSubmit={handleSubmit}>
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
                  >
                     Submit
                  </Button>
               </form>
            </Box>
         </Center>
      </Box>
   );
};

export default CreateAccount;