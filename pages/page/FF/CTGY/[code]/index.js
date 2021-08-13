import { Fragment,useState,useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import _ from "lodash";

import ProductThumb from "../../../../../components/ProductThumb";

import config from "../../../../../config/config";

import catStyles from "../../../../../styles/category.module.scss";

const Category = (props) => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   //console.log("props",props);
   //console.log("category",props.category);
   let paginateAt = 32;

   return (
      <Fragment>
         <Head>
            <title>{props.category.pageTitle}: {globalConfig.siteName}</title>
         </Head>
         <h1 className={catStyles.h1} dangerouslySetInnerHTML={{__html: _.unescape(props.category.h1 || props.category.pageTitle)}}></h1>
         <hr />

         <div className={catStyles.prodBoxes}>
            {
               props.category.products.length ?
                  props.category.products.slice(0,paginateAt).map(product=>{
                     props.items.map(item=>{
                        return <ProductThumb key={product.code} {...item} />
                     })
                  })
               : ""
            }
         </div>
      </Fragment>
   );
};

Category.getInitialProps = async (context) => {
   //console.log("context",context);

   let config = await import("../../config/config");
   //console.log("config",config);

   let response = await axios.get(`${config.default.apiEndpoint}&cAction=getCTGY&ctgyCode=${context.query.code}`);

   //console.log("response.data",response.data);
   //console.log("context.params.code",context.params.code);
   if ( response ) {
      return {
         category: response.data
      };
   } else {
      return {
         category: null
      }
   }
};

export default Category;