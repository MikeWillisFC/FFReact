import {Fragment,useState,useEffect,useRef,useCallback} from "react";
import { Box,Button,Select,Icon,HStack,Input,Checkbox,Tag,TagLeftIcon,TagLabel,Textarea } from "@chakra-ui/react";
import { FaRegCheckCircle,FaAngleDown,FaInfoCircle } from 'react-icons/fa';
import axios from "axios";
import Image from 'next/image';
import _ from "lodash";

import OptionModal from "./OptionModal";
import IframeModal from "./IframeModal";
import TagPrompt from "./TagPrompt";
import CheckboxAttribute from "./AttributeFields/CheckboxAttribute";
import FCDesignToolPrompt from "./FCDesignToolPrompt";
import { openMiscModal } from "../../utilities";

const Attribute = props => {
   const [state_modal,setState_modal] = useState(false);
   const [state_value,setState_value] = useState("");
   const [state_selectIcon,setState_selectIcon] = useState(null);
   const [state_disabled,setState_disabled] = useState(false);
   const [state_iframeSource,setState_iframeSource] = useState( false );

   console.log("Attribute rendering, props:",props);
   const elRef = useRef();
   const buttonRef = useRef();

   let {domain} = props.globalConfig;
   let {
      attribute,
      receiveAttributeValue,
      onChange,
      samplesPermitted,
      rowIndex,
      setMiscModal,
      miscModalDisclosure
   } = props;

   useEffect(()=>{
      let icon;
      if ( state_value ) {
         icon = <Image src={`https://${domain}/images/misc/greencheck.gif`} alt="check" width="18" height="18" />;
      }
      setState_selectIcon( icon );
   },[state_value,domain]);

   useEffect(()=>{
      // console.log("Attribute useEffect running");
      /* it's not intuitive, but miva puts the template code in the code field, and the code in the template code field
      * wtf?? I guess they think of the code as whatever the template is saying the code is. Jesus.
      */
      //console.log("attribute",attribute);
      receiveAttributeValue( state_value, attribute.code, attribute.templateCode, rowIndex, attribute.attemp_id );
      if ( attribute.onChange ) {
         onChange( state_value, attribute.onChange, attribute.code, attribute.templateCode );
      }
   },[
      state_value,
      receiveAttributeValue,
      attribute.code,
      attribute.templateCode,
      attribute.onChange,
      attribute.attemp_id,
      onChange,
      rowIndex
   ]);
   // useEffect(()=>{console.log("state_value changed",state_value);},[state_value]);
   // useEffect(()=>{console.log("receiveAttributeValue changed",receiveAttributeValue);},[receiveAttributeValue]);
   // useEffect(()=>{console.log("attribute changed",attribute);},[attribute]);
   // useEffect(()=>{console.log("onChange changed",onChange);},[onChange]);

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

   // console.log("attribute.prompt",attribute.prompt);
   // console.log("attribute.prompt.substr(0,1)",attribute.prompt.substr(0,1));
   if ( attribute.prompt.substr(0,1) === "{" ) {
      attribute.promptDecoded = JSON.parse( attribute.prompt );
      // console.log("attribute.promptDecoded",attribute.promptDecoded);
      attribute.prompt = attribute.promptDecoded.prompt;
   }

   let renderDecodedPrompt = useCallback(() => {
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
   },[getChoices,attribute.prompt]); // renderDecodedPrompt

   let _getChoices = _.memoize(async (get) => {
      return await axios.get(`https://${props.globalConfig.domain}${attribute.previewURL}`);
   });
   let getChoices = useCallback(async (event) => {
      event.preventDefault();
      let response = await _getChoices(`https://${domain}${attribute.previewURL}`);
      if ( response.status ) {
         //console.log("response.data",response.data);
         setState_modal({
            options: response.data,
            title: attribute.prompt
         });
      }
   },[
      domain,
      attribute.previewURL,
      _getChoices,
      attribute.prompt
   ]); // getChoices

   let setValue = useCallback((event,value) => {
      // console.log("setValue called");
      // console.log("event",event);
      // console.log("value",value);
      setState_value( value || (event ? event.target.value : "") );
   },[]);

   let handleSelectClick = useCallback(event => {
      //console.log("handleSelectClick called");
      if ( !state_disabled ) {
         // nothing to see here
      } else if ( buttonRef.current ) {
         // pretend they clicked the design button
         buttonRef.current.click();
      }
   },[
      state_disabled,
      //buttonRef.current // Mutable values like 'buttonRef.current' aren't valid dependencies because mutating them doesn't re-render the component.
   ]); // handleSelectClick

   let renderAttribute = useCallback(() => {
      //console.log("renderAttribute attribute",attribute);
      let style = {};

      let handleInfoClick = (event,title,url) => {
         event.preventDefault();
         openMiscModal({
            setModal: setMiscModal,
            disclosure: miscModalDisclosure,
            title: title,
            href: url,
            size: "xl"
         });
      };

      switch( attribute.type ) {
      case "checkbox":
         if ( attribute.code.substr( 0, 13 ) === "ScriptInclude" ) {
            return null;
         } else {
            return (
               <CheckboxAttribute
                  styles={props.styles}
                  attribute={attribute}
                  onChange={setValue}
               />
            );
         }
         break;
      case "textarea":
      case "memo":
         let textAreaMaxLength = 30;
         if ( attribute.textLimit ) {
            textAreaMaxLength = attribute.textLimit;
         }
         let textAreaCharCountStyle = {
            color: state_value.length < textAreaMaxLength ? "" : "#f00"
         };
         return (
            <Box>
               { attribute.prePrompt || "" }
               {
                  (
                     attribute.required ||
                     attribute.required === "true" ||
                     attribute.required === "1"
                  ) ? (
                     <b>{attribute.prompt}:</b>
                  ) : (
                     <Fragment>{attribute.prompt}</Fragment>
                  )
               }

               <HStack
                  spacing="4px"
                  width="90%"
                  marginRight="5%"
                  marginLeft="5%"
               >
                  <Textarea
                     data-code={attribute.code}
                     width="58%"
                     ref={elRef}
                     maxLength={textAreaMaxLength}
                     value={state_value}
                     onChange={(event)=>setState_value(event.target.value)}
                  />
                  <Box>
                     <span
                        className="blue"
                     >
                        {" "}<span style={textAreaCharCountStyle}>{state_value.length}</span>{` - ${textAreaMaxLength} Characters - Max`}
                     </span>
                  </Box>
               </HStack>
            </Box>
         );
         break;
      case "text":
         let maxLength = 30;
         if ( attribute.textLimit ) {
            maxLength = attribute.textLimit;
         }
         let charCountStyle = {
            color: state_value.length < maxLength ? "" : "#f00"
         };

         if ( attribute.code === "DesignID" ) {
            window.FashioncraftDesignIDSelector = "input[data-code='DesignID']";
         }

         return (
            <Box>
               { attribute.prePrompt || "" }
               {
                  (
                     attribute.required ||
                     attribute.required === "true" ||
                     attribute.required === "1"
                  ) ? (
                     <b>{attribute.prompt}:</b>
                  ) : (
                     <Fragment>{attribute.prompt}</Fragment>
                  )
               }

               <HStack
                  spacing="4px"
                  width="90%"
                  marginRight="5%"
                  marginLeft="5%"
               >
                  <Input
                     data-code={attribute.code}
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
         );
         break;
      case "select":
         if ( attribute.hiddenSetting === "hiddenOption" ) {
            style.display = "none";
         }
         let defaultStyle = {display:"inline",margin:"0px",padding:"0px"};
         if (
            attribute.required ||
            attribute.required === "true" ||
            attribute.required === "1"
         ) {
            defaultStyle.fontWeight = "bold" ;
         }
         return (
            <Box>
               { attribute.prePrompt || "" }
               {
                  attribute.previewURL ? (
                     renderDecodedPrompt()
                  ) : (
                     attribute.tagPrompt ? (
                        <TagPrompt
                           attribute={attribute}
                           globalConfig={props.globalConfig}
                        />
                     ) : (
                        attribute.FCDesignTool ? (
                           <FCDesignToolPrompt
                              attribute={attribute}
                              globalConfig={props.globalConfig}
                           />
                        ) : (
                           <div style={defaultStyle} dangerouslySetInnerHTML={{__html: _.unescape(attribute.prompt)}}></div>
                        )
                     )
                  )
               }
               {
                  attribute.info && (
                     <Fragment>
                        {" "}
                        <Tag
                           colorScheme='teal'
                           className={props.styles.infoLink}
                           onClick={event=>handleInfoClick(event,attribute.info.title,`https://${props.globalConfig.domain}${attribute.info.url}`)}
                        >
                           <Icon as={FaInfoCircle} />
                           {" "}
                           <TagLabel>{attribute.info.prompt}</TagLabel>
                        </Tag>
                     </Fragment>
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
                           if ( !samplesPermitted && option.code.toLowerCase() === "sample" ) {
                              return "";
                           } else {
                              return ( <option key={option.code} value={option.code}>{option.prompt}</option> );
                           }
                        })
                     }
                  </Select>
                  {state_selectIcon}
               </HStack>
            </Box>
         );
         break;
      }
   },[
      attribute,
      elRef,
      state_value,
      renderDecodedPrompt,
      handleSelectClick,
      setValue,
      samplesPermitted,
      state_selectIcon,
      props.globalConfig,
      state_disabled,
      setMiscModal,
      miscModalDisclosure,
      props.styles
   ]); // renderAttribute

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