import {useState,useEffect,useRef,useCallback} from "react";
import { Select,Input,Textarea,Box,InputGroup,InputRightElement } from "@chakra-ui/react";

import { validateEmail } from "../../utilities";

import styles from "../../styles/checkout.module.scss";

const Field = props => {
   const [state_focused,setState_focused] = useState(props.value ? true : false);
   const [state_value,setState_value] = useState(props.value || "");
   const [state_values,setState_values] = useState(props.values || []);
   const [state_valid,setState_valid] = useState(props.required ? (props.value ? true : false) : true);
   const [state_touched,setState_touched] = useState( false );

   let {
      values,
      value,
      onValidityChange,
      onFieldChange,
      field,
      required,
      cardValidator,
      addressType
   } = props;

   //console.log("state_values",state_values);
   useEffect(()=>{
      // console.log("values",values);
   },[values]);

   let changeHandled = useRef();

   let checkValidity = useCallback(value => {
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
      let waitASec = setTimeout(()=>{
         // console.log("timeout complete");
         if ( state_value && onFieldChange ) {
            // console.log("calling onFieldChange");
            onFieldChange(field,state_value,addressType);
         }
      },300);

      return ()=>{clearTimeout(waitASec);};
   },[state_value,field,onFieldChange,addressType]);

   useEffect(()=>{
      if ( onValidityChange ) {
         onValidityChange(field,state_valid);
      }
   },[state_valid,onValidityChange,field]);

   useEffect(()=>{
      //console.log("value changed",props.required,value);
      setState_value(value || "");
   },[value]);

   useEffect(()=>{
      //console.log("state_value changed",props.required,state_value);
      setState_touched( prevState=>{
         let result = prevState || state_value;
         setState_focused(result);
         return result;
      });
      checkValidity( state_value );
   },[state_value,checkValidity]);

   useEffect(()=>{
      setState_values(values || "");
   },[values]);

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
   },[state_value,checkValidity]);

   let handleChange = event => {
      if ( props.disabled ) {
         /* just in case stupid browser autofillers try to fill in the
         * address fields even when they're disabled
         */
         event.preventDefault();
      } else {
         // console.log("handleChange");
         changeHandled.current = true;
         setState_value( event.target.value );
         setState_touched(true);
         setState_focused(true);
         checkValidity( event.target.value );
      }

   }; // handleChange

   let handleFocus = event => {
      if ( !props.disabled ) {
         setState_focused(true);
      }
   }; // handleFocus

   let handleBlur = event => {
      if ( !props.disabled ) {
         setState_touched(true);
         setState_value( prevState=>{
            if ( !prevState ) {
               setState_focused(false);
            }
            return prevState;
         });
      }
   }; // handleBlur

   let handleKeyUp = event => {
      if ( !props.disabled ) {
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
      }
   };

   let handleKeyDown = event => {
      if ( !props.disabled ) {
         // console.log("keydown");
         // console.log("event.target.value",event.target.value);
         changeHandled.current = false;
      }
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
                  disabled={props.disabled}
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
                  disabled={props.disabled}
               >
                  <option value=""></option>
                  {
                     state_values.length && state_values.filter(option=>option.name !== "&lt;Select One&gt;").map(option=>{
                        return <option key={`${option.name}|${option.code}`} value={option.code}>{option.name}</option>;
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
                  disabled={props.disabled}
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