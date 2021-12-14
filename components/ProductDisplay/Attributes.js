import {memo,Fragment,useState,useEffect,useCallback} from "react";
import axios from "axios";
import { Box,Button } from "@chakra-ui/react";

import AttributeRow from "./AttributeRow";

const Attributes = props => {
   console.log("attributes rendering, props:", props);
   const [state_rowVisibility,setState_rowVisibility] = useState( [] );
   const [state_rowIndex,setState_rowIndex] = useState( props.rowIndex || 0 );
   const [state_attributeRows,setState_attributeRows] = useState( [] );
   const [state_attributeScripts,setState_attributeScripts] = useState( [] );

   //console.log("Attributes props",props);

   useEffect(()=>{
      // clean up included attribute scripts and whatever crap they might have set
      return ()=>{
         document.querySelectorAll("script[id^='attScript']").forEach(el=>{
            el.remove();
         });
      }
   },[]);

   useEffect(()=>{
      let attributes = [];
      let hiddenSetting = "";

      if ( props.attributes.length ) {
         props.attributes.forEach(attribute=>{
            if ( attribute.type && attribute.type === "template" ) {
               attribute.attributes.forEach(att=>{
                  let prompt = getPrompt(att.prompt);
                  //console.log("prompt",prompt);
                  attributes.push({
                     ...att,
                     templateCode: attribute.code,
                     attemp_id: attribute.attemp_id,
                     prompt: prompt.prompt,
                     hiddenSetting: prompt.hidden || "",
                     textLength: prompt.textLength || false,
                     previewURL: prompt.previewURL || false,
                     disabled: prompt.disabled || false,
                     onChange: prompt.onChange || false,
                     promptTarget: prompt.promptTarget || false,
                     tagDetails: prompt.tagDetails || false,
                     tagPrompt: prompt.tagPrompt || false,
                     scripts: prompt.scripts || false,
                     iframeModal: prompt.iframeModal || false,
                     FCDesignTool: prompt.FCDesignTool || false
                  });
               });
            } else {
               let prompt = getPrompt(attribute.prompt);
               attributes.push({
                  ...attribute,
                  templateCode: attribute.code,
                  attemp_id: attribute.attemp_id,
                  prompt: prompt.prompt,
                  hiddenSetting: prompt.hidden || "",
                  textLength: prompt.textLength || false,
                  previewURL: prompt.previewURL || false,
                  disabled: prompt.disabled || false,
                  onChange: prompt.onChange || false,
                  promptTarget: prompt.promptTarget || false,
                  tagDetails: prompt.tagDetails || false,
                  tagPrompt: prompt.tagPrompt || false,
                  scripts: prompt.scripts || false,
                  iframeModal: prompt.iframeModal || false,
                  FCDesignTool: prompt.FCDesignTool || false
               });
            }
         });
      }

      //console.log("ATTRIBUTES",attributes);

      let attributeScripts = [];
      attributes.forEach(att=>{
         if ( att.scripts ) {
            att.scripts.forEach(scrpt=>{
               attributeScripts.push(scrpt);
            });
         }
      });

      setState_attributeScripts(attributeScripts);
      setState_attributeRows( attributes );
   },[props.attributes]);

   let getPrompt = prompt => {
      if ( prompt.substr(0,1) === "{" ) {
         return JSON.parse( prompt );
      } else {
         return {prompt:prompt};
      }
   }; // getPrompt

   let handleChange = useCallback((value,onChange,code,templateCode) => {
      // 2021-08-10: this is only called if the attribute has an onChange
      // console.log("handling change");
      // console.log("value",value);
      // console.log("onChange",onChange);

      let changeHandled = false;
      onChange.forEach(change=>{
         let runActions = false;
         if ( typeof(change.values) !== "string" && change.values.includes(value) ) {
            // console.log("VALUE FOUND");
            changeHandled = true;
            runActions = true;
         }

         if ( !changeHandled && typeof(change.values) === "string" && change.values === "DEFAULT" ) {
            // console.log("handling default");
            runActions = true;
         }

         if ( runActions ) {
            change.actions.forEach(action=>{
               action.targets.forEach(target=>{
                  // console.log("target",target);
                  setState_attributeRows( prevState=>{
                     let newState = prevState.map(attribute=>{
                        if ( attribute ) {
                           if ( attribute.code === target ) {
                              // console.log("..match",action);
                              // do whatever the action is..
                              if ( action.action === "hide" ) {
                                 attribute.hiddenSetting = "hiddenOptionRow";
                              } else if ( action.action === "show" ) {
                                 attribute.hiddenSetting = "";
                              }
                              attribute.required = action.required === "true";
                           }
                        }
                        //console.log("attribute",attribute);
                        return attribute;
                     });
                     return newState;
                  });

               });
            });
         }
      });
   },[]); // handleChange

   let hidingOptions = false;

   return (
      <Box className={props.styles.attributes}>
         {
            state_attributeRows.map((attribute,index)=>{
               if ( !attribute ) {
                  return null;
               } else {
                  //console.log("printing attribute",attribute);
                  if ( attribute.hiddenSetting ) {
                     //console.log("hiddenSetting",attribute.hiddenSetting);
                     switch( attribute.hiddenSetting ) {
                        case "beginHiddenOptions":
                           hidingOptions = true;
                           break;
                        case "endHiddenOptions":
                           hidingOptions = false;
                           break;
                     }
                  }

                  let isOpen = true;
                  if ( hidingOptions || (attribute.hiddenSetting && attribute.hiddenSetting === "hiddenOptionRow") ) {
                     isOpen = false;
                  }

                  if ( attribute.type === "checkbox" && attribute.code.substr( 0, 13 ) === "ScriptInclude" ) {
                     return null; // TODO: handle this
                  } else {
                     return (
                        <AttributeRow
                           key={`${attribute.templateCode || ""}${attribute.code}`}
                           rowIndex={index}
                           isOpen={isOpen}
                           attribute={attribute}
                           styles={props.styles}
                           globalConfig={props.globalConfig}
                           miscModalDisclosure={props.miscModalDisclosure}
                           setMiscModal={props.setMiscModal}
                           onChange={handleChange}
                           product={props.product}
                           receiveAttributeValue={props.receiveAttributeValue}
                           blockSamples={props.blockSamples}
                        />
                     )
                  }
               }
            })
         }
         {
            state_attributeScripts.map(scrpt=>{
               /* 2021-08-11: first check if this script has already been added to the dom, perhaps
               * by another product page. If so, remove it
               */
               let existing = document.getElementById(`attScript|${scrpt}`);
               if ( existing ) {
                  existing.remove();
               }

               const script = document.createElement("script");
               script.src = scrpt;
               script.id = `attScript|${scrpt}`;
               script.async = true;
               document.body.appendChild(script);
            })
         }
      </Box>
   )
}; // Attributes

export default memo(Attributes);