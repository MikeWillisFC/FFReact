import {useRef,useState,useEffect,useCallback} from "react";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";
import {
  Center,
  Box,
  Button
} from '@chakra-ui/react';

import TextInput from "../FormFields/TextInput";

let fields = {
   username: {
      label:"Username:",
      name:"Customer_Login",
      isRequired:true
   },
   password: {
      label:"Password:",
      name:"Customer_Password",
      isRequired:true,
      type:"password"
   }
};

import {messagesActions} from "../../store/slices/messages";
import {parseMessages} from "../../utilities";

const Login = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });
   const dispatch = useDispatch();

   const [st_fields,sst_fields] = useState([]);
   const [st_allValid,sst_allValid] = useState(false);
   const [st_submitting,sst_submitting] = useState(false);
   const [st_forgotPassword,sst_forgotPassword] = useState(false);

   let setLoginFields = () => {
      sst_fields([fields.username,fields.password]);
   };

   useEffect(()=>{
      setLoginFields();
   },[]);

   useEffect(()=>{
      if ( st_forgotPassword ) {
         sst_fields([fields.username]);
      }
   },[st_forgotPassword]);

   let handleSubmit = useCallback(async (event) => {
      event.preventDefault();

      console.log("handling submit");
      console.log("st_fields",st_fields);

      const headers = { 'Content-Type': 'multipart/form-data' };
      let bodyFormData = new FormData();
      bodyFormData.set( "Store_Code", "FF" );
      //bodyFormData.set( "Action", (st_forgotPassword ? "EMPW" : "LOGN") );
      bodyFormData.set( "cAction", (st_forgotPassword ? "forgotPassword" : "login") );

      st_fields.forEach(field=>{
         bodyFormData.set( field.name, field.value );
      });

      if ( st_forgotPassword ) {
         bodyFormData.set( "Customer_Password", "" );
      }
      bodyFormData.set( "Product_Code", "" );
      bodyFormData.set( "Registry_Login", "1" );

      sst_submitting(true);
      try {
         if ( true ) {
            dispatch(messagesActions.clearMessages());
            const response = await axios.post( globalConfig.apiEndpoint, bodyFormData, {
               headers: headers,
               withCredentials: true
            });
            sst_submitting(false);
            if ( response.status ) {
               parseMessages(response.data,dispatch,messagesActions);
               console.log("response",response);
               console.log("pushing route");
               //router.push(props.return);
            } else {
               console.log("not response status?!");
            }
         } else {
            const response = await fetch( globalConfig.apiEndpoint, {
               method: 'post',
               credentials: 'include',
               mode: 'cors',
               body: bodyFormData
            });
         }
      } catch (e) {
         sst_submitting(false);
      }

      //console.log("response",response);
   },[st_forgotPassword,st_fields,globalConfig.apiEndpoint,dispatch]); // handleSubmit

   let handleChange = (changedField,value) => {
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
   } // handleChange

   return (
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

               {
                  !st_forgotPassword ? (
                     <Button
                        size="sm"
                        colorScheme='teal'
                        variant='ghost'
                        onClick={event=>sst_forgotPassword(true)}
                     >
                        Forgot Password?
                     </Button>
                  ) : (
                     <p>Please enter your username above and click submit. A link to reset your password will be sent to the email address we have on file for your account. Please be sure to check your spam folder.</p>
                  )
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


   );
};

export default Login;