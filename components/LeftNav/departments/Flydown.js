import { useSelector } from "react-redux";
import {Fragment,useState,useEffect} from "react";
import { List,ListItem,ListIcon,UnorderedList,Box,HStack,Stack } from "@chakra-ui/react";
import { Collapse } from "@chakra-ui/react"
import { FaCaretRight } from 'react-icons/fa';
import Link from "next/link";
import { useRouter } from 'next/router';

import {formatPrice} from "../../../utilities";

import styles from "../../../styles/leftnav.module.scss";

const Flydown = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });
   const router = useRouter();

   //console.log("Department running, props",props);
   const [state_bestOffers,setState_bestOffers] = useState( [] );
   const [state_basePrices,setState_basePrices] = useState( props.basePrices );
   const [state_flydownStyle,setState_flydownStyle] = useState( {} );

   useEffect(()=>{
      //console.log("useEffect running, props.flydownsVisible:",props.flydownsVisible);
      //setState_flydownStyle( ( props.flydownsVisible ? { height:"100px" } : {} ) );
   },[props.flydownsVisible]);

   let {flydowns,setOpenedFlydown,linkTarget,openedFlydown} = props;
   useEffect(()=>{
      /* check if any of the child links are the page being viewed. If so,
      * set the opened flydown to the parent link
      * 2021-12-08: this sometimes has the annoying effect of closing a menu and opening
      * another one. For example if a child link is in two flydowns. The user may be looking at
      * flydown A, but since flydown B is the last one that contains the link, it gets opened
      * instead. That's disorienting. So for now I'm turning it off till I think of a better
      * solution.
      */
      flydowns.map(flydown=>{
         if ( flydown.target.replace("/page/FF/CTGY/","") === router.query.code ) {
            //setOpenedFlydown(linkTarget);
         }
      });
   },[flydowns,setOpenedFlydown,linkTarget,router,openedFlydown]);

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
                        <a
                           onClick={event=>{console.log("link clicked",event)}}
                        >
                           {
                              flydown.target.replace("/page/FF/CTGY/","") === router.query.code ?
                                 <b>{flydown.text}</b> : <Fragment>{flydown.text}</Fragment>
                           }
                        </a>
                     </Link>
                  )
               })
            }
         </Collapse>
      : null
   )
};

export default Flydown;