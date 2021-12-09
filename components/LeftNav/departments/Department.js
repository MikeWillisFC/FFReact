/*********** 2021-10-05: NOT IN USE
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*/



import { useSelector } from "react-redux";
import {Fragment,useState,useEffect} from "react";
import { List,ListItem,ListIcon,UnorderedList,Box,HStack,Stack } from "@chakra-ui/react";
import { Collapse } from "@chakra-ui/react"
import { FaCaretRight } from 'react-icons/fa';
import Link from "next/link";

import {formatPrice} from "../../../utilities";

import styles from "../../../styles/leftnav.module.scss";

const Department = (props) => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });
   //console.log("Department running, props",props);
   const [state_flyoutStyle,setState_flyoutStyle] = useState( {} );
   const [state_bestOffers,setState_bestOffers] = useState( [] );
   const [state_basePrices,setState_basePrices] = useState( props.basePrices );
   const [state_flydownStyle,setState_flydownStyle] = useState( {} );
   const [state_flydownHover,setState_flydownHover] = useState( false );

   let {setFlyout} = props;
   useEffect(()=>{
      let justWait = setTimeout(()=>{
         if ( state_flydownHover ) {
            setFlyout(false);
         }
      }, 250);

      return ()=>{ clearTimeout( justWait ); };
   },[state_flydownHover,setFlyout]);

   useEffect(()=>{
      //console.log("useEffect running, props.flydownsVisible:",props.flydownsVisible);
      //setState_flydownStyle( ( props.flydownsVisible ? { height:"100px" } : {} ) );
   },[props.flydownsVisible]);

   useEffect(()=>{
      //console.log("props.flyoutVisible changed, props.flyoutVisible:",props.flyoutVisible);
      let style = props.flyoutVisible ? {
         visibility: "visible",
         opacity: "1"
      } : {
      };

      setState_flyoutStyle( style );
   },[props.flyoutVisible]);

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
      <Fragment>
         {
            props.flydowns &&
            <Collapse in={props.flydownsVisible} animateOpacity>
               <ul
                  onMouseEnter={()=>{setState_flydownHover(true);}}
                  onMouseLeave={()=>{setState_flydownHover(false);}}
               >
                  {
                     props.flydowns.map(flydown=>{
                        //console.log("flydown",flydown);
                        return (
                           <li key={flydown.target}>
                              <Link
                                 href={flydown.target}
                                 onClick={()=>{props.setFlyout(false);}}
                              >
                                 {flydown.text}
                              </Link>
                           </li>
                        )
                     })
                  }
               </ul>
            </Collapse>
         }
         {
            props.flyout &&
            <Fragment>
               <div className={styles.deptPreview} style={state_flyoutStyle}>
                  <p className={styles.borderCover}></p>
                  <div style={{marginLeft:"3px"}} className={styles.linkList}>
                     {
                        props.flyout.links.map(link=>{
                           return (
                              <Link
                                 href={link.target}
                                 key={link.target}
                              >
                                 <a
                                    onClick={()=>{props.setFlyout(false);}}>
                                    <ListIcon as={FaCaretRight} color={props.caretColors.off} />
                                    {link.text}
                                 </a>
                              </Link>
                           )
                        })
                     }
                  </div>
                  {
                     ( props.flyout.featured && props.flyout.featured.length ) ?
                        <Box className={styles.featuredProducts}>
                           <p className={styles.bestOfferText}>Best Offer</p>
                           <Stack>
                              {
                                 props.flyout.featured.map(featured=>{
                                    //console.log("featured",featured);
                                    let basePrice = getBasePrice(featured.code);
                                    if ( !basePrice ) {
                                       return "";
                                    } else {
                                       return (
                                          <Link
                                             key={featured.code}
                                             href={`/page/FF/PROD/${featured.code}`}
                                          >
                                             <a onClick={()=>{props.setFlyout(false);}}>
                                                <HStack>
                                                   <Box className={styles.featuredName}>
                                                      {featured.text}
                                                      <br />
                                                      <span className="darkPink">{basePrice}</span>
                                                   </Box>
                                                   <Box>
                                                      {
                                                         featured.bgPosition !== "" ?
                                                            <span className={styles.bestOfferThumb} style={{backgroundPosition: featured.bgPosition}}></span>
                                                         : ""
                                                      }
                                                   </Box>
                                                </HStack>
                                             </a>
                                          </Link>
                                       );
                                    }
                                 })
                              }
                           </Stack>
                        </Box>
                     : ""
                  }
               </div>
            </Fragment>
         }
      </Fragment>
   )
};

export default Department;