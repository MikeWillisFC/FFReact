import {useEffect} from "react";
import {useSelector} from "react-redux";
import axios from "axios";
import Head from 'next/head';
import Image from 'next/image';
import Link from "next/link";
import _ from "lodash";

import RotatingBanner from "../components/RotatingBanner";
import HorizontalProductList from "../components/HorizontalProductList";

import { createMD5 } from "../utilities/";

import styles from "../styles/home.module.scss";

let _fetchHome = _.memoize(async (endpoint) => {
   let request = "&cAction=getHome";
   let hash = createMD5( request );
   return await axios.get(`${endpoint}${request}&h=${hash}`);
}); // _fetchHome

const Home = (props) => {
   //console.log("Home props", props);

   let {setNavVisibility} = props;
   useEffect(()=>{
      setNavVisibility(true);
   },[setNavVisibility]);

   return (
      <div>
         <RotatingBanner slides={props.slides} duration={props.slideDuration} />
         {
            props.categories.map((category,index)=>{
               return <HorizontalProductList key={category.target} rowNumber={index} {...category} />
            })
         }
      </div>
   );
};

// server-side render
// Home.getInitialProps = async (context) => {
//    //console.log("context",context);
//
//    let config = await import("../config/config");
//    //console.log("config",config);
//
//    let response = await _fetchHome(config.default.apiEndpoint_static);
//    //console.log("response",response);
//    if ( response ) {
//       return response.data.home;
//    } else {
//       return null;
//    }
// };

// server-side render and pre-render
export async function getStaticProps() {
   //console.log("context",context);

   let config = await import("../config/config");
   //console.log("config",config);

   let response = await axios.get(`${config.default.apiEndpoint}&cAction=getHome`);
   //console.log("response",response);
   if ( response ) {
      return {
         props: response.data.home,
         revalidate: config.default.cacheKeepAlive.home
      }
   } else {
      return {
         props: null
      }
   }
}

export default Home;
