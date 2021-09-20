import { Fragment,useState,useEffect,useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaCaretRight,FaCaretLeft } from 'react-icons/fa';
import { Icon,Wrap,WrapItem,SimpleGrid,Box,Input,Select } from "@chakra-ui/react";

import ProductThumb from "./ProductThumb";
import config from "../config/config";

import prodListStyles from "../styles/productList.module.scss";

/* 2021-03-02: In a functional component, an event handler can get the state that
* existed at the moment the handler was defined, NOT the current state. That's ridiculous.
* So, we have to use useRef and .current to get the real state. Fucking unbelievable.
* see https://stackoverflow.com/a/62015336/1042398 for where this function came from.
* Also see https://reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function
*/
let useReferredState = (initialValue) => {
   const [state, setState] = useState(initialValue);
   const reference = useRef(state);
   const setReferredState = value => {
      reference.current = value;
      setState(value);
   };
   return [reference, setReferredState];
}; // useReferredState

const ProductListB = (props) => {
   console.log("ProductListB props",props);
   let defaults = {
      paginateAt: 32,
      perPage: 32,
      pageNumber: 1,
      Offset: 0,
      totalPages: 1
   };

   if ( props.queryString.Offset ) {
      defaults.Offset = parseInt(props.queryString.Offset);
      defaults.pageNumber = (defaults.Offset / defaults.paginateAt) + 1;
   }

   const [state_products,setState_products] = useState( props.products );
   const [state_sortedProducts,setState_sortedProducts] = useState( props.products );
   const [state_focusedProducts,setState_focusedProducts] = useState( props.products );

   const [state_paginateAt,setState_paginateAt] = useState( defaults.paginateAt );
   const [state_perPage,setState_perPage] = useReferredState( defaults.paginateAt );
   const [state_pageNumber,setState_pageNumber] = useState( defaults.pageNumber );
   const [state_Offset,setState_Offset] = useReferredState( defaults.Offset );
   const [state_totalPages,setState_totalPages] = useState( defaults.totalPages );
   const [state_paginationLinks,setState_paginationLinks] = useState({
      up: `${props.pathname}?Offset=${defaults.Offset + defaults.paginateAt}`,
      down: "",
      viewAll: ""
   });

   console.log("state_pageNumber",state_pageNumber);
   console.log("state_Offset.current",state_Offset.current);

   const router = useRouter();

   useEffect(()=>{
      // updates the URL in the address bar, AND the pagination links
      console.log("state_perPage.current",state_perPage.current);
      console.log("defaults.perPage",defaults.perPage);

      if ( props.queryString.Per_Page !== defaults.perPage ) {
         /* the only way this changes is if they click view all, in which case
         * pagination and offset are meaningless
         */
         setState_perPage( props.queryString.Per_Page );
         setState_Offset( 0 );
      } else {
         // console.log("useEffect state_paginateAt,state_Offset.current running");
         // console.log("state_paginateAt",state_paginateAt);
         // console.log("state_Offset.current",state_Offset.current);

         let baseURL = window.location.pathname;
         let separators = {
            addressBar: "?",
            up: "?",
            down: "?",
            viewAll: "?"
         };
         let urls = {
            addressBar: baseURL,
            newAs: baseURL,
            up: baseURL,
            down: baseURL,
            viewAll: baseURL
         };

         if ( state_Offset.current > 0 ) {
            urls.addressBar = `${urls.addressBar}${separators.addressBar}Offset=${state_Offset.current}`;
            separators.addressBar = "&";

            urls.up = `${urls.up}${separators.up}Offset=${state_Offset.current + state_paginateAt}`;
            separators.up = "&";

            if ( state_Offset.current > state_paginateAt ) {
               // we're on page 2+
               urls.down = `${urls.down}${separators.down}Offset=${state_Offset.current - state_paginateAt}`;
               separators.down = "&";
            }
         } else {
            urls.up = `${urls.up}${separators.up}Offset=${state_Offset.current + state_paginateAt}`;
            separators.up = "&";
            urls.down = `${urls.baseURL}`;
            separators.down = "?";
         }

         setState_paginationLinks({
            up: urls.up,
            down: urls.down,
            viewAll: urls.viewAll
         });

         if ( urls.addressBar !== window.history.state.as ) {
            // console.log("modifying window.history.state, current:",window.history.state);
            // console.log("new urls:",urls);

            // true false
            if ( true ) {
               /* why this ridiculous pause before changing the URL in the address bar?
               * because this way our scripts run and change the item list immediately. They
               * finish before the pause is complete. Then the address bar changes, and nothing
               * else happens, and it all appears to be lightning fast.
               * BUT if you just go ahead and push the new address, it doesn't let our scripts
               * change the item list until after it re-renders the parent component, which looks
               * slower to the user.
               */
               setTimeout( ()=>{
                  console.log("pushing:",urls.addressBar);
                  router.push( urls.addressBar, urls.addressBar, { shallow: true })
               }, 1000 );

            } else if ( false ) {
               // this works but it's slow because it re-renders the parent component which is a waste of time.
               router.push( urls.newAs, urls.newAs, { shallow: true })
            }
         }
      }
   },[state_paginateAt,state_Offset.current,props.queryString.Per_Page]);


   useEffect(()=>{
      // listen for manual changes of offset, or someone shared the link or reloaded the browser, etc
      // console.log("props.queryString.Offset",props.queryString.Offset);
      // console.log("state_Offset.current",state_Offset.current);
      if ( props.queryString.Offset && props.queryString.Offset !== state_Offset.current ) {
         setState_Offset( props.queryString.Offset );
      }
   }, [props.queryString.Offset]);

   useEffect(()=>{
      // listen for the browser back button and change the product list accordingly
      let popState = (event) => {
         let paramOffset = parseInt(getParameterByName("Offset",event.state.as));
         if ( isNaN( paramOffset ) ) {
            setState_Offset( 0 );
         } else {
            setState_Offset( paramOffset );
         }
      }
      window.addEventListener( "popstate", popState );
      return () => {
         window.removeEventListener( "popstate", popState );
      }
   }, []);

   useEffect(()=>{
      let start = state_Offset.current;
      let end = state_Offset.current + state_paginateAt;
      let pageNumber = state_Offset.current > 0 ? state_Offset.current / state_paginateAt + 1 : 1;

      if ( state_perPage.current !== defaults.perPage ) {
         // the only way this changes is if they click view all.
         start = 0;
         end = state_perPage.current;
         pageNumber = 1;
      }

      setState_focusedProducts( state_sortedProducts.slice(start,end) );
      setState_pageNumber( pageNumber );
   },[state_Offset.current]);

   useEffect(()=>{
      setState_Offset( 0 );
   },[state_perPage.current]);

   useEffect(()=>{
      // console.log("router.query changed");
      // console.log(router.query);
      let queryOffset = parseInt( router.query.Offset );

      if ( queryOffset !== state_Offset.current ) {
         // console.log("setting offset state");
         // console.log("router.query.Offset",router.query.Offset);
         // console.log("state_Offset.current",state_Offset.current);
         // console.log("typeof(state_Offset.current)",typeof(state_Offset.current));
         // console.log("typeof(router.query.Offset)",typeof(router.query.Offset));
         //setState_Offset( router.query.Offset );
      }

      /* 2021-07-16: I ONLY want this to run when the router query has changed. This effect
      * is specifically meant to listen to back/forward clicks on the browser.
      */
      // eslint-disable-next-line react-hooks/exhaustive-deps
   },[router.query]);

   useEffect(()=>{
      if ( state_pageNumber > 1 ) {
         setState_Offset( ( state_pageNumber - 1 ) * state_paginateAt );
      } else {
         setState_Offset( 0 );
      }
   },[state_pageNumber]);

   useEffect(()=>{
      setState_totalPages( Math.ceil( state_products.length / state_paginateAt ) );
   },[state_paginateAt,state_products]);

   let getParameterByName = (name, url = window.location.href ) => {
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
   }

   let pageClick = (direction,event) => {
      event.preventDefault();
      if ( event.currentTarget.getAttribute('href') ) {
         switch( direction ) {
         case "up":
            setState_Offset( state_Offset.current + state_paginateAt );
            break;
         case "down":
            setState_Offset( state_Offset.current - state_paginateAt );
            break;
         }
      }
   };

   let renderPagination = () => {
      let downLinkActive = state_pageNumber > 1;
      let upLinkActive = state_pageNumber < state_totalPages;

      let downStyle = {};
      let upStyle = {};

      if ( upLinkActive ) {
         upStyle.cursor = "pointer";
         upStyle.color = "#F167A8";
      } else {
         upStyle.cursor = "";
         upStyle.color = "#ccc";
      }

      if ( downLinkActive ) {
         downStyle.cursor = "pointer";
         downStyle.color = "#F167A8";
      } else {
         downStyle.cursor = "";
         downStyle.color = "#ccc";
      }

      return (
         <div>
            <p className={prodListStyles.viewAll}>
               <a
                  href={state_paginationLinks.viewAll}
                  onClick={(event)=>{viewAll(event);}}
               >
                  View All ({state_products.length})
               </a>
            </p>
            Page:
            <p style={downStyle}>
               <a
                  href={ downLinkActive ? state_paginationLinks.down : null }
                  onClick={(event)=>{pageClick("down",event)}}
               >
                  <Icon as={FaCaretLeft} />
               </a>
            </p>
            <Input
               type="number"
               placeholder="pageNumber"
               value={state_pageNumber}
               onChange={(event)=>{ pageChange(parseInt(event.target.value)); }}
               min={1}
               max={state_totalPages}
            />
            <p style={upStyle}>
               <a
                  href={ upLinkActive ? state_paginationLinks.up : null }
                  onClick={(event)=>{pageClick("up",event)}}
               >
                  <Icon as={FaCaretRight} />
               </a>
            </p>
         </div>
      );
   }; // renderPagination

   return (
      <Fragment>
         <SimpleGrid
            className={prodListStyles.sortPaginate}
            columns={2}
            spacing={10}
         >
            <Box className={prodListStyles.sort}>
               <label style={{whiteSpace: "nowrap"}}>
                  <Select
                     placeholder="Sort By"
                     height="100%"
                  >
                     <option value="price_asc">Price - Low to High</option>
                     <option value="price_desc">Price - High to Low</option>
                     <option value="BestSelling">Best Selling</option>
                     <option value="Newest">Newest</option>
                  </Select>
               </label>

            </Box>
            <Box className={prodListStyles.paginate}>
               {
                  true ?
                     renderPagination()
                  : ""
               }
            </Box>
         </SimpleGrid>

         <Wrap justify="center">
            {
               state_focusedProducts.map(product=>{
                  return (
                     <WrapItem key={product.code}>
                        <ProductThumb noFloat={true} {...product} />
                     </WrapItem>
                  );
               })
            }
         </Wrap>
      </Fragment>
   );
};

export default ProductListB;