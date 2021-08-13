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

const ProductList = (props) => {
   let defaults = {
      paginateAt: 32
   };

   defaults.pageNumber = props.queryString.Offset ? (parseInt(props.queryString.Offset) / defaults.paginateAt) + 1 : 1;

   console.log("defaults.pageNumber",defaults.pageNumber);

   const [state_pageNumber,setState_pageNumber] = useState( defaults.pageNumber );
   const [state_paginateAt,setState_paginateAt] = useState( defaults.paginateAt );
   const [state_perPage,setState_perPage] = useState( defaults.paginateAt );
   const [state_totalPages,setState_totalPages] = useState( null );
   const [state_upLink,setState_upLink] = useState( "" );
   const [state_downLink,setState_downLink] = useState( "" );
   const [state_viewAllLink,setState_viewAllLink] = useState( "" );
   const [state_sortBy,setState_sortBy] = useState( "" );
   const [state_products,setState_products] = useState( props.products );
   const [state_sortedProducts,setState_sortedProducts] = useState( props.products );
   const [state_focusedProducts,setState_focusedProducts] = useState( [] );
   const [state_url,setState_url] = useReferredState("");

   const router = useRouter();

   useEffect(()=>{
      // browser back/forward click
      // TODO: what if user clicks back and exits this path entirely? I think we must manually unmount / mount new?
      //console.log("router.query",router.query);
      console.log("browser back/forward clicked, router.query",router.query);
      let path = window.location.pathname;
      let separator = "?";

      if ( router.query.Sort_By ) {
         path = `${path}${separator}Sort_By=${router.query.Sort_By}`;
         separator = "&";
      } else {
         setState_sortBy( "" );
      }

      let perPage;
      let paginateAt;
      let pageNumber;

      if ( router.query.Per_Page ) {
         paginateAt = parseInt(router.query.Per_Page);
      } else {
         paginateAt = defaults.paginateAt;
      }
      perPage = paginateAt;

      if ( router.query.Offset ) {
         pageNumber = (router.query.Offset / paginateAt) + 1;
      } else {
         pageNumber = 1;
      }

      if ( state_pageNumber !== pageNumber ) {
         setState_pageNumber( pageNumber );
      }
      if ( paginateAt && state_paginateAt !== paginateAt ) {
         setState_paginateAt( paginateAt );
         setState_perPage( paginateAte );
      }
   },[router.query]);

   useEffect(()=>{
      console.log("useEffect state_sortBy",state_sortBy);
      setState_pageNumber( 1 );
   },[state_sortBy]);

   useEffect(()=>{
      /* if paginated at all, send them back to page 1
      */

      /*
      <option value="price_asc">Price - Low to High</option>
      <option value="price_desc">Price - High to Low</option>
      <option value="BestSelling">Best Selling</option>
      <option value="Newest">Newest</option>
      */

      console.log("useEffect state_sortBy state_products",state_sortBy);

      let sortedProducts = [...state_products];
      if ( state_sortBy !== "" ) {
         //console.log("sorting...");
         sortedProducts.sort( (prodA,prodB)=>{
            //console.log("comparing",prodA.basePrice,prodB.basePrice);
            switch(state_sortBy) {
            case "price_asc":
               return parseFloat(prodA.basePrice) < parseFloat(prodB.basePrice) ? -1 : 1;
               break;
            case "price_desc":
               return parseFloat(prodA.basePrice) > parseFloat(prodB.basePrice) ? -1 : 1;
               break;
            }
         });
      } else {
         //console.log("not sorting, no need");
      }
      setState_sortedProducts( sortedProducts );

      // also update URL and view all link. Per_Page and Offset always go before Sort_By
      let viewAllLink = `${window.location.pathname}?Per_Page=${state_products.length}`;
      let url = `${window.location.pathname}`;
      let separator = "?";
      if ( state_perPage !== defaults.paginateAt ) {
         url = `${url}${separator}Per_Page=${state_perPage}`;
         separator = "&";
      }
      if ( state_sortBy !== "" ) {
         url = `${url}${separator}Sort_By=${state_sortBy}`;
         viewAllLink = `${viewAllLink}&Sort_By=${state_sortBy}`;
      }

      //console.log("new url = '" + url + "'");
      //console.log("new viewAllLink = '" + viewAllLink + "'");
      setRoute( {url:url} );
      setState_viewAllLink( viewAllLink );
   },[state_sortBy,state_products]);

   useEffect(()=>{
      //console.log("state_url.current",state_url.current);
      if ( state_url.current !== "" ) {
         router.push( state_url.current, undefined, { shallow: true });
      }
   },[state_url.current]);

   useEffect(()=>{
      setState_products( props.products );
   },[props.products]);

   useEffect(()=>{
      //console.log("setting focused products");
      setState_focusedProducts( state_sortedProducts.slice( 0, state_paginateAt ) );
   },[state_sortedProducts,state_paginateAt]);

   useEffect(()=>{
      /* pagination stuff: choose the slice of products to display, and set the up/down page links
      */
      //console.log("useEffect state_pageNumber = '" + state_pageNumber + "'");
      let start = 0;
      let end = state_paginateAt;

      let upLink = `${window.location.pathname}`;
      let downLink = `${window.location.pathname}`;
      let downSeparator = "?";

      if ( state_pageNumber === 1 ) {
         upLink = `${window.location.pathname}?Offset=${state_paginateAt}`;
      } else if ( state_pageNumber > 1 ) {
         start = (state_pageNumber - 1) * state_paginateAt;
         end = state_paginateAt * state_pageNumber;

         upLink = `${window.location.pathname}?Offset=${end}`;

         if ( state_pageNumber > 2 ) {
            downLink = `${downLink}${downSeparator}Offset=${(state_pageNumber - 2) * state_paginateAt}`;
            downSeparator = "&";
         }
      }

      if ( state_sortBy !== "" ) {
         upLink = `${upLink}&Sort_By=${state_sortBy}`;
         downLink = `${downLink}${downSeparator}Sort_By=${state_sortBy}`;
      }

      setState_upLink( upLink );
      setState_downLink( downLink );
      setState_focusedProducts( state_sortedProducts.slice(start,end) );
   },[state_pageNumber,state_paginateAt,state_products,state_sortBy]);

   useEffect(()=>{
      setState_totalPages( Math.ceil( state_products.length / state_paginateAt ) );
   },[state_paginateAt,state_products]);

   useEffect(()=>{
      setState_viewAllLink( `${window.location.pathname}?Per_Page=${state_products.length}` );
   },[state_products]);

   let setRoute = ( opts ) => {
      //console.log("setRoute opts",opts);
      if ( opts.url ) {
         setState_url( opts.url );
      }
   };

   let pageChange = ( pageNumber ) => {
      if ( pageNumber < 1 ) {
         pageNumber = 1;
      } else if ( pageNumber > state_totalPages ) {
         pageNumber = state_totalPages;
      }
      let newURL;
      if ( pageNumber > 1 ) {
         let offset = (pageNumber - 1) * state_paginateAt;
         newURL = `${window.location.pathname}?Offset=${offset}`;
      } else {
         newURL = `${window.location.pathname}`;
      }
      setRoute( {url: newURL} );
      setState_pageNumber( pageNumber );
   };

   let pageClick = ( direction, event ) => {
      // console.log("pageClick '" + direction + "', event:",event);
      // console.log("state_pageNumber",state_pageNumber);
      // console.log("state_totalPages",state_totalPages);
      // console.log("event.currentTarget",event.currentTarget);
      // console.log("event.currentTarget.getAttribute('href')",event.currentTarget.getAttribute('href'));

      event.preventDefault();
      // next comment tells eslint to ignore the default case rule
      // eslint-disable-next-line
      if ( event.currentTarget.getAttribute('href') ) {
         switch( direction ) {
         case "up":
            if ( (state_pageNumber + 1) <= state_totalPages ) {
               setRoute( {url: event.currentTarget.getAttribute('href')} );
               setState_pageNumber( prevState=>{
                  let newState = prevState + 1;
                  return newState;
               });
            }
            break;
         case "down":
            if ( state_pageNumber - 1 > 0 ) {
               setRoute( {url: event.currentTarget.getAttribute('href')} );
               setState_pageNumber( prevState=>{
                  let newState = prevState - 1;
                  return newState;
               });
            }
            break;
         }
      }
   }; // pageClick

   let viewAll = ( event ) => {
      event.preventDefault();
      setState_paginateAt(state_products.length);
      setState_pageNumber(1);
      setRoute( {url: event.currentTarget.getAttribute('href')} );
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
                  href={state_viewAllLink}
                  onClick={(event)=>{viewAll(event);}}
               >
                  View All ({state_products.length})
               </a>
            </p>
            Page:
            <p style={downStyle}>
               <a
                  href={ downLinkActive ? state_downLink : null }
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
                  href={ upLinkActive ? state_upLink : null }
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
                     value={state_sortBy}
                     onChange={(event)=>{setState_sortBy(event.target.value)}}
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
                  state_totalPages > 1 ?
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

export default ProductList;