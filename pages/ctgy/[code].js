import { Fragment,useState,useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/router';
import _ from "lodash";
import { FaCaretRight,FaCaretLeft } from 'react-icons/fa';
import { Icon,Wrap,WrapItem,SimpleGrid,Box,Input,Spinner } from "@chakra-ui/react";

import ProductList from "../../components/ProductList";
import SubDepartmentList from "../../components/SubDepartmentList";

import config from "../../config/config";

import { createMD5 } from "../../utilities/";

import catStyles from "../../styles/category.module.scss";

const _fetchCategory = _.memoize( async (code,endpoint) => {
   let request = `&cAction=getCTGY&ctgyCode=${code}`;
   return await axios.get(`${endpoint}${request}`);
});

const Category = (props) => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   const router = useRouter();

   const [state_category,setState_category] = useState( props.category );
   const [state_categoryCode,setState_categoryCode] = useState( props.categoryCode );

   let {categoryCode,category,setNavVisibility} = props;

   useEffect(()=>{
      setNavVisibility(true);
   },[setNavVisibility]);

   useEffect(()=>{
      setState_category( category );
   },[category]);

   useEffect(()=>{
      setState_categoryCode( categoryCode );
   },[categoryCode]);

   //console.log("---category rendering---");
   // useEffect(()=>{
   //    // console.log("router.query.code",router.query.code);
   //    // console.log("props.categoryCode",props.categoryCode);
   //
   //    /* state_categoryCode is set on initial page load, passed in from getInitialProps.
   //    * Since we're doing shallow routing on our category pages, later clicks
   //    * on category links don't run getInitialProps, therefore props.categoryCode
   //    * stays the same. So here we check to see if the router query code is different,
   //    * and if so, we fetch the new category
   //    *
   //    * 2021-12-09: UPDATE: we're no longer doing shallow routing
   //    */
   //    console.log("router.query.code vs state_categoryCode:", router.query.code, state_categoryCode);
   //    if ( router.query.code ) {
   //       console.log("fetching new category page");
   //       setState_category( false );
   //       if ( window ) {
   //          window.scrollTo(0, 0);
   //       }
   //       let getCategory = async () => {
   //          let response = await _fetchCategory(router.query.code,globalConfig.apiEndpoint_static);
   //          if ( response.status ) {
   //             setState_categoryCode( router.query.code );
   //             setState_category( response.data );
   //          }
   //       };
   //       getCategory();
   //    }
   // },[router.query.code,globalConfig.apiEndpoint_static]);
   // useEffect(()=>{ console.log("router.query.code changed:",router.query.code); },[router.query.code]);
   // useEffect(()=>{ console.log("state_categoryCode changed:",state_categoryCode); },[state_categoryCode]);
   // useEffect(()=>{ console.log("globalConfig.apiEndpoint_static changed:",globalConfig.apiEndpoint_static); },[globalConfig.apiEndpoint_static]);

   //console.log("router.query",router.query);

   //console.log("Category props",props);
   //console.log("category",state_category);

   return (
      <Fragment>
         {
            !state_category ?
               <Box
                  style={{textAlign: "center", margin: "30px 0px"}}
               >
                  <Spinner
                     thickness="4px"
                     speed="1s"
                     emptyColor="gray.200"
                     color="blue.500"
                     size="xl"
                  />
               </Box>
            :
            <Fragment>
               <Head>
                  <title>{state_category.categoryName}: {globalConfig.siteName}</title>
               </Head>
               <h1 className={catStyles.h1} dangerouslySetInnerHTML={{__html: _.unescape(state_category.h1 || state_category.pageTitle || state_category.categoryName)}}></h1>
               <hr />

               {
                  state_category.showSubcat && state_category.subcats && state_category.subcats.tiles.length ?
                     <Fragment>
                        <SubDepartmentList
                           subcats={state_category.subcats}
                           headline={state_category.breadcrumbText}
                        />
                        <h2 className={catStyles.featuredItems}><span dangerouslySetInnerHTML={{__html: _.unescape(state_category.breadcrumbText)}}></span>: Featured Items</h2>
                     </Fragment>
                  : ""
               }
               {
                  state_category.products.length ?
                     <ProductList
                        queryString={props.queryString}
                        products={state_category.products}
                        categoryCode={state_category.code}
                        sortFields={["price","bestsellers","newest"]}
                     />
                  : ""
               }
            </Fragment>
         }
      </Fragment>
   );
};

// server-side render and pre-render
export async function getStaticPaths() {
   let config = await import("../../config/config");
   let axResponse = await axios.get(`https://${config.default.domain}/api/get/cl.php`);
   return {
      paths: axResponse.data.categories.map(category=>({ params: { code: category } })),
      fallback: true
   };
};
export async function getStaticProps(context) {
   let config = await import("../../config/config");
   let axResponse = await _fetchCategory(context.params.code,config.default.apiEndpoint);
   //let response = await axios.get(`${config.default.apiEndpoint}&cAction=getCTGY&ctgyCode=${context.query.code}`);

   //console.log("window.location.pathname",window.location.pathname);
   //console.log("context",context);
   //console.log("category getInitialProps re-rendering");

   let queryString = {...context.query};

   //console.log("response.data",response.data);
   //console.log("context.params.code",context.params.code);

   if ( !axResponse.data.result || axResponse.data.result === '0' ) {
      // deactivated or discontinued
      return { notFound: true };
   } else {
      return {
         props: {
            categoryCode: context.params.code,
            category: axResponse.data,
            queryString: queryString,
            // pathname: context.asPath
         }
      };
   }

};

// Category.getInitialProps = async (context) => {
//    //console.log("context",context);
//    //console.log("Category.getInitialProps");
//    let config = await import("../../config/config");
//    //console.log("config",config);
//
//
//    // let request = `&cAction=getCTGY&ctgyCode=${code}`;
//    // let hash = createMD5( request );
//    //
//    // return await axios.get(`${endpoint}${request}&h=${hash}`);
//
//    let response = await _fetchCategory(context.query.code,config.default.apiEndpoint);
//    //let response = await axios.get(`${config.default.apiEndpoint}&cAction=getCTGY&ctgyCode=${context.query.code}`);
//
//    //console.log("window.location.pathname",window.location.pathname);
//    //console.log("context",context);
//    //console.log("category getInitialProps re-rendering");
//
//    let queryString = {...context.query};
//
//    //console.log("response.data",response.data);
//    //console.log("context.params.code",context.params.code);
//    if ( response ) {
//       return {
//          categoryCode: context.query.code,
//          category: response.data,
//          queryString: queryString,
//          pathname: context.asPath
//       };
//    } else {
//       return {
//          category: null
//       }
//    }
// };

export default Category;