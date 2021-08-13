import { Fragment,useState,useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Head from 'next/head';
import Image from 'next/image';
import Link from "next/link";

import RotatingBanner from "../components/RotatingBanner";
import HorizontalProductList from "../components/HorizontalProductList";

import styles from "../styles/home.module.scss";

const Home = (props) => {
   //console.log("Home props", props);

   return (
      <div>
         <RotatingBanner slides={props.slides} duration={props.slideDuration} />
         {
            props.categories.map(category=>{
               return <HorizontalProductList key={category.target} {...category} />
            })
         }
      </div>
   );
};

Home.getInitialProps = async(context) => {
   //console.log("context",context);

   let config = await import("../config/config");
   //console.log("config",config);

   let response = await axios.get( `${config.default.apiEndpoint}&cAction=getHome` );
   //console.log("response",response);
   if ( response ) {
      return response.data.home;
   } else {
      return null;
   }
};

export default Home;
