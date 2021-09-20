import {useState,useEffect,useRef,Fragment} from "react";
import axios from "axios";
import Link from "next/link";
import {
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
   NumberDecrementStepper
} from "@chakra-ui/react";

import baskStyles from "../styles/basket.module.scss";

const BasketRow = props => {
   const [state_totalRows,setState_totalRows] = useState( 1 );
   const [state_quantity,setState_quantity] = useState( props.item.quantity );

   let {item} = props;
   let totalRows = 1;
   let optionWidths = [];

   useEffect(()=>{
      console.log("item.options",item.options);
      if ( item.options !== "false" && item.options !== "unknown" ) {
         setState_totalRows(item.options.length + 1);
      }
   },[item.options]);

   useEffect(()=>{
      setState_quantity(item.quantity);
   },[item.quantity]);

   useEffect(()=>{
      let timer = setTimeout(()=>{
         console.log("timer fired,optionWidths:",optionWidths);
      }, 200);

      return ()=>{clearTimeout(timer);}
   },[optionWidths]);

   let handleQuantityChange = async (quantity) => {
      console.log("quantity",quantity);
      setState_quantity(quantity);
   }; // handleQuantityChange

   console.log("there are '" + state_totalRows + "' totalRows");

   return (
      <Fragment>
         <Tr key={item.lineID} className={`darkestGrey ${baskStyles.itemRow}`}>
            <Td rowSpan={state_totalRows}>
               thumbnail
            </Td>
            <Td>
               <p>
                  <Link href={`/page/FF/PROD/${item.code}`}>
                     <a>
                        {item.name}
                        <br /><span className="mediumGrey">#{item.code}</span>
                     </a>
                  </Link>
               </p>
            </Td>
            <Td>
               <p><b>${item.price}</b></p>
            </Td>
            <Td>
               <NumberInput
                  min={1}
                  placeholder="Quantity"
                  value={state_quantity}
                  onChange={handleQuantityChange}
                  width="90px"
               >
                  <NumberInputField placeholder="Quantity" />
                  <NumberInputStepper>
                     <NumberIncrementStepper />
                     <NumberDecrementStepper />
                  </NumberInputStepper>
               </NumberInput>
            </Td>
            <Td>
               {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(state_quantity * item.price))}
            </Td>
            <Td rowSpan={state_totalRows}>
               edit
            </Td>
         </Tr>

         {
            item.options !== "false" && item.options !== "unknown" ?
               item.options.map(option=>{
                  console.log("option",option);
                  return (
                     <Tr key={option.code} className={baskStyles.optionRow}>
                        <Td>
                           <span>{option.code}</span>: <b>{option.value}</b>
                        </Td>
                        <Td>
                           {
                              option.price && <Fragment>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(option.price))}</Fragment>
                           }
                        </Td>
                        <Td></Td>
                        <Td>
                           {
                              option.price && <Fragment>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(state_quantity * option.price))}</Fragment>
                           }
                        </Td>
                     </Tr>
                  );
               })
            : ""
         }
      </Fragment>
   );
};

export default BasketRow;