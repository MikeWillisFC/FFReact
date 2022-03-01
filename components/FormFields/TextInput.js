import {memo,useState,useEffect,useCallback} from "react";
import {
   FormControl,
   FormLabel,
   FormErrorMessage,
   FormHelperText,
   Input,
   Box,
   InputRightElement,
   CheckIcon,
   Button
} from "@chakra-ui/react";

import { validateEmail } from "../../utilities";

import styles from "../../styles/formFields.module.scss";

const TextInput = props => {
   const [st_touched,sst_touched] = useState(false);
   const [st_blurry,sst_blurry] = useState(false);
   const [st_value,sst_value] = useState("");
   const [st_type,sst_type] = useState(props.type || "text");
   const [st_errorMessage,sst_errorMessage] = useState("This field is required");
   const [st_isInvalid,sst_isInvalid] = useState(false);

   //console.log("TextInput rendering");
   let {
      name,
      onChange,
      isRequired
   } = props;

   useEffect(()=>{
      let waitASec = setTimeout(()=>{
         //console.log("calling onChange");
         onChange(name,st_value);
      },[200]);

      return ()=>{
         clearTimeout(waitASec);
      }
   },[st_value,name,onChange]);

   // useEffect(()=>{ console.log("st_value changed"); },[st_value]);
   // useEffect(()=>{ console.log("name changed"); },[name]);
   // useEffect(()=>{ console.log("onChange changed"); },[onChange]);

   let handleFocus = event => {
      sst_touched(true);
      sst_blurry(false);
   };
   let handleBlur = event => {
      sst_blurry(true);
   };
   let handleChange = useCallback(event => {
      //console.log("handling change");
      sst_value(event.target.value);
   },[])

   let togglePassword = event => {
      event.preventDefault();
      sst_type(prevState=>{
         return prevState === "text" ? "password" : "text";
      });
   }; // togglePassword

   useEffect(()=>{
      let isInvalid = isRequired && st_blurry && st_touched && !st_value;
      let message = "";

      // console.log("isInvalid",isInvalid);

      if ( isInvalid ) {
         message = "This field is required";
      } else if ( st_type === "email" ) {
         if (
            st_blurry &&
            st_touched &&
            !validateEmail(st_value)
         ) {
            isInvalid = true;
            message = "Please enter a valid email address";
         }
      }

      sst_errorMessage(message);
      sst_isInvalid(isInvalid);
   },[
      isRequired,
      st_blurry,
      st_touched,
      st_value,
      st_type
   ]);

   return (
      <Box
         padding="3px"
         className={`${styles.field} ${(st_value ? styles.filled : "")}`}
      >
         <FormControl
            isRequired={props.isRequired}
            isInvalid={st_isInvalid}
         >
            <FormLabel htmlFor={props.name}>{props.label}</FormLabel>
            <Input
               height="60px"
               id={props.name}
               type={st_type}
               onFocus={handleFocus}
               onBlur={handleBlur}
               onChange={handleChange}
               value={st_value}
            />

            {
               (st_value && props.type === "password") && (
                  <InputRightElement>
                     <Button
                        marginTop="10px"
                        marginRight="40px"
                        onClick={togglePassword}
                     >
                        {st_type === "password" ? 'Show' : 'Hide'}
                     </Button>
                  </InputRightElement>
               )
            }

            <FormErrorMessage
               style={{zIndex:"10"}}
               className={styles.errorMessage}
            >
               {st_errorMessage}
            </FormErrorMessage>
         </FormControl>
      </Box>
   )
};

export default memo(TextInput);