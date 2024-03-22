import {memo,Fragment,useState,useEffect,useCallback,useRef} from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Box,Button } from "@chakra-ui/react";

import AttributeRow from "./AttributeRow";
import {productFormActions} from "../../store/slices/productForm";
import {addScript} from "../../utilities";

import styles from "../../styles/product.module.scss";

const Attributes = props => {
   const [state_rowIndex,setState_rowIndex] = useState( props.rowIndex || 0 );
   const [state_attributeScripts,setState_attributeScripts] = useState( [] );
   const [state_visibleRows,setState_visibleRows] = useState(0);
   const [state_onChangeVal,setState_onChangeVal] = useState({});

   let hidingOptions = useRef();
   hidingOptions.current = false;
   // console.log("Attributes props",props);

   // destructuring to make useEffect's happy
   let {
      attributes,
      product,
      receiveAttributeValue,
      attributeValidity,
      adjustAttributeValidity
   } = props;

   const dispatch = useDispatch();

   let productForm = useSelector((state)=>{
      return state.productForm;
   });
   // console.log("productForm",productForm);

   // clear any existing attributes
   useEffect(()=>{
      dispatch(productFormActions.clearAttributes());
      return ()=>{dispatch(productFormActions.clearAttributes());}
   },[dispatch]);

   useEffect(()=>{
      // clean up included attribute scripts and whatever crap they might have set
      return ()=>{
         document.querySelectorAll("script[id^='attScript']").forEach(el=>{
            el.remove();
         });
      }
   },[]);

   let attributeIsOpen = useCallback((attribute) => {
      let result = true;
      // console.log(`attributeIsOpen code = '${attribute.code}', hiddenSetting = '${attribute.hiddenSetting}'`);
      if ( attribute.hiddenSetting ) {
         switch( attribute.hiddenSetting ) {
            case "beginHiddenOptions":
               hidingOptions.current = true;
               break;
            case "endHiddenOptions":
               hidingOptions.current = false;
               break;
         }
      }
      // console.log("attributeIsOpen hidingOptions",hidingOptions.current);
      if ( hidingOptions.current || (attribute.hiddenSetting && attribute.hiddenSetting === "hiddenOptionRow") ) {
         result = false;
      }
      // console.log("attributeIsOpen result",result);
      return result;
   },[]); // attributeIsOpen

   useEffect(()=>{
      // console.log("ATTRIBUTES CHANGED");

      let validateAttributes = () => {
         // console.log("validating attributes");
      };

      let visibleRows = 0;
      hidingOptions.current = false;
      productForm.attributes.forEach((attribute,index)=>{
         // console.log("attribute",attribute);
         if ( attribute.type === "checkbox" && attribute.code.substr( 0, 13 ) === "ScriptInclude" ) {
            // ignore it
         } else {
            let isOpen = attributeIsOpen(attribute);
            if ( isOpen ) {
               visibleRows++;
            }
         }

         // // now update validity
         // if ( attribute.required ) {
         //    console.log("attribute '" + attribute.code + "' is required. It's current value is '" + props.attributeValuesRef.current[index].value + "'");
         //    console.log("props.attributeValuesRef.current[index]",props.attributeValuesRef.current[index]);
         // } else {
         //    console.log("attribute '" + attribute.code + "' is NOT required. It's current value is '" + props.attributeValuesRef.current[index].value + "'");
         // }
      });

      // console.log("visibleRows",visibleRows);
      setState_visibleRows(visibleRows);
   },[productForm.attributes,attributeIsOpen]);

   let attributeIsRequired = required => {
      // console.log("attributeIsRequired, required:",required);
      // console.log("attributeIsRequired type:",typeof(required));
      let result = (
         required &&
         required.trim() !== "" &&
         required.trim() !== "0" &&
         required.trim() !== 0 &&
         required.trim() !== "false"
      );
      // console.log("attributeIsRequired, result:",result);
      return result;
   };

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
                  // console.log("prompt",prompt);
                  newAttributes.push({
                     ...att,
                     required: attributeIsRequired(att.required),
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
                     FCDesignTool: prompt.FCDesignTool || false,
                     FCReactDesignTool: prompt.FCReactDesignTool || false
                  });
               });
            } else {
               let prompt = getPrompt(attribute.prompt);
               newAttributes.push({
                  ...attribute,
                  required: attributeIsRequired(attribute.required),
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
			console.log("att",att);
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

      // console.log("-----RUNNING onLoad ACTIONS----");
      let attributesAfterOnLoadActions = [...newAttributes];
      newAttributes.forEach(att=>{
         // console.log("att",att);
         if ( att.onLoad ) {
            // console.log(`${att.code} onLoad:`,att.onLoad);
            att.onLoad.forEach(onLoad=>{
               if ( onLoad.prodTargets ) {
                  // console.log("onLoad.prodTargets",onLoad.prodTargets);
                  // console.log("onLoad prodTargets includes?",onLoad.prodTargets.includes(product.code));
               } else {
                  // console.log("no prodTargets");
               }

               if ( !onLoad.prodTargets || onLoad.prodTargets.includes(product.code) ) {
                  // do it
                  onLoad.targets.forEach(target=>{
                     // console.log("onLoad target",target);
                     attributesAfterOnLoadActions = attributesAfterOnLoadActions.map(focusedAttribute=>{
                        if ( focusedAttribute.code === target ) {
                           // do whatever the action is..
                           // console.log(`running onLoad.action '${onLoad.action}' on focusedAttribute.code '${focusedAttribute.code}'`);
                           // console.log("onLoad",onLoad);
                           if ( onLoad.action === "hide" ) {
                              // console.log("onLoad hiding");
                              focusedAttribute.hiddenSetting = "hiddenOptionRow";
                           } else if ( onLoad.action === "show" ) {
                              // console.log("onLoad showing");
                              focusedAttribute.hiddenSetting = "";
                           }
                           focusedAttribute.required = attributeIsRequired(onLoad.required);
                        }
                        // console.log("onLoad returning focusedAttribute",focusedAttribute);
                        // console.log("onLoad returning focusedAttribute.hiddenSetting",focusedAttribute.hiddenSetting);
                        // console.log("onLoad returning focusedAttribute.required",focusedAttribute.required);
                        return focusedAttribute;
                     });
                  });
               }
            });
         }
      });

      console.log("attributesAfterOnLoadActions",attributesAfterOnLoadActions);
      dispatch(productFormActions.setAttributes(attributesAfterOnLoadActions));

      setState_attributeScripts(attributeScripts);
   },[attributes,product,dispatch]);

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

   let interceptAttributeValue = useCallback(( value, attributeCode, attributeTemplateCode, rowIndex, attributeAttemp_id ) => {
      /* we need to know if the attributes are valid or not, so we intercept
      * their values here before passing to the parent.
      * We also need to know what the rows are, and we may modify them.
      * Do NOT put the rows in the dependency array, or you'll create an infinite loop. Instead,
      * use a setState to get the current value of the rows array, and modify that
      * via the return if need be.
      * Note that we need to check ALL rows, not just the one being changed. That's because
      * changing one row might affect the validity of another row. For example if you choose
      * a design that includes extra personalization text like a year. Then a new text
      * field is revealed that also needs to be validated. For example item DD7684050
      * has a Design option. Some designs include a monogram, and choosing them reveals
      * a new monogram text field that must be filled in.
      */
      receiveAttributeValue( value, attributeCode, attributeTemplateCode, rowIndex, attributeAttemp_id );

   },[receiveAttributeValue]); // interceptAttributeValue

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

                  productForm.attributes.forEach((attribute,index)=>{
                     if ( attribute ) {
                        if ( attribute.code === target ) {
                           if ( action.action === "hide" ) {
                              dispatch(productFormActions.setHiddenSetting({index:index,hiddenSetting:"hiddenOptionRow"}));
                           } else if ( action.action === "show" ) {
                              dispatch(productFormActions.setHiddenSetting({index:index,hiddenSetting:""}));
                           }

                           // blank out any existing value by setting state_onChangeVal, which gets passed down to the attribute
                           setState_onChangeVal({code:attribute.code, val: ""});
                           // and manually trigger our intercept
                           interceptAttributeValue( "", attribute.code, attribute.templateCode, index, attribute.attemp_id );
                           dispatch(productFormActions.setRequired({index:index,required:attributeIsRequired(action.required)}));
                        }
                     }
                  });
               });
            });
         }
      });
   },[dispatch,productForm.attributes,interceptAttributeValue]); // handleChange

   hidingOptions.current = false;
   return (
      <Box className={styles.attributes} data-visiblerows={state_visibleRows}>
         {
            productForm.attributes.length ? (
               productForm.attributes.map((attribute,index)=>{
                  if ( !attribute ) {
                     return null;
                  } else {
                     // console.log("printing attribute",attribute);
                     // console.log("attribute.required",attribute.required);
                     let isOpen = attributeIsOpen(attribute);
                     // console.log("isOpen",isOpen);

                     if ( attribute.type === "checkbox" && attribute.code.substr( 0, 13 ) === "ScriptInclude" ) {
								/* we're building our own version of NPF's FCRDConf.js, because that one uses jQuery etc and is not
								* meant to be embedded in a react app. Our functions will be in FCReactDesignToolPrompt.js
								*/
								if ( attribute.prompt !== "//www.nicepricefavors.com/includes/bundles/dist/FCRDConf.js" ) {
									addScript(attribute.prompt,`attScript|${attribute.prompt}`);
								}
                        return null; // TODO: handle this
                     } else {
                        return (
                           <AttributeRow
                              key={`${attribute.templateCode || ""}${attribute.code}`}
                              rowIndex={index}
                              isOpen={isOpen}
                              attribute={attribute}
                              globalConfig={props.globalConfig}
                              miscModalDisclosure={props.miscModalDisclosure}
                              setMiscModal={props.setMiscModal}
                              onChange={handleChange}
                              product={props.product}
                              receiveAttributeValue={interceptAttributeValue}
                              samplesPermitted={props.samplesPermitted}
                              onChangeVal={state_onChangeVal}
                              highlightInvalids={props.highlightInvalids}
                              attributeValidity={attributeValidity}
                           />
                        )
                     }
                  }
               })
            ) : ""
         }
         {
            state_attributeScripts.map(scrpt=>{
               addScript(scrpt,`attScript|${scrpt}`);
            })
         }
      </Box>
   )
}; // Attributes

export default memo(Attributes);