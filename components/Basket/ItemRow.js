import {useState,useEffect,useRef,Fragment} from "react";
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
} from "@chakra-ui/react";

import OptionRow from "./OptionRow";

import {formatPrice} from "../../utilities";

import baskStyles from "../../styles/basket.module.scss";

const ItemRow = props => {
   const [state_totalRows,setState_totalRows] = useState( 1 );
   const [state_quantity,setState_quantity] = useState( props.item.quantity );
   const [state_optionWidth,setState_optionWidth] = useState(false);
   const [state_confirmRemoveIsOpen,setState_confirmRemoveIsOpen] = useState(false);
   const [state_rowCollapsing,setState_rowCollapsing] = useState(false);

   const confirmRemoveCancelRef = useRef();
   const controls = useAnimation();

   let {item} = props;
   let totalRows = 1;
   let optionWidths = [];

   useEffect(()=>{
      //console.log("item.options",item.options);
      if ( item.options !== "false" && item.options !== "unknown" ) {
         setState_totalRows(item.options.length + 1);
      }
   },[item.options]);

   useEffect(()=>{
      setState_quantity(item.quantity);
   },[item.quantity]);

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

   let handleQuantityChange = quantity => {
      props.onQuantityChange( quantity, item.lineID );
   }; // handleQuantityChange

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
   let handleRowHideCompleted = () => {
      props.onRemoveItem(item.lineID);
   };

   let cellVariants = {
      open: { opacity: 1, height: "auto", margin: 0, padding: 0, lineHeight: "auto" },
      collapsed: { opacity: 0, height: 0, margin: 0, padding: 0, lineHeight: 0, overflow:"hidden" }
   };
   let cellTransition = { duration: .8, ease: [0.04, 0.62, 0.23, 0.98] };
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
                     Are you sure? You can't undo this afterwards.
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

         <Tr key={item.lineID} className={`darkestGrey ${baskStyles.itemRow}`}>
            <Td rowSpan={state_totalRows} className={`${baskStyles.thumbColumn} ${(state_rowCollapsing ? baskStyles.collapsing : '')}`}>
               <motion.div
                  variants={cellVariants}
                  transition={cellTransition}
                  initial="open"
                  exit="collapsed"
                  animate={controls}
                  onAnimationComplete={handleRowHideCompleted}
               >
                  {
                     item.images &&
                     <Link href={`/page/FF/PROD/${item.code}`}>
                        <a>
                           <Image
                              src={`https://${props.domain}${item.images.thumb.path}`}
                              width="100"
                              height="100"
                              alt={item.name}
                              placeholder="blur"
                              blurDataURL={item.images.thumb.blur}
                           />
                        </a>
                     </Link>
                  }
               </motion.div>
            </Td>
            <Td className={`${baskStyles.nameColumn} ${(state_rowCollapsing ? baskStyles.collapsing : '')}`}>
               <motion.div
                  variants={cellVariants}
                  transition={cellTransition}
                  initial="open"
                  exit="collapsed"
                  animate={controls}
               >
                  <Link href={`/page/FF/PROD/${item.code}`}>
                     <a>
                        {item.name}
                        <br /><span className="mediumGrey">#{item.code}</span>
                     </a>
                  </Link>
               </motion.div>
            </Td>
            <Td className={`${baskStyles.priceColumn} ${(state_rowCollapsing ? baskStyles.collapsing : '')}`}>
               <motion.div
                  variants={cellVariants}
                  transition={cellTransition}
                  initial="open"
                  exit="collapsed"
                  animate={controls}
               >
                  <b>{formatPrice(parseInt(item.price))}</b>
               </motion.div>
            </Td>
            <Td className={`${baskStyles.qtyColumn} ${(state_rowCollapsing ? baskStyles.collapsing : '')}`}>
               <motion.div
                  variants={cellVariants}
                  transition={cellTransition}
                  initial="open"
                  exit="collapsed"
                  animate={controls}
               >
                  {
                     props.editable ? (
                        <NumberInput
                           min={1}
                           placeholder="Quantity"
                           value={state_quantity}
                           onChange={handleQuantityChange}
                           inputMode="numeric"
                           width="80px"
                           size="xs"
                           margin="0px auto"
                        >
                           <NumberInputField placeholder="Quantity" borderRadius="5px" padding="3px" />
                           <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                           </NumberInputStepper>
                        </NumberInput>
                     ) : (
                        state_quantity
                     )
                  }

               </motion.div>
            </Td>
            <Td className={`${baskStyles.totalColumn} ${(state_rowCollapsing ? baskStyles.collapsing : '')}`}>
               <motion.div
                  variants={cellVariants}
                  transition={cellTransition}
                  initial="open"
                  exit="collapsed"
                  animate={controls}
               >
                  {formatPrice(state_quantity * parseInt(item.price))}
               </motion.div>
            </Td>
            {
               props.editable && (
                  <Td rowSpan={state_totalRows} className={`${baskStyles.editColumn} ${(state_rowCollapsing ? baskStyles.collapsing : '')}`}>
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
            item.options !== "false" && item.options !== "unknown" &&
            <Fragment>
               {
                  item.options.map(option=>{
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
                           lineID={item.lineID}
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