import {Fragment,useRef,useEffect,useState,useCallback} from "react";
import { motion,useAnimation } from "framer-motion";
import { FaCircle,FaEdit,FaCheckCircle,FaTimesCircle } from 'react-icons/fa';
import axios from "axios";
import { useSelector } from "react-redux";
import {
   Icon,
   Tr,
   Td,
   Spinner,
   Box
} from "@chakra-ui/react";

import {formatPrice} from "../../utilities";

import baskStyles from "../../styles/basket.module.scss";

const OptionVal = props => {

   /* 2021-12-09: not in use for whatever reason... */
   const [state_hover,setState_hover] = useState(false);

   return (
      state_hover ? (
         <Fragment>
            <input value={props.value} />fdsa
         </Fragment>
      ) : (
         <b>{props.value}</b>
      )
   );
};

const OptionRow = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   const [state_optionWidth,setState_optionWidth] = useState("auto");
   const [state_optionVal,setState_optionVal] = useState(props.option.value);
   const [state_lastOptionVal,setState_lastOptionVal] = useState(props.option.value);
   const [state_rowCollapsing,setState_rowCollapsing] = useState(props.motion.collapsing);
   const [state_updating,setState_updating] = useState(false);
   const [state_updateResult,setState_updateResult] = useState(null);
   const [state_focused,setState_focused] = useState(false);

   const controls = useAnimation();

   let { basketID,lineID,option,receiveWidth,optionWidth } = props;
   let { attID,attCode } = option;
   let propsOptionValue = props.option.value
   let collapsing = props.motion.collapsing;

   //console.log("option",option);

   let spanRef = useRef();

   let getPrompt = prompt => {
      //console.log("prompt",prompt);
      let result;
      if ( prompt.substr(0,1) === "{" ) {
         result = JSON.parse( prompt );
      } else {
         result = {prompt:prompt};
      }
      //console.log("result",result);
      return result;
   }; // getPrompt

   let maxLength = 30;
   let prompt = getPrompt( option.prompt );
   //console.log("prompt",prompt);
   if ( prompt.textLimit ) {
      maxLength = parseInt(prompt.textLimit);
   }

   useEffect(()=>{
      setState_rowCollapsing(collapsing);
      if ( collapsing ) {
         //console.log("collapsing");
         controls.start("collapsed");
      }
   },[
      controls,
      collapsing
   ]);

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
      setState_optionVal(propsOptionValue);
   },[propsOptionValue]);

   useEffect(()=>{
      //console.log("received optionWidth:",props.optionWidth);
      if ( optionWidth ) {
         setState_optionWidth( `${optionWidth}.px` );
      }
   },[optionWidth]);

   let formatCamelCase = useCallback(promptText => {
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
   },[]); // formatCamelCase

   let handleEditableChange = event => {
      //console.log("change",event.target.value);
      setState_optionVal(event.target.value);
   }; // handleEditableChange

   useEffect(()=>{
      if ( state_updateResult ) {
         let timeout = setTimeout(()=>{
            setState_updateResult(null);
         }, 2000);
         return ()=>{
            clearTimeout(timeout);
         }
      }
   },[state_updateResult]);
   let handleEditableBlur = useCallback(async (event) => {
      setState_focused(false);
      // console.log("blur",state_optionVal);
      // console.log("option",option);
      // console.log("basketID",props.basketID);

      const headers = { 'Content-Type': 'multipart/form-data' };
      let bodyFormData = new FormData();
      bodyFormData.set( "responseType", "json" );
      bodyFormData.set( "basketID", basketID );
      bodyFormData.set( "basketLineID", lineID );
      bodyFormData.set( "attID", attID );
      bodyFormData.set( "attCode", attCode );
      bodyFormData.set( "value", state_optionVal );

      //console.log("globalConfig",globalConfig);
      setState_updating( true );

      try {
         const response = await axios.post( `https://${globalConfig.domain}/pscripts/misc/attEdit.php`, bodyFormData, {
            headers: headers,
            withCredentials: true
         });
         if ( response && response.status ) {
            setState_updating( false );
            //console.log("response.data",response.data);
            if ( response.data.status === "1" && response.data.validated ) {
               setState_updateResult("success");
               setState_lastOptionVal( state_optionVal );
            } else {
               setState_updateResult("error");
               setState_optionVal( state_lastOptionVal );
            }
         } else {
            setState_updating( false );
            setState_updateResult("error");
            setState_optionVal( state_lastOptionVal );
         }
      } catch (e) {
         setState_updating( false );
         setState_updateResult("error");
         setState_optionVal( state_lastOptionVal );
      }

   },[
      basketID,
      lineID,
      globalConfig.domain,
      attID,
      state_optionVal,
      state_lastOptionVal,
      attCode
   ]); // handleEditableBlur

   let charCountStyle = {
      color: state_optionVal.length < maxLength ? "" : "#f00"
   };

   let handleKeyUp = event => {
      if ( event.key === 'Enter' || event.keyCode === 13 ) {
         event.preventDefault();
         event.target.blur();
      }
   }; // handleKeyUp

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
                     option.editable === "true" && props.editable ? (
                        <Icon as={FaEdit} color="#000" boxSize=".8em" />
                     ) : (
                        <Icon as={FaCircle} color="#000" boxSize=".8em" />
                     )
                  }
                  {" "}
                  {formatCamelCase(option.code)}
               </span>
               <span style={{display:"inline-block",margin:"0px 8px 0px 3px"}}>:</span>
               <Fragment>
                  {
                     option.editable === "true" && props.editable ? (
                        <Fragment>
                           <input
                              value={state_optionVal}
                              onKeyUp={handleKeyUp}
                              onChange={handleEditableChange}
                              onBlur={handleEditableBlur}
                              onFocus={()=>{setState_focused(true)}}
                              maxLength={maxLength}
                           />
                           {
                              state_focused && (
                                 <span className="blue">
                                    {" "}<span style={charCountStyle}>{state_optionVal.length}</span>{` - ${maxLength} Characters - Max`}{" "}
                                 </span>
                              )
                           }
                           { state_updating && <Spinner size="sm" /> }
                           { state_updateResult === "success" && <Icon as={FaCheckCircle} color="#090" boxSize="1.4em" /> }
                           { state_updateResult === "error" && <Icon as={FaTimesCircle} color="#f00" boxSize="1.4em" /> }
                        </Fragment>
                     ) : (
                        <b>{state_optionVal}</b>
                     )
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