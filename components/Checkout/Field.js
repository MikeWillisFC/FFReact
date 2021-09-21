import {useState,useEffect,useRef,useCallback} from "react";
import { Select,Input,Textarea,Box,InputGroup,InputRightElement } from "@chakra-ui/react";

import styles from "../../styles/checkout.module.scss";

const Field = props => {
   const [state_focused,setState_focused] = useState(props.value ? true : false);
   const [state_value,setState_value] = useState(props.value || "");
   const [state_values,setState_values] = useState(props.values || []);
   const [state_valid,setState_valid] = useState(props.required ? (props.value ? true : false) : true);
   const [state_touched,setState_touched] = useState( false );

   let changeHandled = useRef();

   let {onValidityChange,field,required,cardValidator} = props;

   let checkValidity = useCallback(value => {

      // see https://stackoverflow.com/a/46181/1042398
      let validateEmail = email => {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      }

      if ( !required ) {
         setState_valid( true );
      } else {
         let isValid;
         if ( !required ) {
            isValid = true;
         } else {
            switch( field ) {
            case "firstName":
            case "lastName":
            case "address1":
            case "state":
            case "city":
            case "country":
            case "phone":
               isValid = value ? true : false;
               break;
            case "company":
            case "address2":
               isValid = true;
               break;
            case "zip":
               // see https://stackoverflow.com/a/160583/1042398 and https://stackoverflow.com/a/7446316/1042398
               let canadaRegEx = new RegExp(/^[abceghjklmnprstvxy][0-9][abceghjklmnprstvwxyz]\s?[0-9][abceghjklmnprstvwxyz][0-9]$/i);
               let usRegEx = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
               isValid = canadaRegEx.test(value) || usRegEx.test(value);
               break;
            case "email":
               isValid = value ? validateEmail( value ) : false;
               break;
            case "AuthorizeNet_Card_Num":
               if ( !value ) {
                  isValid = false;
               } else {
                  if ( cardValidator && value.length >= 4 ) {
                     let cardValidation = cardValidator.number(value);
                     isValid = cardValidation.isPotentiallyValid;
                  } else {
                     isValid = !required || value;
                  }
               }
               break;
            default:
               isValid = !required || value;
               break;
            }
         }

         setState_valid( isValid );
      }
   },[
      required,
      field,
      cardValidator
   ]); // checkValidity

   useEffect(()=>{
      if ( onValidityChange ) {
         onValidityChange(field,state_valid);
      }
   },[state_valid,onValidityChange,field]);

   useEffect(()=>{
      //console.log("props.value changed",props.required,props.value);
      setState_value(props.value || "");
   },[props.value]);

   useEffect(()=>{
      //console.log("state_value changed",props.required,state_value);
      setState_touched( prevState=>{
         let result = prevState || state_value;
         setState_focused(result);
         return result;
      });
      checkValidity( state_value );
   },[state_value,props.required,checkValidity]);

   useEffect(()=>{
      setState_values(props.values || "");
   },[props.values]);

   useEffect(()=>{
      //console.log("state_value useEffect", state_value);
      setState_focused( prevState=>{
         //console.log("prevState",prevState);
         if ( !prevState ) {
            /* 2021-09-07: the value changed and it's not currently focused.
            * This is probably an autofill of some sort, so let's trigger the change
            * handler as well
            */
            //props.onFieldChange(props.field,state_value,props.addressType);
            checkValidity( state_value );
         }

         return prevState;
      });
   },[state_value,props.required,checkValidity]);

   let handleChange = event => {
      // console.log("handleChange");
      changeHandled.current = true;
      setState_value( event.target.value );
      setState_touched(true);
      setState_focused(true);
      checkValidity( event.target.value );
      if ( props.onFieldChange ) {
         props.onFieldChange(props.field,event.target.value);
      }
   }; // handleChange

   let handleFocus = event => {
      setState_focused(true);
   }; // handleFocus

   let handleBlur = event => {
      setState_touched(true);
      if ( props.onFieldBlur ) {
         props.onFieldBlur(props.field,event.target.value,props.addressType);
      }
      setState_value( prevState=>{
         if ( !prevState ) {
            setState_focused(false);
         }
         return prevState;
      });
   }; // handleBlur

   let handleKeyUp = event => {
      // console.log("keyup");
      // console.log("event.target.value",event.target.value);
      // console.log("changeHandled.current",changeHandled.current);
      if ( !changeHandled.current ) {
         /* 2021-09-15: this happens when we use Braintree's system for
         * formatting the card number. Just trigger the change event
         * manually.
         */
         handleChange(event);
      }
   };

   let handleKeyDown = event => {
      // console.log("keydown");
      // console.log("event.target.value",event.target.value);
      changeHandled.current = false;
   };

   let renderField = () => {
      if ( !props.type || props.type === "input" || props.type === "number" || props.type === "text" ) {
         let type;
         switch( props.type ) {
            case "input":
            case "text":
               type = "text";
               break;
            case "number":
               type = "number";
               break;
            default:
               type = "text";
               break;
         }
         return (
            <InputGroup>
               <Input
                  maxLength="30"
                  type={type}
                  size="md"
                  value={state_value}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  onKeyUp={handleKeyUp}
                  onKeyDown={handleKeyDown}
                  ref={props.reff || null}
                  inputMode={props.inputMode || null}
               />
               {
                  props.icon && <InputRightElement>{props.icon}</InputRightElement>
               }
            </InputGroup>

         );
      } else {
         switch( props.type ) {
         case "select":
            return (
               <Select
                  size="md"
                  value={state_value}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={handleChange}
               >
                  <option value=""></option>
                  {
                     state_values.length && state_values.filter(option=>option.name !== "&lt;Select One&gt;").map(option=>{
                        return <option key={option.code} value={option.code}>{option.name}</option>;
                     })
                  }
               </Select>
            );
            break;
         case "textarea":
            return (
               <Textarea
                  size="md"
                  value={state_value}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={handleChange}
               />
            );
            break;
         }
      }
   };

   return (
      <Box className={`${styles.fieldGroup} ${(state_focused ? styles.focused : '')}`}>
         <label className={`${(!state_valid && state_touched ? styles.invalid : (state_valid && state_value && state_touched ? styles.valid : ''))}`}>
            {`${props.title}${(props.required ? '*' : '')}`}
         </label>
         {renderField()}
      </Box>
   );
};

export default Field;