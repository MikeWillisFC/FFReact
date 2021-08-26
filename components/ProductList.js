import { Fragment,useState,useEffect,useRef,useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaCaretRight,FaCaretLeft } from 'react-icons/fa';
import { Icon,Wrap,WrapItem,SimpleGrid,Box,Input,Select } from "@chakra-ui/react";

import ProductThumb from "./ProductThumb";
import config from "../config/config";

import prodListStyles from "../styles/productList.module.scss";

let getParameterByName = (name, url = window.location.href ) => {
   name = name.replace(/[\[\]]/g, '\\$&');
   var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
   results = regex.exec(url);
   if (!results) return null;
   if (!results[2]) return '';
   return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const ProductList = (props) => {
   //console.log("ProductList props",props);
   let defaults = {
      paginateAt: 32,
      perPage: null, // 2021-08-20: why is this set to null? Because anything other than null can show up in the address bar, it's not a mistake
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
   const [state_Offset,setState_Offset] = useState( defaults.Offset );
   const [state_perPage,setState_perPage] = useState( defaults.perPage );
   const [state_sortBy,setState_sortBy] = useState( defaults.sortBy );
   const [state_addressBar,setState_addressBar] = useState({
      Offset: defaults.Offset,
      Per_Page: defaults.perPage,
      Sort_By: defaults.sortBy
   });

   const [state_paginationLinks,setState_paginationLinks] = useState({
      up: `${props.pathname}?Offset=${defaults.Offset + defaults.paginateAt}`,
      down: "",
      viewAll: ""
   });

   const router = useRouter();

   useEffect(()=>{
      console.log("useEffect 7");
      // called on pagination, sort, or view all
      let url = window.location.pathname;
      let separator = "?";

      if ( state_addressBar.Sort_By ) {
         url = `${url}${separator}Sort_By=${state_addressBar.Sort_By}`;
         separator = "&";
      }
      if ( state_addressBar.Per_Page ) {
         url = `${url}${separator}Per_Page=${state_addressBar.Per_Page}`;
         separator = "&";
      } else if ( state_addressBar.Offset ) {
         url = `${url}${separator}Offset=${state_addressBar.Offset}`;
         separator = "&";
      }

      setTimeout( ()=>{
         router.push( url, url, { shallow: true });
      }, 1000 );

      /* 2021-08-23: React would complain about not having router in the
      * dependency list here. But if you put router in the list, and then
      * the above code *changes* router, you get an infinite loop calling
      * this useEffect over and over again.
      */
      // eslint-disable-next-line react-hooks/exhaustive-deps
   },[state_addressBar]);

   useEffect(()=>{
      console.log("router has changed");
   }, [router]);

   useEffect(()=>{
      console.log("useEffect 6");
      //console.log("useEffect products",props.products);
      setState_products(props.products);
      setState_sortedProducts(props.products);
   }, [props.products]);

   useEffect(()=>{
      console.log("useEffect 5");
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
         // console.log("state_Offset",state_Offset);
         // console.log("state_perPage",state_perPage);
         // console.log("state_sortBy",state_sortBy);

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
   },[defaults.perPage,defaults.sortBy]);

   useEffect(()=>{
      console.log("useEffect 4");
      setState_totalPages( Math.ceil( state_products.length / state_paginateAt ) );
   },[state_paginateAt,state_products]);

   useEffect(()=>{
      console.log("useEffect 3");
      // handles sortBy change
      //console.log("state_sortBy useEffect called:",state_sortBy);
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
      if ( state_perPage !== defaults.perPage ) {
         // the only way this changes is if they click view all.
         end = state_perPage;
      }
      setState_sortedProducts( sortedProducts );
      setState_focusedProducts( sortedProducts.slice( 0, end ) );
      setState_Offset( 0 );

      /* we need the REAL value of state_perPage and state_sortBy, and
      * we don't want to use refs. How can we do it? this stupid setState thing, that's
      * how.
      */
      setState_perPage( prevPerPage=>{
         setState_sortBy( prevSortBy=>{
            // console.log("useEffect E setState_addressBar:",{
            //    Offset: 0,
            //    Per_Page: prevPerPage,
            //    Sort_By: prevSortBy
            // });
            setState_addressBar({
               Offset: 0,
               Per_Page: prevPerPage,
               Sort_By: prevSortBy
            });

            return prevSortBy;
         });

         return prevPerPage;
      });

   },[state_products,defaults.paginateAt,defaults.perPage,state_perPage,state_sortBy]);


   useEffect(()=>{
      console.log("useEffect 2");
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
         links.up = `${links.up}${separators.up}Offset=${state_Offset + 32}`;

         if ( props.queryString.Offset && props.queryString.Offset !== state_Offset ) {
            setState_Offset( parseInt(props.queryString.Offset) );
         }
      }

      setState_paginationLinks( links );
   },[props.queryString.Offset,props.queryString.Per_Page,props.queryString.Sort_By,state_Offset,state_products.length]);

   useEffect(()=>{
      console.log("useEffect 1");
      if ( state_perPage ) {
         setState_focusedProducts(state_sortedProducts.slice(0,state_perPage));
      }
   },[state_perPage,state_sortedProducts]);

   let depsA = [state_Offset,defaults.perPage,state_paginateAt,state_perPage,state_sortBy,state_sortedProducts];
   let depsB = [state_Offset];
   useEffect(()=>{
      // called when the offset changes
      console.log("offset useEffect running");

      setState_Offset( prevOffset=>{
         setState_paginateAt( prevPaginateAt=>{
            setState_perPage( prevPerPage=>{
               setState_sortedProducts( prevSortedProducts=>{
                  let start = prevOffset;
                  let end = prevOffset + prevPaginateAt;
                  let pageNumber = prevOffset > 0 ? prevOffset / prevPaginateAt + 1 : 1;
                  if ( prevPerPage !== defaults.perPage ) {
                     // the only way this changes is if they click view all.
                     start = 0;
                     end = prevPerPage;
                     pageNumber = 1;
                  }
                  setState_focusedProducts( prevSortedProducts.slice(start,end) );
                  setState_pageNumber( pageNumber );
                  return prevSortedProducts;
               });
               return prevPerPage;
            });
            return prevPaginateAt;
         });
         return prevOffset;
      });

      setState_sortBy( prevSortBy=>{
         setState_paginateAt( prevPaginateAt=>{
            let links = {
               up: window.location.pathname,
               down: window.location.pathname
            };
            let separators = {
               up: "?",
               down: "?"
            };

            if ( prevSortBy ) {
               links.up = `${links.up}${separators.up}Sort_By=${prevSortBy}`;
               links.down = `${links.down}${separators.down}Sort_By=${prevSortBy}`;
               separators.up = "&";
               separators.down = "&";
            }

            links.up = `${links.up}${separators.up}Offset=${state_Offset + prevPaginateAt}`;
            if ( state_Offset >= prevPaginateAt * 2 ) {
               links.down = `${links.down}${separators.down}Offset=${state_Offset - prevPaginateAt}`;
            }

            setState_paginationLinks( prevState=>{
               return {
                  ...prevState,
                  ...links
               }
            });
            return prevPaginateAt;
         });
         return prevSortBy;
      });

   },[state_Offset,defaults.perPage]);

   let viewAll = (event) => {
      event.preventDefault();
      if ( event.currentTarget.getAttribute('href') ) {
         setState_pageNumber( 1 );
         setState_Offset( 0 );
         setState_perPage( state_products.length );

         let newAddressBar = {
            Offset: 0,
            Per_Page: state_products.length,
            Sort_By: state_sortBy
         };
         setState_addressBar(newAddressBar);
      }
   }; // viewAll

   let pageClick = (direction,event) => {
      event.preventDefault();
      if ( event.currentTarget.getAttribute('href') ) {
         setState_Offset(prevState=>{
            let offset = null;
            switch( direction ) {
            case "up":
               offset = prevState + state_paginateAt;
               break;
            case "down":
               offset = prevState - state_paginateAt;
               break;
            }
            let newAddressBar = {
               Offset: offset,
               Per_Page: state_perPage,
               Sort_By: state_sortBy
            };
            setState_addressBar(newAddressBar);
            return offset;
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

      /* we need the REAL value of state_perPage and state_sortBy, and
      * we don't want to use refs. How can we do it? this stupid setState thing, that's
      * how. If the setState function returns the same value, the re-render is skipped. So
      * we can use that to get the real value of that piece of state, then return the previous
      * value so there are no unneeded re-renders.
      */
      setState_perPage( prevPerPage=>{
         setState_sortBy( prevSortBy=>{
            setState_Offset( prevOffset=>{
               let offset = null;
               if ( pageNumber > 1 ) {
                  offset = (pageNumber - 1) * state_paginateAt;
               } else {
                  offset = 0;
               }
               let addressBar = {
                  Offset: offset,
                  Per_Page: prevPerPage,
                  Sort_By: prevSortBy
               };
               //console.log("pageChange new addressBar:",addressBar);
               setState_addressBar(addressBar);
               return offset;
            });

            return prevSortBy;
         });

         return prevPerPage;
      });
   }; // pageChange

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
                     value={state_sortBy}
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
                  !state_perPage ?
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