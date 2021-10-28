import {Fragment,useState,useEffect,useRef} from "react";
import { Box,Button,Select,Icon,HStack,Input } from "@chakra-ui/react";
import { FaRegCheckCircle,FaAngleDown } from 'react-icons/fa';
import axios from "axios";
import Image from 'next/image';

import OptionModal from "./OptionModal";
import IframeModal from "./IframeModal";
import TagPrompt from "./TagPrompt";

const Attribute = props => {
   const [state_modal,setState_modal] = useState(false);
   const [state_value,setState_value] = useState("");
   const [state_selectIcon,setState_selectIcon] = useState(null);
   const [state_disabled,setState_disabled] = useState(false);
   const [state_iframeSource,setState_iframeSource] = useState( false );

   const elRef = useRef();
   const buttonRef = useRef();

   let {domain} = props.globalConfig;
   useEffect(()=>{
      let icon;
      if ( state_value ) {
         icon = <Image src={`https://${domain}/images/misc/greencheck.gif`} alt="check" width="18" height="18" />;
      }
      setState_selectIcon( icon );
   },[state_value,domain]);

   let {attribute,receiveAttributeValue,onChange} = props;
   useEffect(()=>{
      /* it's not intuitive, but miva puts the template code in the code field, and the code in the template code field
      * wtf?? I guess they think of the code as whatever the template is saying the code is. Jesus.
      */
      receiveAttributeValue( state_value, attribute.code, attribute.templateCode );
      if ( attribute.onChange ) {
         onChange( state_value, attribute.onChange, attribute.code, attribute.templateCode );
      }

   },[state_value,receiveAttributeValue,attribute,onChange]);

   useEffect(()=>{
      if ( typeof( props.attribute.disabled ) === "string" ) {
         setState_disabled( props.attribute.disabled === "true" );
      }
   },[props.attribute.disabled]);

   useEffect(()=>{
      // allow iframe modal for whatever reasons we want
      if ( props.product.customFields.MANUFACTURER === "Fashioncraft" ) {
         let permittedSources = [
            "//www.fashioncraft.com"
         ];

         window.openFashioncraftDesignToolModal = href => {
            //console.log("href",href);

            /* IMPORTANT: only use links that point to trusted sources!
            */
            let proceed = false;
            permittedSources.forEach(source=>{
               //console.log("source",source);
               //console.log("href.substr(0,source.length - 1)",href.substr(0,source.length - 1));
               if ( !proceed && href.substr(0,source.length) === source ) {
                  proceed = true;
               }
            });

            //console.log("proceed",proceed);

            if ( proceed ) {
               if ( href.substr(0,5) === "http:" ) {
                  href = `https:${href.substring(5,href.length - 1)}`;
               } else if ( href.substr(0,2) === "//" ) {
                  href = `https:${href}`;
               }

               setState_iframeSource( href );
            }
         }
      }


      return ()=>{
         window.openFashioncraftDesignToolModal = null;
      }
   },[props.product.customFields.MANUFACTURER]);

   let style = {};

   //console.log("attribute props",attribute);

   //console.log("attribute.prompt.substr(0,1)",attribute.prompt.substr(0,1));
   if ( attribute.prompt.substr(0,1) === "{" ) {
      attribute.promptDecoded = JSON.parse( attribute.prompt );
      //console.log("attribute.promptDecoded",attribute.promptDecoded);
      attribute.prompt = attribute.promptDecoded.prompt;
   }

   let renderDecodedPrompt = () => {
      //console.log("prompt",prompt);
      return (
         <Button
            width="90%"
            colorScheme="blue"
            onClick={(event)=>getChoices(event)}
            ref={buttonRef}
         >
            {attribute.prompt}
         </Button>
      );
   }; // renderDecodedPrompt

   let getChoices = async event => {
      event.preventDefault();
      let response = await axios.get(`https://${props.globalConfig.domain}${attribute.previewURL}`);
      if ( response.status ) {
         //console.log("response.data",response.data);
         setState_modal({
            options: response.data,
            title: attribute.prompt
         });
      }
   };

   let setValue = (event,value) => {
      // console.log("event",event);
      // console.log("value",value);
      setState_value( value || event.target.value );
   };

   let handleSelectClick = event => {
      if ( !state_disabled ) {
         // nothing to see here
      } else if ( buttonRef.current ) {
         // pretend they clicked the design button
         buttonRef.current.click();
      }
   }; // handleSelectClick

   let renderAttribute = () => {
      switch( attribute.type ) {
      case "checkbox":
         if ( attribute.code.substr( 0, 13 ) === "ScriptInclude" ) {
            return null;
         } else {
            return null;
         }
         break;
      case "text":
         let maxLength = 30;
         if ( attribute.textLimit ) {
            maxLength = attribute.textLimit;
         }
         let charCountStyle = {
            color: state_value.length < maxLength ? "" : "#f00"
         };

         return (
            <Box>
               {attribute.required || attribute.required === "true" || attribute.required === "1" ?
                  <b>{attribute.prompt}:</b>
               : <Fragment>{attribute.prompt}</Fragment>
               }

               <HStack
                  spacing="4px"
                  width="90%"
                  marginRight="5%"
                  marginLeft="5%"
               >
                  <Input
                     width="58%"
                     ref={elRef}
                     type="text"
                     maxLength={maxLength}
                     value={state_value}
                     onChange={(event)=>setState_value(event.target.value)}
                  />
                  <Box>
                     <span
                        className="blue"
                     >
                        {" "}<span style={charCountStyle}>{state_value.length}</span>{` - ${maxLength} Characters - Max`}
                     </span>
                  </Box>
               </HStack>
            </Box>
         )
         break;
      case "select":
         if ( attribute.hiddenSetting === "hiddenOption" ) {
            style.display = "none";
         }
         return (
            <Box>
               {
                  attribute.previewURL ?
                     renderDecodedPrompt()
                  : (
                     attribute.tagPrompt ?
                        <TagPrompt
                           attribute={attribute}
                           globalConfig={props.globalConfig}
                        />
                     : <div style={{display:"inline",margin:"0px",padding:"0px"}} dangerouslySetInnerHTML={{__html: _.unescape(attribute.prompt)}}></div>
                  )
               }
               <HStack
                  spacing="4px"
                  width="90%"
                  marginRight="5%"
                  marginLeft="5%"
                  onClick={handleSelectClick}
                  style={style}
               >
                  <Select
                     width="90%"
                     name={attribute.code}
                     value={state_value}
                     placeholder="Please Choose"
                     onChange={setValue}
                     ref={elRef}
                     disabled={state_disabled}
                  >
                     {
                        attribute.options.map(option=>{
                           return ( <option key={option.code} value={option.code}>{option.prompt}</option> );
                        })
                     }
                  </Select>
                  {state_selectIcon}
               </HStack>
            </Box>
         );
         break;
      }
   }; // renderAttribute

   return (
      <Fragment>
         {renderAttribute()}
         {
            state_modal !== false &&
            <OptionModal
               globalConfig={props.globalConfig}
               styles={props.styles}
               modal={state_modal}
               setModal={setState_modal}
               setValue={setValue}
               elRef={elRef}
            />
         }
         {
            state_iframeSource && (
               <IframeModal
                  source={state_iframeSource}
                  setSource={setState_iframeSource}
                  globalConfig={props.globalConfig}
                  styles={props.styles}
                  title="Design Your Item"
               />
            )
         }
      </Fragment>
   );


}; // Attribute

export default Attribute;