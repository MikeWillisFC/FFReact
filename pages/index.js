import {useEffect} from "react";
import {useSelector} from "react-redux";
import axios from "axios";
import Head from 'next/head';
import Image from 'next/image';
import Link from "next/link";
import _ from "lodash";
import { useBreakpointValue } from "@chakra-ui/react";

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
   const breakPoint = useBreakpointValue({ base: "mobile", md: "notMobile" });

   let {setNavVisibility} = props;
   useEffect(()=>{
      setNavVisibility(true);
   },[setNavVisibility]);

   return (
      <Fragment>
         <Head>
            {
               breakPoint !== "mobile" && (
                  <link
                     rel="preload"
                     href={props.slides[0].src}
                     as="image"
                  />
               )
            }
         </Head>

         <div>
            <RotatingBanner slides={props.slides} duration={props.slideDuration} />
            {
               props.categories.map((category,index)=>{
                  return <HorizontalProductList key={category.target} rowNumber={index} {...category} />
               })
            }
         </div>
      </Fragment>
   );
};

Home.getInitialProps = async (context) => {
   //console.log("context",context);

   let config = await import("../config/config");
   //console.log("config",config);

   let response = await _fetchHome(config.default.apiEndpoint_static);
   //console.log("response",response);
   if ( response ) {
      return response.data.home;
   } else {
      return null;
   }
};

export default Home;
