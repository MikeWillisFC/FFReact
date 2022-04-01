import {Fragment,useState,useEffect,useRef,useMemo,useCallback} from "react";
import { FaTrashAlt,FaTimes,FaCartPlus } from 'react-icons/fa';
import { motion,AnimatePresence,useAnimation } from "framer-motion";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import {
   Button,
   Table,
   Thead,
   Tbody,
   Tr,
   Th,
   Td,
   NumberInput,
   NumberInputField,
   NumberInputStepper,
   NumberIncrementStepper,
   NumberDecrementStepper,
   AlertDialog,
   AlertDialogBody,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogContent,
   AlertDialogOverlay
} from "@chakra-ui/react";

import OptionRow from "./OptionRow";
import {default as QuantityInput} from "../QuantityEdit/Input";
import QuantityDropdown from "../QuantityEdit/QuantityDropdown";

import {quantityIsValid,formatPrice} from "../../utilities";

import styles from "../../styles/basket.module.scss";

const ItemRow = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   const [state_item,setState_item] = useState(props.item);
   const [state_totalRows,setState_totalRows] = useState( 1 );
   const [state_quantity,setState_quantity] = useState( props.item.quantity );
   const [state_quantityValid,setState_quantityValid] = useState(true);
   const [state_quantityFocused,setState_quantityFocused] = useState(false);
   const [state_optionWidth,setState_optionWidth] = useState(false);
   const [state_confirmRemoveIsOpen,setState_confirmRemoveIsOpen] = useState(false);
   const [state_rowCollapsing,setState_rowCollapsing] = useState(false);
   const [state_minimum,setState_minimum] = useState({});
   const [state_samplesPermitted,setState_samplesPermitted] = useState(true);
   const [state_inputType,setState_inputType] = useState("input");
   const [st_confirmingRemove,sst_confirmingRemove] = useState(false);

   const confirmRemoveCancelRef = useRef();
   const controls = useAnimation();

   let {item,onRemoveItem,onQuantityChange} = props;

   let totalRows = 1;
   let optionWidths = useMemo(()=>{
      return [];
   },[]);

   //console.log("props.item",props.item);

   let minQuantityNote = useMemo(()=>{
      let result = `The minimum quantity for this item is ${state_minimum.prodMin}`;
      if ( state_minimum.prodMin > 1 && state_samplesPermitted ) {
         result = `${result}, or 1 for samples`;
      }
      return result;
   },[
      state_minimum.prodMin,
      state_samplesPermitted
   ]);

   // console.log("state_minimum.prodMin",state_minimum.prodMin);
   // console.log("state_samplesPermitted",state_samplesPermitted);
   // console.log("minQuantityNote",minQuantityNote);

   useEffect(()=>{
      let min = item.customFields.minimum ? item.customFields.minimum : ( item.customFields.MINIMUM ? item.customFields.MINIMUM : 1 );
      let minimum = {};
      if ( min.indexOf("^") !== -1 ) {
         min = min.split("^");
         minimum.prodMin = min[0];
         minimum.quantityIncrement = min[1];
         minimum.prodQuantityMax = min[2];
      } else {
         minimum.prodMin = min;
         minimum.quantityIncrement = false;
         minimum.prodQuantityMax = false;
      }
      setState_minimum( minimum );
      if ( minimum.quantityIncrement ) {
         setState_inputType("dropdown");
      } else {
         setState_inputType("input");
      }
      setState_samplesPermitted(()=>{
         if (
            item.customFields.blockSamples.trim() === "1" ||
            item.customFields.blockSamples.trim() === "yes" ||
            (
               item.customFields.hideSampleButton &&
               (
                  item.customFields.hideSampleButton.trim() === "1" ||
                  item.customFields.hideSampleButton.trim() === "yes"
               )
            )
         ) {
            return false;
         } else {
            return true;
         }
      });

      setState_item(item);
   },[item]);

   useEffect(()=>{
      //console.log("item.options",item.options);
      if ( state_item.options !== "false" && state_item.options !== "unknown" ) {
         setState_totalRows(state_item.options.length + 1);
      }
   },[state_item]);

   useEffect(()=>{
      //props.onQuantityValidityChange();
   },[state_quantityValid]);

   useEffect(()=>{
      // let's wait a bit before doing it, in case they're typing
      console.log("quantity or something changed");
      console.log("--state_quantity",state_quantity);
      console.log("--state_item.quantity",state_item.quantity);
      console.log("--state_item.lineID",state_item.lineID);
      let waitASec = setTimeout(()=>{
         if ( state_quantity !== state_item.quantity ) {
            console.log("--CALLING onQuantityChange")
            onQuantityChange( state_quantity, state_item.lineID );
         }
      },600);
      return ()=>{clearTimeout(waitASec);}
   },[
      state_quantity,
      state_item.quantity,
      state_item.lineID,
      onQuantityChange
   ]);

   useEffect(()=>{ console.log("state_quantity changed",state_quantity); },[ state_quantity ]);
   useEffect(()=>{ console.log("state_item.quantity changed",state_item.quantity); },[ state_item.quantity ]);
   useEffect(()=>{ console.log("state_item.lineID changed",state_item.lineID); },[ state_item.lineID ]);
   useEffect(()=>{ console.log("onQuantityChange changed"); },[ onQuantityChange ]);

   useEffect(()=>{
      let timer = setTimeout(()=>{
         //console.log("timer fired,optionWidths:",optionWidths);
         if ( optionWidths.length ) {
            let widest = 0;
            optionWidths.forEach(width=>{
               if ( width > widest ) {
                  widest = width;
               }
            });

            setState_optionWidth(widest + 10);
         }
      }, 200);

      return ()=>{clearTimeout(timer);}
   },[optionWidths]);

   let renderQuantity = () => {
      if ( props.quantityEditable ) {
         if ( state_inputType === "input" ) {
            return (
               <QuantityInput
                  quantity={state_quantity}
                  onChange={handleQuantityChange}
                  minimum={state_minimum.prodMin}
                  enforceMinimum={state_item.customFields.enforceMinimum}
                  samplesPermitted={state_samplesPermitted}
                  size="sm"
                  width="100px"
               />
            );
         } else {
            return (
               <QuantityDropdown
                  quantity={state_quantity}
                  onChange={handleQuantityChange}
                  minimum={state_minimum}
                  enforceMinimum={state_item.customFields.enforceMinimum}
                  samplesPermitted={state_samplesPermitted}
               />
            );
         }
      } else {
         return state_quantity;
      }
   }; // renderQuantity

   let handleQuantityChange = useCallback(eventOrVal => {
      console.log("handleQuantityChange called");
      let quantity = eventOrVal.target ? eventOrVal.target.value : eventOrVal;
      let price = false;
      if ( state_item.volPrices.length ) {
         // console.log("quantity",quantity);
         // console.log("item.volPrices",state_item.volPrices);
         let volPrice = state_item.volPrices.filter(price=>{
            if ( price.high === "0" ) {
               price.high = "9999";
            }
            return parseInt(price.low) <= quantity && parseInt(price.high) >= quantity;
         });
         if ( volPrice.length && volPrice.length === 1 ) {
            price = parseInt(volPrice[0].amount);
         }
      }
      //console.log("price",price);
      let qValid = quantityIsValid({...state_item,quantity:quantity});
      setState_quantity(quantity);
      setState_quantityValid( qValid );
      setState_item({
         ...state_item,
         quantityIsValid:qValid,
         price:(price || state_item.price)
      });
   },[state_item]); // handleQuantityChange

   let receiveWidth = width => {
      //console.log("receiving width:",width);
      optionWidths.push(width);
   }; // receiveWidth

   let handleRemoveItem = () => {
      if ( false ) {
         setState_confirmRemoveIsOpen( true );
      } else {
         sst_confirmingRemove(true);
      }
   }; // handleRemoveItem

   let handleCancelRemoveItem = () => {
      setState_confirmRemoveIsOpen( false );
   };
   let handleConfirmRemoveItem = () => {
      //console.log("removing");
      controls.start("collapsed");
      setState_rowCollapsing(true);
      props.onRemoveItem(item.lineID);
      setState_confirmRemoveIsOpen( false );
   };
   let handleRowHideCompleted = useCallback(() => {
      console.log("handleRowHideCompleted called");
      if ( typeof( onRemoveItem ) === "function" ) {
         console.log("calling onRemoveItem");
         onRemoveItem(state_item.lineID);
      }
   },[
      onRemoveItem,
      state_item
   ]);

   useEffect(()=>{
      if ( state_item.collapse ) {
         controls.start("collapsed");
         setState_rowCollapsing(true);
      }
   },[state_item.collapse,controls]);

   let cellVariants = {
      open: { opacity: 1, height: "auto", margin: 0, padding: 0 },
      collapsed: { opacity: 0, height: 0, margin: 0, padding: 0, overflow:"hidden" }
   };
   let cellTransition = { duration: .8, ease: "easeInOut" };
   //console.log("there are '" + state_totalRows + "' totalRows");

   return (
      <Fragment>
         <AlertDialog
            isOpen={state_confirmRemoveIsOpen}
            leastDestructiveRef={confirmRemoveCancelRef}
            onClose={handleCancelRemoveItem}
            isCentered={true}
         >
            <AlertDialogOverlay>
               <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                     Remove Item
                  </AlertDialogHeader>

                  <AlertDialogBody>
                     Are you sure? You can&apos;t undo this afterwards.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                     <Button ref={confirmRemoveCancelRef} onClick={handleCancelRemoveItem}>
                        Cancel
                     </Button>
                     <Button colorScheme="red" onClick={handleConfirmRemoveItem} ml={3} leftIcon={<FaTrashAlt />}>
                        Remove
                     </Button>
                  </AlertDialogFooter>
               </AlertDialogContent>
            </AlertDialogOverlay>
         </AlertDialog>

         <Tr
            key={state_item.lineID}
            className={`darkestGrey ${styles.itemRow}`}
            data-status={state_item.quantityIsValid ? "" : "error"}
         >
            {
               (props.columns.includes("thumb") && props.columns.includes("Name")) && (
                  <Fragment>
                     <Td rowSpan={state_totalRows} className={`${styles.thumbColumn} ${(state_rowCollapsing ? styles.collapsing : '')}`}>
                        <motion.div
                           variants={cellVariants}
                           transition={cellTransition}
                           initial="open"
                           exit="collapsed"
                           animate={controls}
                           onAnimationComplete={handleRowHideCompleted}
                        >
                           {
                              (state_item.images && state_item.images !== "none") &&
                              <Link href={`/page/FF/PROD/${state_item.code}`}>
                                 <a>
                                    <Image
                                       src={`https://${globalConfig.domain}${state_item.images.thumb.path}`}
                                       width="100"
                                       height="100"
                                       alt={state_item.name}
                                       placeholder="blur"
                                       blurDataURL={state_item.images.thumb.blur}
                                    />
                                 </a>
                              </Link>
                           }
                        </motion.div>
                     </Td>
                     <Td className={`${styles.nameColumn} ${(state_rowCollapsing ? styles.collapsing : '')}`}>
                        <motion.div
                           variants={cellVariants}
                           transition={cellTransition}
                           initial="open"
                           exit="collapsed"
                           animate={controls}
                        >
                           <Link href={`/page/FF/PROD/${state_item.code}`}>
                              <a>
                                 <span dangerouslySetInnerHTML={{__html: _.unescape(state_item.name)}} />
                                 <br /><span className="mediumGrey">#{state_item.code}</span>
                              </a>
                           </Link>
                        </motion.div>
                     </Td>
                  </Fragment>
               )
            }
            {
               props.columns.includes("Price") && (
                  <Td className={`${styles.priceColumn} ${(state_rowCollapsing ? styles.collapsing : '')}`}>
                     <motion.div
                        variants={cellVariants}
                        transition={cellTransition}
                        initial="open"
                        exit="collapsed"
                        animate={controls}
                     >
                        <b>{formatPrice(parseInt(state_item.price))}</b>
                     </motion.div>
                  </Td>
               )
            }
            {
               props.columns.includes("Quantity") && (
                  <Td className={`${styles.qtyColumn} ${(state_rowCollapsing ? styles.collapsing : '')}`}>
                     <motion.div
                        variants={cellVariants}
                        transition={cellTransition}
                        initial="open"
                        exit="collapsed"
                        animate={controls}
                     >
                        {renderQuantity()}
                     </motion.div>
                  </Td>
               )
            }

            {
               props.columns.includes("Date Added") && (
                  <Td className={`${styles.qtyColumn} ${(state_rowCollapsing ? styles.collapsing : '')}`}>
                     <motion.div
                        variants={cellVariants}
                        transition={cellTransition}
                        initial="open"
                        exit="collapsed"
                        animate={controls}
                     >
                        {props.item.dateAdded}
                     </motion.div>
                  </Td>
               )
            }
            {
               props.columns.includes("Total") && (
                  <Td className={`${styles.totalColumn} ${(state_rowCollapsing ? styles.collapsing : '')}`}>
                     <motion.div
                        variants={cellVariants}
                        transition={cellTransition}
                        initial="open"
                        exit="collapsed"
                        animate={controls}
                     >
                        {formatPrice(state_quantity * parseInt(state_item.price))}
                     </motion.div>
                  </Td>
               )
            }
            {
               props.columns.includes("Move To Cart") && (
                  <Td rowSpan={state_totalRows} className={`${styles.editColumn} ${(state_rowCollapsing ? styles.collapsing : '')}`}>
                     <motion.div
                        variants={cellVariants}
                        transition={cellTransition}
                        initial="open"
                        exit="collapsed"
                        animate={controls}
                     >
                        <Button
                           leftIcon={<FaCartPlus size="17px" />}
                           variant="solid"
                           onClick={()=>{
                              props.onMoveToBasket(state_item);
                           }}
                           size="xs"
                           colorScheme="blue"
                        >
                           move to cart
                        </Button>
                     </motion.div>
                  </Td>
               )
            }
            {
               props.columns.includes("Remove") && (
                  <Td rowSpan={state_totalRows} className={`${styles.editColumn} ${(state_rowCollapsing ? styles.collapsing : '')}`}>
                     <motion.div
                        variants={cellVariants}
                        transition={cellTransition}
                        initial="open"
                        exit="collapsed"
                        animate={controls}
                     >
                        {
                           !st_confirmingRemove ? (
                              <Button
                                 leftIcon={<FaTrashAlt />}
                                 variant="solid"
                                 onClick={handleRemoveItem}
                                 size="xs"
                                 style={{border: "1px solid #ccc",backgroundColor:"#fff",color:"#f00"}}
                              >
                                 remove
                              </Button>
                           ) : (
                              <div style={{textAlign:"center"}}>
                                 <Button
                                    leftIcon={<FaTimes />}
                                    variant="outline"
                                    onClick={event=>{sst_confirmingRemove(false);}}
                                    size="xs"
                                    width="100%"
                                    colorScheme="green"
                                 >
                                    cancel
                                 </Button>
                                 <br />
                                 <Button
                                    leftIcon={<FaTrashAlt />}
                                    variant="outline"
                                    onClick={handleConfirmRemoveItem}
                                    size="xs"
                                    width="100%"
                                    style={{color:"#f00",marginTop:"5px"}}
                                 >
                                    confirm
                                 </Button>
                              </div>
                           )
                        }
                     </motion.div>
                  </Td>
               )
            }
         </Tr>

         {
            state_item.options !== "false" && state_item.options !== "unknown" &&
            <Fragment>
               {
                  state_item.options.map((option,index)=>{
                     console.log("option",option);
                     return (
                        <OptionRow
                           motion={{
                              variants: cellVariants,
                              transition: cellTransition,
                              initial: "open",
                              exit: "collapsed",
                              collapsing: state_rowCollapsing
                           }}
                           editable={props.viewType === "shoppingCart"}
                           quantityEditable={props.quantityEditable}
                           key={`${state_item.lineID}|${index}|${option.code}`}
                           option={option}
                           quantity={state_quantity}
                           optionWidth={state_optionWidth}
                           receiveWidth={receiveWidth}
                           basketID={props.basketID || false}
                           lineID={state_item.lineID}
                        />
                     )
                  })
               }
            </Fragment>
         }
      </Fragment>
   );
};

export default ItemRow;