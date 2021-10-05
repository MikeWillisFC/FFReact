import { useSelector } from "react-redux";
import {Fragment,useState,useEffect} from "react";
import { List,ListItem,ListIcon,UnorderedList,Box,HStack,Stack } from "@chakra-ui/react";
import { Collapse } from "@chakra-ui/react"
import { FaCaretRight } from 'react-icons/fa';
import Link from "next/link";

import {formatPrice} from "../../../utilities";

import styles from "../../../styles/leftnav.module.scss";

const Flydown = (props) => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });
   //console.log("Department running, props",props);
   const [state_bestOffers,setState_bestOffers] = useState( [] );
   const [state_basePrices,setState_basePrices] = useState( props.basePrices );
   const [state_flydownStyle,setState_flydownStyle] = useState( {} );


   useEffect(()=>{
      //console.log("useEffect running, props.flydownsVisible:",props.flydownsVisible);
      //setState_flydownStyle( ( props.flydownsVisible ? { height:"100px" } : {} ) );
   },[props.flydownsVisible]);

   useEffect(()=>{
      setState_basePrices( props.basePrices );
   },[props.basePrices]);

   let getBasePrice = code => {
      // console.log("props.basePrices",state_basePrices);
      // console.log("getting base price for code '" + code + "'");
      let result = state_basePrices.filter(price=>price.item.toString() === code.toString());
      // console.log("result",result);
      if ( result.length ) {
         result = formatPrice( parseInt(result[0].basePrice) );
         //result = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(result[0].basePrice));
      } else {
         result = "";
      }
      // console.log("result",result);
      return result;
   };

   return (
      props.flydowns ?
         <Collapse className={styles.flydownMenu} in={props.flydownsVisible} animateOpacity>
            {
               props.flydowns.map(flydown=>{
                     //console.log("flydown",flydown);
                  return (
                     <Link
                        shallow
                        href={flydown.target}
                        key={flydown.target}
                     >
                        {flydown.text}
                     </Link>
                  )
               })
            }
         </Collapse>
      : null
   )
};

export default Flydown;