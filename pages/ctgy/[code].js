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

import ProductThumb from "../../components/ProductThumb";
import ProductList from "../../components/ProductList";
import SubDepartmentList from "../../components/SubDepartmentList";

import config from "../../config/config";

import { createMD5 } from "../../utilities/";

import catStyles from "../../styles/category.module.scss";

const fetchCategory = async (endpoint, code) => {
   let request = `&cAction=getCTGY&ctgyCode=${code}`;
   let hash = createMD5( request );

   return await axios.get(`${endpoint}${request}&h=${hash}`);
}; // fetchCategory

const Category = (props) => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   const router = useRouter();

   const [state_category,setState_category] = useState( props.category );
   const [state_categoryCode,setState_categoryCode] = useState( props.categoryCode );

   useEffect(()=>{
      setState_category( props.category );
   },[props.category]);

   useEffect(()=>{
      setState_categoryCode( props.categoryCode );
   },[props.categoryCode]);

   useEffect(()=>{
      // console.log("router.query.code",router.query.code);
      // console.log("props.categoryCode",props.categoryCode);

      /* state_categoryCode is set on initial page load, passed in from getInitialProps.
      * Since we're doing shallow routing on our category pages, later clicks
      * on category links don't run getInitialProps, therefore props.categoryCode
      * stays the same. So here we check to see if the router query code is different,
      * and if so, we fetch the new category
      */
      if ( router.query.code !== state_categoryCode ) {
         setState_category( false );
         if ( window ) {
            window.scrollTo(0, 0);
         }
         let getCategory = async () => {
            let response = await fetchCategory(globalConfig.apiEndpoint_static, router.query.code);
            if ( response.status ) {
               setState_categoryCode( router.query.code );
               setState_category( response.data );
            }
         };
         getCategory();
      }
   },[router.query.code,state_categoryCode,globalConfig.apiEndpoint_static]);

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
                     />
                  : ""
               }
            </Fragment>
         }
      </Fragment>
   );
};

Category.getInitialProps = async (context) => {
   //console.log("context",context);
   console.log("Category.getInitialProps");
   let config = await import("../../config/config");
   //console.log("config",config);

   let response = await fetchCategory(config.default.apiEndpoint_static, context.query.code);
   //let response = await axios.get(`${config.default.apiEndpoint}&cAction=getCTGY&ctgyCode=${context.query.code}asdf&hash=${hash}`);

   //console.log("window.location.pathname",window.location.pathname);
   //console.log("context",context);
   //console.log("category getInitialProps re-rendering");

   let queryString = {...context.query};

   //console.log("response.data",response.data);
   //console.log("context.params.code",context.params.code);
   if ( response ) {
      return {
         categoryCode: context.query.code,
         category: response.data,
         queryString: queryString,
         pathname: context.asPath
      };
   } else {
      return {
         category: null
      }
   }
};

export default Category;