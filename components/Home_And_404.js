import Head from 'next/head';
import {
   Box,
   Alert,
   AlertIcon,
   AlertTitle,
   AlertDescription
} from '@chakra-ui/react';

import RotatingBanner from "./RotatingBanner";
import HorizontalProductList from "./HorizontalProductList";

import styles from "../styles/home.module.scss";

const Home_And_404 = props => {
   //console.log("Home props", props);

   let {setNavVisibility} = props.hProps;

   return (
      <div>
         {
            props.is404 && (
               <Box style={{margin: "75px 30px 10px 30px", paddingBottom: "100px", borderBottom:"1px solid #ccc"}}>
                  <Alert status='error'>
                     <AlertIcon />
                     <AlertTitle mr={2}>Page Not Found:</AlertTitle>
                     <AlertDescription>We&apos;re sorry, that page no longer exists</AlertDescription>
                  </Alert>
               </Box>

            )
         }
         <RotatingBanner slides={props.hProps.slides} duration={props.hProps.slideDuration} />
         {
            props.hProps.categories.map((category,index)=>{
               return <HorizontalProductList key={category.target} rowNumber={index} {...category} />
            })
         }
      </div>
   );
};

export default Home_And_404;
