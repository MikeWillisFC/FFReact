import {useState,useEffect} from "react";
import _ from "lodash";
import {
   Box,
   Input,
   VStack,
   StackDivider
} from "@chakra-ui/react";

const AutocompleteInput = props => {
   console.log("AutocompleteInput props",props);
   const [st_activeEl,sst_activeEl] = useState(false);
   const [st_active,sst_active] = useState(false);

   let inputProps = {...props};
   inputProps = _.pickBy(inputProps,(value,key)=>{
      return key.substr(0,12) !== "autocomplete";
   });

   useEffect(() => {
      let handleClick = event => { sst_activeEl(event.target); };
      document.addEventListener("mouseup", handleClick);
      return () => {
         document.removeEventListener("mouseup", handleClick);
      };
   },[]);

   let handleFocus = event => {
      sst_active(true);
      if ( inputProps.onFocus && typeof(inputProps.onFocus === "function") ) {
         inputProps.onFocus();
      }
   }; // handleFocus

   let handleBlur = event => {
      /* 2022-02-08: It seems that without this delay, the menu
      * gets deactivated before the click handler ever runs.
      * Weird but true.
      */
      setTimeout(()=>{
         sst_active(false);
         if ( inputProps.onBlur && typeof(inputProps.onBlur === "function") ) {
            inputProps.onBlur();
         }
      },400);
   }; // handleBlur

   let handleClick = (event,label) => {
      props.autocompleteChangeVal(label);
      handleBlur();
   }; // handleClick

   return (
      <Box
         style={{display: "inline-block",position:"relative",overflow:"show"}}
      >
         <Input
            {...inputProps}
            autoComplete="off"
            ref={props.autocompleteFieldRef}
            onBlur={handleBlur}
            onFocus={handleFocus}
         />
         {
            (
               props.autocompleteTerms.length &&
               props.value.length >= 3 &&
               st_active
            ) && (
               <Box
                  width="150%"
                  className={props.autocompleteClass ? props.autocompleteClass : ""}
               >
                  <VStack
                     spacing={1}
                     align='stretch'
                  >
                     {
                        props.autocompleteTerms.filter(term=>{
                           return term.label.indexOf(props.value) !== -1;
                        }).slice(0,props.autocompleteMaxTerms).map((term,index)=>{
                           return (
                              <Box
                                 key={`${term.label}|${index}`}
                                 height='30px'
                                 onClick={(event)=>{handleClick(event,term.label)}}
                              >
                                 {term.label}
                              </Box>
                           )
                        })
                     }

                  </VStack>
               </Box>
            )
         }
      </Box>
   )
}; // AutocompleteInput

export default AutocompleteInput;