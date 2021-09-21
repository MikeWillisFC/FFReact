import {Fragment,useRef,useEffect,useState} from "react";
import { motion,useAnimation } from "framer-motion";
import { FaCircle,FaEdit } from 'react-icons/fa';
import axios from "axios";
import {
   Icon,
   Tr,
   Td
} from "@chakra-ui/react";

import {formatPrice} from "../../utilities";

import baskStyles from "../../styles/basket.module.scss";

const OptionVal = props => {
   const [state_hover,setState_hover] = useState(false);

   return (
      state_hover ? (
         <input
            value={props.value}
         />
      ) : <b>{props.value}</b>
   );
};

const OptionRow = props => {
   const [state_optionWidth,setState_optionWidth] = useState("auto");
   const [state_optionVal,setState_optionVal] = useState(props.option.value);
   const [state_rowCollapsing,setState_rowCollapsing] = useState(props.motion.collapsing);

   const controls = useAnimation();

   let {option} = props;

   let spanRef = useRef();

   useEffect(()=>{
      setState_rowCollapsing(props.motion.collapsing);
      if ( props.motion.collapsing ) {
         //console.log("collapsing");
         controls.start("collapsed");
      }
   },[controls,props.motion.collapsing]);

   let {receiveWidth} = props;
   useEffect(()=>{
      if ( spanRef.current ) {
         //console.log("spanRef.current.offsetWidth:",spanRef.current.offsetWidth);
         receiveWidth(spanRef.current.offsetWidth);
      }
   },[
      //spanRef.current,
      receiveWidth
   ]);

   useEffect(()=>{
      setState_optionVal(props.option.value);
   },[props.option.value]);

   useEffect(()=>{
      //console.log("received optionWidth:",props.optionWidth);
      if ( props.optionWidth ) {
         setState_optionWidth( `${props.optionWidth}.px` );
      }
   },[props.optionWidth]);

   let formatCamelCase = promptText => {
   	/* Cleans up attribute prompts (ex. "borderColor" -> "Border Color") */
   	let needsFormatting = false;

   	// If this prompt is camelCase, it probably needs formatting:
   	for (let i=0; i<promptText.length; i++) {
   		if ( (i>0) && (promptText[i].match(/[a-zA-Z0-9]/i)) && (promptText[i] === promptText[i].toUpperCase()) ) {
   			needsFormatting = true;
   			break;
   		}
   	}

   	// Adjust spacing:
   	if ( needsFormatting ) {
   		let editted = false;
   		do {
   			editted = false;
   			for (let i=0; i<promptText.length; i++) {
   				let char = promptText[i];
   				let prevChar = promptText[i-1];
   				if (
   					(i>0) && (prevChar !== " ") &&
   					((char.match(/[a-zA-Z]/i) && char === char.toUpperCase() && !(char === 'D' && prevChar === 'I')) ||
   					(char.match(/[0-9]/i)))
   				) {
   					// Add space before this character
   					let beforeSpace = promptText.slice(0, i);
   					let afterSpace = promptText.slice(i, promptText.length);
   					promptText = beforeSpace + " " + afterSpace;
   					editted = true;
   					break;
   				}
   			}
   		} while (editted === true);
   	}

   	// Make sure first chracter is capitalized:
   	promptText = promptText.charAt(0).toUpperCase() + promptText.substr(1);

   	return promptText;
   }; // formatCamelCase

   let handleEditableChange = event => {
      console.log("change",event.target.value);
      setState_optionVal(event.target.value);
   }; // handleEditableChange

   let handleEditableBlur = async (event) => {
      // console.log("blur",state_optionVal);
      // console.log("option",option);
      // console.log("basketID",props.basketID);

      const headers = { 'Content-Type': 'multipart/form-data' };
      let bodyFormData = new FormData();
      bodyFormData.set( "responseType", "json" );
      bodyFormData.set( "basketID", props.basketID );
      bodyFormData.set( "basketLineID", props.lineID );
      bodyFormData.set( "attID", option.attID );
      bodyFormData.set( "attCode", option.attCode );
      bodyFormData.set( "value", state_optionVal );

      //console.log("globalConfig",globalConfig);
      const response = await axios.post( `https://${props.domain}/pscripts/misc/attEdit.php`, bodyFormData, {
         headers: headers,
         withCredentials: true
      });
      if ( response.status ) {
         console.log("response.data",response.data);
      }
   }; // handleEditableBlur

   return (
      <Tr key={option.code} className={baskStyles.optionRow}>
         <Td colSpan={(option.price ? 1 : (props.editable ? 4 : 3))} className={(state_rowCollapsing ? baskStyles.collapsing : '')}>
            <motion.div
               variants={props.motion.variants}
               transition={props.motion.transition}
               initial={props.motion.initial}
               exit={props.motion.exit}
               animate={controls}
            >
               <span ref={spanRef} style={{display:"inline-block",width:state_optionWidth}}>
                  {
                     option.editable === "true" && props.editable ?
                        <Icon as={FaEdit} color="#000" boxSize=".8em" />
                     : <Icon as={FaCircle} color="#000" boxSize=".8em" />
                  }

                  {" "}
                  {formatCamelCase(option.code)}
               </span>
               : <Fragment>
                  {
                     option.editable === "true" && props.editable ?
                        <input
                           value={state_optionVal}
                           onChange={handleEditableChange}
                           onBlur={handleEditableBlur}
                        />
                     : <b>{state_optionVal}</b>
                  }
               </Fragment>
            </motion.div>
         </Td>
         {
            option.price && <Fragment>
               <Td className={(state_rowCollapsing ? baskStyles.collapsing : '')}>
                  <motion.div
                     variants={props.motion.variants}
                     transition={props.motion.transition}
                     initial={props.motion.initial}
                     exit={props.motion.exit}
                     animate={controls}
                  >
                     {formatPrice(parseInt(option.price))}
                  </motion.div>
               </Td>
               <Td className={(state_rowCollapsing ? baskStyles.collapsing : '')}></Td>
               <Td className={(state_rowCollapsing ? baskStyles.collapsing : '')}>
                  <motion.div
                     variants={props.motion.variants}
                     transition={props.motion.transition}
                     initial={props.motion.initial}
                     exit={props.motion.exit}
                     animate={controls}
                  >
                     {formatPrice(props.quantity * parseInt(option.price))}
                  </motion.div>
               </Td>
            </Fragment>
         }
      </Tr>
   );
};

export default OptionRow;