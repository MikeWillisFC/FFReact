import {useState,useEffect} from "react";
import {
   FormControl,
   FormLabel,
   FormErrorMessage,
   FormHelperText,
   Input,
   Box
} from "@chakra-ui/react";

import styles from "../../styles/formFields.module.scss";

const TextField = props => {
   const [st_touched,sst_touched] = useState(false);
   const [st_blurry,sst_blurry] = useState(false);
   const [st_value,sst_value] = useState("");

   let {
      name,
      onChange
   } = props;

   useEffect(()=>{
      let waitASec = setTimeout(()=>{
         onChange(name,st_value);
      },[200]);

      return ()=>{
         clearTimeout(waitASec);
      }
   },[st_value,name,onChange]);

   let handleFocus = event => {
      sst_touched(true);
      sst_blurry(false);
   };
   let handleBlur = event => {
      sst_blurry(true);
   };
   let handleChange = event => {
      sst_value(event.target.value);
   }

   return (
      <Box
         padding="3px"
         className={`${styles.field} ${(st_value ? styles.filled : "")}`}
      >
         <FormControl
            isRequired={props.isRequired}
            isInvalid={props.isRequired && st_blurry && st_touched && !st_value}
         >
            <FormLabel htmlFor={props.name}>{props.label}</FormLabel>
            <Input
               height="60px"
               id={props.name}
               type={props.type || "text"}
               onFocus={handleFocus}
               onBlur={handleBlur}
               onChange={handleChange}
               value={st_value}
            />
            <FormErrorMessage
               className={styles.errorMessage}
            >
               This field is required
            </FormErrorMessage>
         </FormControl>
      </Box>
   )
};

export default TextField;