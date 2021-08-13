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

let getParameterByName = (name, url = window.location.href ) => {
   name = name.replace(/[\[\]]/g, '\\$&');
   var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
   results = regex.exec(url);
   if (!results) return null;
   if (!results[2]) return '';
   return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const ProductListC = (props) => {
   console.log("ProductListC props",props);
   let defaults = {
      paginateAt: 32,
      perPage: null,
      pageNumber: 1,
      Offset: 0,
      totalPages: 1,
      sortBy: ""
   };

   const [state_totalPages,setState_totalPages] = useState( defaults.totalPages );
   const [state_paginateAt,setState_paginateAt] = useState( defaults.paginateAt );
   const [state_products,setState_products] = useState( [] );
   const [state_sortedProducts,setState_sortedProducts] = useState( [] );
   const [state_focusedProducts,setState_focusedProducts] = useState( state_products.slice(0,defaults.paginateAt) );
   const [state_pageNumber,setState_pageNumber] = useState( defaults.pageNumber );
   const [state_Offset,setState_Offset] = useReferredState( defaults.Offset );
   const [state_perPage,setState_perPage] = useReferredState( defaults.perPage );
   const [state_sortBy,setState_sortBy] = useReferredState( defaults.sortBy );

   const [state_paginationLinks,setState_paginationLinks] = useState({
      up: `${props.pathname}?Offset=${defaults.Offset + defaults.paginateAt}`,
      down: "",
      viewAll: ""
   });

   const router = useRouter();

   useEffect(()=>{
      console.log("useEffect products",props.products);
      setState_products(props.products);
      setState_sortedProducts(props.products);
   }, [props.products]);

   useEffect(()=>{
      // handles back/forward browser button clicks
      let popListener = event => {
         // console.log("popstate detected");
         // console.log(event);
         // console.log(event.state.as);

         let Offset = parseInt(getParameterByName( "Offset", event.state.as ));
         let Per_Page = parseInt(getParameterByName( "Per_Page", event.state.as ));
         let Sort_By = getParameterByName( "Sort_By", event.state.as );

         // console.log("Offset",Offset);
         // console.log("Per_Page",Per_Page);
         // console.log("Sort_By",Sort_By);
         //
         // console.log("state_Offset",state_Offset.current);
         // console.log("state_perPage",state_perPage.current);
         // console.log("state_sortBy",state_sortBy.current);

         setState_Offset( Offset );
         if ( Per_Page ) {
            setState_perPage( Per_Page );
         } else {
            setState_perPage( defaults.perPage );
         }
         if ( Sort_By ) {
            setState_sortBy( Sort_By );
         } else {
            setState_sortBy( defaults.sortBy );
         }
      }
      window.addEventListener('popstate', popListener, false);

      return () => {
         window.removeEventListener('popstate', popListener);
      }
   },[]);

   useEffect(()=>{
      setState_totalPages( Math.ceil( state_products.length / state_paginateAt ) );
   },[state_paginateAt,state_products]);

   useEffect(()=>{
      // handles sortBy change
      console.log("state_sortBy useEffect called:",state_sortBy.current);
      let sortedProducts = [...state_products];
      if ( state_sortBy.current !== "" ) {
         //console.log("sorting...");
         sortedProducts.sort( (prodA,prodB)=>{
            //console.log("comparing",prodA.basePrice,prodB.basePrice);
            switch(state_sortBy.current) {
            case "price_asc":
               return parseFloat(prodA.basePrice) < parseFloat(prodB.basePrice) ? -1 : 1;
               break;
            case "price_desc":
               return parseFloat(prodA.basePrice) > parseFloat(prodB.basePrice) ? -1 : 1;
               break;
            case "newest":
               return parseInt(prodA.id) > parseInt(prodB.id) ? -1 : 1;
               break;
            case "bestsellers":
               return parseInt(prodA.sr) < parseInt(prodB.sr) ? -1 : 1;
               break;
            default:
               return parseInt(prodA.ds) > parseInt(prodB.ds) ? -1 : 1;
               break;
            }
         });
      } else {
         //console.log("not sorting, no need");
      }

      let end = defaults.paginateAt;
      if ( state_perPage.current !== defaults.perPage ) {
         // the only way this changes is if they click view all.
         end = state_perPage.current;
      }
      setState_sortedProducts( sortedProducts );
      setState_focusedProducts( sortedProducts.slice( 0, end ) );
      if ( state_Offset.current !== 0 ) {
         setState_Offset( 0 );
      }
      updateAddressBar({
         Offset: 0,
         Per_Page: state_perPage.current,
         Sort_By: state_sortBy.current
      });
   },[state_products,state_sortBy.current]);

   useEffect(()=>{
      // handles query string changes
      let links = {
         up: window.location.pathname,
         down: window.location.pathname,
         viewAll: window.location.pathname
      };
      let separators = {
         up: "?",
         down: "?",
         viewAll: "?"
      };

      if ( props.queryString.Sort_By ) {
         links.up = `${links.up}${separators.up}Sort_By=${props.queryString.Sort_By}`;
         links.down = `${links.down}${separators.down}Sort_By=${props.queryString.Sort_By}`;
         links.viewAll = `${links.viewAll}${separators.viewAll}Sort_By=${props.queryString.Sort_By}`;
         separators.up = "&";
         separators.down = "&";
         separators.viewAll = "&";
         setState_sortBy( props.queryString.Sort_By );
      }

      if ( props.queryString.Per_Page ) {
         // console.log("per page detected",props.queryString.Per_Page);
         // this is only used for view all
         setState_pageNumber( 1 );
         setState_Offset( 0 );
         setState_perPage( parseInt(props.queryString.Per_Page) );
      } else {
         links.viewAll = `${links.viewAll}${separators.viewAll}Per_Page=${state_products.length}`;
         separators.viewAll = "&";
         links.up = `${links.up}${separators.up}Offset=${state_Offset.current + 32}`;

         if ( props.queryString.Offset && props.queryString.Offset !== state_Offset.current ) {
            setState_Offset( parseInt(props.queryString.Offset) );
         }
      }

      setState_paginationLinks( links );
   },[props.queryString.Offset,props.queryString.Per_Page,props.queryString.Sort_By]);

   useEffect(()=>{
      if ( state_perPage.current ) {
         setState_focusedProducts(state_sortedProducts.slice(0,state_perPage.current));
      }
   },[state_perPage.current]);

   useEffect(()=>{
      // called when the offset changes
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
      updatePaginationLinks();
   },[state_Offset.current]);

   let updatePaginationLinks = () => {
      // called when offset changes
      let links = {
         up: window.location.pathname,
         down: window.location.pathname
      };
      let separators = {
         up: "?",
         down: "?"
      };

      if ( state_sortBy.current ) {
         links.up = `${links.up}${separators.up}Sort_By=${state_sortBy.current}`;
         links.down = `${links.down}${separators.down}Sort_By=${state_sortBy.current}`;
         separators.up = "&";
         separators.down = "&";
      }

      links.up = `${links.up}${separators.up}Offset=${state_Offset.current + state_paginateAt}`;
      if ( state_Offset.current >= state_paginateAt * 2 ) {
         links.down = `${links.down}${separators.down}Offset=${state_Offset.current - state_paginateAt}`;
      }

      setState_paginationLinks( prevState=>{
         return {
            ...prevState,
            ...links
         }
      });
   }; // updatePaginationLinks

   let viewAll = (event) => {
      event.preventDefault();
      if ( event.currentTarget.getAttribute('href') ) {
         setState_pageNumber( 1 );
         setState_Offset( 0 );
         setState_perPage( state_products.length );
         updateAddressBar({
            Offset: 0,
            Per_Page: state_products.length,
            Sort_By: state_sortBy.current
         });
      }
   }; // viewAll

   let pageClick = (direction,event) => {
      event.preventDefault();
      if ( event.currentTarget.getAttribute('href') ) {
         let offset = null;
         switch( direction ) {
         case "up":
            offset = state_Offset.current + state_paginateAt;
            break;
         case "down":
            offset = state_Offset.current - state_paginateAt;
            break;
         }
         setState_Offset( offset );
         updateAddressBar({
            Offset: offset,
            Per_Page: state_perPage.current,
            Sort_By: state_sortBy.current
         });
      }
   }; // pageClick

   let pageChange = ( pageNumber ) => {
      // called when user manually changes the input field
      if ( pageNumber < 1 ) {
         pageNumber = 1;
      } else if ( pageNumber > state_totalPages ) {
         pageNumber = state_totalPages;
      }

      let offset = null;
      if ( pageNumber > 1 ) {
         offset = (pageNumber - 1) * state_paginateAt;
      } else {
         offset = 0;
      }
      setState_Offset( offset );
      updateAddressBar({
         Offset: offset,
         Per_Page: state_perPage.current,
         Sort_By: state_sortBy.current
      });
   }; // pageChange

   let updateAddressBar = args => {
      // called on pagination, sort, or view all
      let url = window.location.pathname;
      let separator = "?";

      if ( args.Sort_By ) {
         url = `${url}${separator}Sort_By=${args.Sort_By}`;
         separator = "&";
      }
      if ( args.Per_Page ) {
         url = `${url}${separator}Per_Page=${args.Per_Page}`;
         separator = "&";
      } else if ( args.Offset ) {
         url = `${url}${separator}Offset=${args.Offset}`;
         separator = "&";
      }
      // console.log("pushing:",url);

      setTimeout( ()=>{
         router.push( url, url, { shallow: true });
      }, 1000 );
   }; // updateAddressBar

   let renderPagination = () => {
      let downLinkActive = state_pageNumber > 1;
      let upLinkActive = state_pageNumber < state_totalPages;

      // console.log("upLinkActive",upLinkActive);
      // console.log("downLinkActive",downLinkActive);
      // console.log("state_pageNumber",state_pageNumber);
      // console.log("state_totalPages",state_totalPages);

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
                     value={state_sortBy.current}
                     onChange={(event)=>{setState_sortBy(event.target.value)}}
                  >
                     <option value="price_asc">Price - Low to High</option>
                     <option value="price_desc">Price - High to Low</option>
                     <option value="bestsellers">Best Selling</option>
                     <option value="newest">Newest</option>
                  </Select>
               </label>

            </Box>
            <Box className={prodListStyles.paginate}>
               {
                  !state_perPage.current ?
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

export default ProductListC;