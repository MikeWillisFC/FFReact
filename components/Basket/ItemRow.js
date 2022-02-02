import {Fragment,useState,useEffect,useRef,useMemo,useCallback} from "react";
import { FaTrashAlt } from 'react-icons/fa';
import { motion,AnimatePresence,useAnimation } from "framer-motion";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
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
   AlertDialogOverlay,
   Tooltip,
} from "@chakra-ui/react";

import OptionRow from "./OptionRow";
import {default as QuantityInput} from "../QuantityEdit/Input";
import QuantityDropdown from "../QuantityEdit/QuantityDropdown";

import {formatPrice} from "../../utilities";

import styles from "../../styles/basket.module.scss";
import tooltipStyles from "../../styles/chakra/tooltip.module.scss";

const ItemRow = props => {
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

   const confirmRemoveCancelRef = useRef();
   const controls = useAnimation();

   let {item,onRemoveItem,quantityIsValid,onQuantityChange} = props;

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
      let waitASec = setTimeout(()=>{
         if ( state_quantity !== state_item.quantity ) {
            onQuantityChange( state_quantity, state_item.lineID );
         }
      },600);
      return ()=>{clearTimeout(waitASec);}
   },[
      state_quantity,
      state_item,
      onQuantityChange
   ]);

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
      if ( props.editable ) {
         if ( state_inputType === "input" ) {
            return (
               <QuantityInput
                  quantity={state_quantity}
                  onChange={handleQuantityChange}
                  minimum={state_minimum.prodMin}
                  enforceMinimum={state_item.customFields.enforceMinimum}
                  samplesPermitted={state_samplesPermitted}
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
      let quantity = eventOrVal.target ? eventOrVal.target.value : eventOrVal;
      setState_quantity(quantity);
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
      setState_quantityValid( qValid );
      setState_item({
         ...state_item,
         quantityIsValid:qValid,
         price:(price || state_item.price)
      })
   },[state_item,quantityIsValid]); // handleQuantityChange

   let receiveWidth = width => {
      //console.log("receiving width:",width);
      optionWidths.push(width);
   }; // receiveWidth

   let handleRemoveItem = () => {
      setState_confirmRemoveIsOpen( true );
   }; // handleRemoveItem

   let handleCancelRemoveItem = () => {
      setState_confirmRemoveIsOpen( false );
   };
   let handleConfirmRemoveItem = () => {
      //console.log("removing");
      controls.start("collapsed");
      setState_rowCollapsing(true);
      //props.onRemoveItem(item.lineID);
      setState_confirmRemoveIsOpen( false );
   };
   let handleRowHideCompleted = useCallback(() => {
      onRemoveItem(state_item.lineID);
   },[onRemoveItem,state_item]);

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
                              src={`https://${props.domain}${state_item.images.thumb.path}`}
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
                        {state_item.name}
                        <br /><span className="mediumGrey">#{state_item.code}</span>
                     </a>
                  </Link>
               </motion.div>
            </Td>
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
            {
               props.editable && (
                  <Td rowSpan={state_totalRows} className={`${styles.editColumn} ${(state_rowCollapsing ? styles.collapsing : '')}`}>
                     <motion.div
                        variants={cellVariants}
                        transition={cellTransition}
                        initial="open"
                        exit="collapsed"
                        animate={controls}
                     >
                        <Button
                           leftIcon={<FaTrashAlt />}
                           variant="solid"
                           onClick={handleRemoveItem}
                           size="xs"
                           style={{border: "1px solid #ccc",backgroundColor:"#fff",color:"#f00"}}
                        >
                           remove
                        </Button>
                     </motion.div>
                  </Td>
               )
            }
         </Tr>

         {
            state_item.options !== "false" && state_item.options !== "unknown" &&
            <Fragment>
               {
                  state_item.options.map(option=>{
                     //console.log("option",option);
                     return (
                        <OptionRow
                           motion={{
                              variants: cellVariants,
                              transition: cellTransition,
                              initial: "open",
                              exit: "collapsed",
                              collapsing: state_rowCollapsing
                           }}
                           editable={props.editable}
                           key={option.code}
                           option={option}
                           quantity={state_quantity}
                           optionWidth={state_optionWidth}
                           receiveWidth={receiveWidth}
                           basketID={props.basketID}
                           lineID={state_item.lineID}
                           domain={props.domain}
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