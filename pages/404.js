import {useEffect} from "react";
import axios from "axios";
import Head from 'next/head';
import _ from "lodash";

import Home_And_404 from "../components/Home_And_404";

// import { createMD5 } from "../utilities/";

const Custom404 = props => {
   return (
      <Home_And_404
         is404={true}
         hProps={props}
      />
   );
}; // Custom404

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

export default Custom404;