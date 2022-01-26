import {memo,Fragment,useState,useEffect,useCallback} from "react";
import axios from "axios";
import { Box,Button } from "@chakra-ui/react";

import AttributeRow from "./AttributeRow";

import styles from "../../styles/product.module.scss";

const Attributes = props => {
   const [state_rowIndex,setState_rowIndex] = useState( props.rowIndex || 0 );
   const [state_attributeRows,setState_attributeRows] = useState( [] );
   const [state_attributeScripts,setState_attributeScripts] = useState( [] );
   const [state_visibleRows,setState_visibleRows] = useState(0);

   console.log("Attributes props",props);

   // destructuring to make useEffect's happy
   let {
      attributes,
      product
   } = props;

   useEffect(()=>{
      // clean up included attribute scripts and whatever crap they might have set
      return ()=>{
         document.querySelectorAll("script[id^='attScript']").forEach(el=>{
            el.remove();
         });
      }
   },[]);

   useEffect(()=>{
      let visibleRows = 0;
      let hidingOptions;
      state_attributeRows.forEach(attribute=>{
         if ( attribute.type === "checkbox" && attribute.code.substr( 0, 13 ) === "ScriptInclude" ) {
            // ignore it
         } else {
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

            if ( isOpen ) {
               visibleRows++;
            }
         }
      });
      setState_visibleRows(visibleRows);
   },[state_attributeRows]);

   useEffect(()=>{
      let pAttributes = [...attributes]; // this is props.attributes
      let newAttributes = [];
      let hiddenSetting = "";

      if ( pAttributes.length ) {
         // console.log("pAttributes",pAttributes);
         pAttributes.forEach(attribute=>{
            if ( attribute.type && attribute.type === "template" ) {
               attribute.attributes.forEach(att=>{
                  let prompt = getPrompt(att.prompt);
                  console.log("prompt",prompt);
                  newAttributes.push({
                     ...att,
                     templateCode: attribute.code,
                     attemp_id: attribute.attemp_id,
                     prompt: prompt.prompt,
                     prePrompt:prompt.prePrompt || false,
                     info: prompt.info || false,
                     hiddenSetting: prompt.hidden || "",
                     textLimit: prompt.textLimit|| false,
                     previewURL: prompt.previewURL || false,
                     disabled: prompt.disabled || false,
                     onChange: prompt.onChange || false,
                     onLoad: prompt.onLoad || false,
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
               newAttributes.push({
                  ...attribute,
                  templateCode: attribute.code,
                  attemp_id: attribute.attemp_id,
                  prompt: prompt.prompt,
                  prePrompt:prompt.prePrompt || false,
                  info: prompt.info || false,
                  hiddenSetting: prompt.hidden || "",
                  textLimit: prompt.textLimit || false,
                  previewURL: prompt.previewURL || false,
                  disabled: prompt.disabled || false,
                  onChange: prompt.onChange || false,
                  onLoad: prompt.onLoad || false,
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

      // console.log("newAttributes",newAttributes);

      let attributeScripts = [];
      let hideRemainingOptions = false;
      newAttributes.forEach(att=>{
         if ( att.scripts ) {
            att.scripts.forEach(scrpt=>{
               attributeScripts.push(scrpt);
            });
         }
         if ( hideRemainingOptions ) {
            att.hiddenSetting = "hiddenOptionRow";
         } else if ( att.hiddenSetting ) {
            switch( att.hiddenSetting ) {
            case "hideRemainingOptions":
               hideRemainingOptions = true;
               break;
            }
         }
      });

      // console.log("-----RUNNING ONLOAD ACTIONS----");
      let attributesAfterOnLoadActions = [...newAttributes];
      newAttributes.forEach(att=>{
         // console.log("att",att);
         if ( att.onLoad ) {
            att.onLoad.forEach(onLoad=>{
               if ( onLoad.prodTargets ) {
                  // console.log("onLoad.prodTargets",onLoad.prodTargets);
                  // console.log("prodTargets includes?",onLoad.prodTargets.includes(product.code));
               } else {
                  // console.log("no prodTargets");
               }

               if ( !onLoad.prodTargets || onLoad.prodTargets.includes(product.code) ) {
                  // do it
                  onLoad.targets.forEach(target=>{
                     attributesAfterOnLoadActions = attributesAfterOnLoadActions.map(focusedAttribute=>{
                        if ( focusedAttribute.code === target ) {
                           // do whatever the action is..
                           // console.log(`running onLoad.action '${onLoad.action}' on focusedAttribute.code '${focusedAttribute.code}'`);
                           if ( onLoad.action === "hide" ) {
                              // console.log("hiding");
                              focusedAttribute.hiddenSetting = "hiddenOptionRow";
                           } else if ( onLoad.action === "show" ) {
                              // console.log("showing");
                              focusedAttribute.hiddenSetting = "";
                           }
                           focusedAttribute.required = onLoad.action.required === "true";
                        }
                        // console.log("returning focusedAttribute",focusedAttribute);
                        // console.log("returning focusedAttribute.hiddenSetting",focusedAttribute.hiddenSetting);
                        return focusedAttribute;
                     });
                  });
               }
            });
         }
      });

      // console.log("attributesAfterOnLoadActions",attributesAfterOnLoadActions);
      // console.log("attributesAfterOnLoadActions[0].hiddenSetting",attributesAfterOnLoadActions[0].hiddenSetting);
      setState_attributeScripts(attributeScripts);
      setState_attributeRows( attributesAfterOnLoadActions );
   },[attributes,product]);

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

   let handleChange = useCallback((value,onChange,code,templateCode) => {
      // 2021-08-10: this is only called if the attribute has an onChange
      console.log("handling change");
      console.log("value",value);
      console.log("onChange",onChange);

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
      <Box className={styles.attributes} data-visiblerows={state_visibleRows}>
         {
            state_attributeRows.map((attribute,index)=>{
               if ( !attribute ) {
                  return null;
               } else {
                  console.log("printing attribute",attribute);
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

                  // console.log("hidingOptions",hidingOptions);
                  // console.log("isOpen",isOpen);

                  if ( attribute.type === "checkbox" && attribute.code.substr( 0, 13 ) === "ScriptInclude" ) {
                     return null; // TODO: handle this
                  } else {
                     return (
                        <AttributeRow
                           key={`${attribute.templateCode || ""}${attribute.code}`}
                           rowIndex={index}
                           isOpen={isOpen}
                           attribute={attribute}
                           styles={styles}
                           globalConfig={props.globalConfig}
                           miscModalDisclosure={props.miscModalDisclosure}
                           setMiscModal={props.setMiscModal}
                           onChange={handleChange}
                           product={props.product}
                           receiveAttributeValue={props.receiveAttributeValue}
                           samplesPermitted={props.samplesPermitted}
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