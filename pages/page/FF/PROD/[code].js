import { Fragment,useState,useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import _ from "lodash";

import config from "../../../../config/config";

import catStyles from "../../../../styles/category.module.scss";

const Product = (props) => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });
   return (
      <div>sup</div>
   );
};

Product.getInitialProps = async (context) => {
   //console.log("context",context);

   let config = await import("../../config/config");
   //console.log("config",config);

   let response = await axios.get(`${config.default.apiEndpoint}&cAction=getPROD&prodCode=${context.query.code}`);

   //console.log("response.data",response.data);
   //console.log("context.params.code",context.params.code);
   if ( response ) {
      return {
         product: response.data
      };
   } else {
      return {
         product: null
      }
   }
};

export default Category;