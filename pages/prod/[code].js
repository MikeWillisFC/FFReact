import { Fragment,useState,useEffect,useRef,useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import _ from "lodash";
import {
   Box,
   Wrap,
   WrapItem,
   Heading,
   Flex,
   Button,
   Spinner,
   Stack,
   Center,
   Badge,

   useDisclosure
} from "@chakra-ui/react";

import config from "../../config/config";

import Images from "../../components/ProductDisplay/Images";
import Stats from "../../components/ProductDisplay/Stats";
import Attributes from "../../components/ProductDisplay/Attributes";
import AddToCart from "../../components/ProductDisplay/AddToCart";
import Description from "../../components/ProductDisplay/Description";
import AlsoShopped from "../../components/ProductDisplay/AlsoShopped";

import { createMD5, scrollTo } from "../../utilities/";

import styles from "../../styles/product.module.scss";

const Product = (props) => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });
   const router = useRouter();
   //console.log("Product rendering, props:",props);

   const [state_product,setState_product] = useState( props.product || false );
   const [state_productIsSet,setState_productIsSet] = useState( false );
   const [state_focusedImageData,setState_focusedImageData] = useState( false );
   const [state_descTabIndex,setState_descTabIndex] = useState(false);


   let quantityRef = useRef();
   let attributeValuesRef = useRef([]);
   let descriptionRef = useRef();

   const imageModalDisclosure = useDisclosure();

   let {setNavVisibility} = props;
   useEffect(()=>{
      setNavVisibility(true);
   },[setNavVisibility]);

   useEffect(()=>{
      //console.log("PRODUCT USEEFFECT",props.product);
      setState_product( props.product );
      setState_productIsSet( true );
   },[props.product]);

   useEffect(()=>{
      //console.log("PRODUCT USEEFFECT - state_product");
   },[state_product]);
   useEffect(()=>{
      //console.log("PRODUCT USEEFFECT - state_productIsSet");
   },[state_productIsSet]);

   /* it's not intuitive, but miva puts the template code in the code field, and the code in the template code field
   * wtf?? I guess they think of the code as whatever the template is saying the code is. Jesus.
   */
   let receiveAttributeValue = useCallback((value, code, templateCode) => {
      //console.log("receiveAttributeValue",value,code,templateCode);
      let attValue = { value:value, code:code, templateCode:templateCode };
      let atIndex = false;
      if ( attributeValuesRef.current.length ) {
         attributeValuesRef.current.forEach( (attribute,index)=>{
            if ( atIndex === false && attribute.code === code ) {
               atIndex = index;
            }
         });
      }
      if ( atIndex !== false ) {
         attributeValuesRef.current[atIndex] = attValue;
      } else {
         attributeValuesRef.current.push(attValue);
      }
   },[
      //attributeValuesRef.current // utable values like 'attributeValuesRef.current' aren't valid dependencies because mutating them doesn't re-render the component.
   ]); // receiveAttributeValue

   let renderSpinner = () => {
      return (
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
      );
   }; // renderSpinner

   let decodeEntities = encodedString => {
      return _.unescape(encodedString);
   }; // decodeEntities

   let handleSubmit = async (event) => {
      event.preventDefault();
      //console.log("form submitted, attributeValuesRef.current:",attributeValuesRef.current);

      const headers = { 'Content-Type': 'multipart/form-data' };

      let bodyFormData = new FormData();

      bodyFormData.set( "Action", "ADPR" );
      bodyFormData.set( "Store_Code", "FF" );
      bodyFormData.set( "Product_Code", state_product.code );
      bodyFormData.set( "Quantity", quantityRef.current );

      if ( attributeValuesRef.current.length ) {
         attributeValuesRef.current.forEach((attribute,index)=>{
            index++; // Miva doesn't start at 0
            let attKey = `Product_Attributes[${index}]`;

            /* it's not intuitive, but miva puts the template code in the code field, and the code in the template code field
            * wtf?? I guess they think of the code as whatever the template is saying the code is. Jesus.
            */
            bodyFormData.set( `${attKey}:value`, attribute.value );
            if ( attribute.code ) {
               bodyFormData.set( `${attKey}:template_code`, attribute.code );
            }
            if ( attribute.templateCode ) {
               bodyFormData.set( `${attKey}:code`, attribute.templateCode );
            }
         });
      }
      //console.log("bodyFormData",bodyFormData);

      if ( true ) {
         const response = await axios.post( globalConfig.apiEndpoint, bodyFormData, {
            headers: headers,
            withCredentials: true
         });
         if ( response.status ) {
            console.log("pushing route");
            router.push(`/Basket`);
         }
      } else {
         const response = await fetch( globalConfig.apiEndpoint, {
            method: 'post',
            credentials: 'include',
            mode: 'cors',
            body: bodyFormData
         });
      }
      //console.log("response",response);
   }; // handleSubmit

   let formID = "basketAdd";

   return (
      !state_product ? renderSpinner() :
      <Fragment>
         <Head>
            <title>
               {
                  state_product.customFields.PAGETITLE ?
                     state_product.customFields.PAGETITLE
                  :
                  `${decodeEntities(state_product.strippedName)} - ${globalConfig.siteName}`
               }
            </title>
         </Head>

         <Box className={styles.display}>
            <Heading
               as="h1"
               display={["block","block","none"]}
               dangerouslySetInnerHTML={{__html: _.unescape(state_product.name)}}
            >
            </Heading>
            <Flex className={styles.details} wrap={"wrap"}>
               <Box
                  className={styles.mainImage}
                  w={["100%","100%","325px"]}
               >
                  <Images
                     hasLargeImage={state_product.customFields.hasLargeImage}
                     images={state_product.images}
                     prodCode={state_product.code}
                     strippedName={state_product.strippedName}
                     domain={globalConfig.domain}
                     modalDisclosure={imageModalDisclosure}
                     styles={styles}
                     renderSpinner={renderSpinner}
                     imageData={state_focusedImageData}
                     setImageData={setState_focusedImageData}
                  />
               </Box>
               <Box
                  flex="1"
                  className={styles.specifics}
                  w={["100%","100%","325px"]}
               >
                  <Heading
                     as="h1"
                     display={["none","none","block"]}
                     dangerouslySetInnerHTML={{__html: _.unescape(state_product.name)}}
                     itemProp="name"
                  >
                  </Heading>

                  <Stats
                     product={state_product}
                     styles={styles}
                     globalConfig={globalConfig}
                     miscModalDisclosure={props.miscModalDisclosure}
                     setMiscModal={props.setMiscModal}
                     descriptionRef={descriptionRef}
                     setTabIndex={setState_descTabIndex}
                  />

                  <form
                     method="post"
                     id={formID}
                     action={globalConfig.apiEndpoint}
                     onSubmit={handleSubmit}
                  >
                     <Attributes
                        product={state_product}
                        attributes={state_product.attributes}
                        parentTemplateCode=""
                        styles={styles}
                        globalConfig={globalConfig}
                        miscModalDisclosure={props.miscModalDisclosure}
                        setMiscModal={props.setMiscModal}
                        receiveAttributeValue={receiveAttributeValue}
                        blockSamples={state_product.customFields.blockSamples}
                     />

                     <AddToCart
                        formID={formID}
                        quantity={quantityRef.current}
                        quantityRef={quantityRef}
                        minimum={state_product.customFields.MINIMUM}
                        enforceMinimum={state_product.customFields.enforceMinimum.trim() !== ""}
                        blockSamples={state_product.customFields.blockSamples.trim() === "1" || state_product.customFields.blockSamples.trim() === "yes"}
                     />
                  </form>
               </Box>
            </Flex>

            <Description
               ref={descriptionRef}
               product={state_product}
               domain={globalConfig.domain}
               apiEndpoint_static={globalConfig.apiEndpoint_static}
               setImageData={setState_focusedImageData}
               tabIndex={state_descTabIndex}
               setTabIndex={setState_descTabIndex}
            />

            {
               (state_product.alsoShopped && state_product.alsoShopped.length) && (
                  <AlsoShopped
                     prodCode={state_product.code}
                     items={state_product.alsoShopped}
                  />
               )
            }

         </Box>
      </Fragment>
   );
};

const fetchProduct = async (code,endpoint) => {
   let request = `&cAction=getPROD&prodCode=${code}`;
   let hash = createMD5( request );

   return await axios.get(`${endpoint}${request}&h=${hash}`);
}; // fetchProduct
const _fetchProduct = _.memoize(fetchProduct);

// server-side render
// Product.getInitialProps = async (context) => {
//    //console.log("context",context);
//
//    let config = await import("../../config/config");
//    //console.log("config",config);
//    let response = await _fetchProduct(context.query.code,config.default.apiEndpoint_static);
//    //let response = await axios.get(`${config.default.apiEndpoint}&cAction=getPROD&prodCode=${context.query.code}`);
//
//    //console.log("response.data",response.data);
//    //console.log("context.params.code",context.params.code);
//    if ( response ) {
//       return {
//          response.data
//       };
//    } else {
//       return {
//          product: null
//       }
//    }
// };

// server-side render and pre-render
export async function getStaticPaths() {
   let config = await import("../../config/config");
   let response = await axios.get(`https://${config.default.domain}/api/get/ti.php`);
   //console.log("response",response);
   return {
      //paths: [{ params: { code: '3421' } }, { params: { code: '3421s' } }],
      paths: response.data.items.map(item=>({ params: { code: item } })),
      fallback: true
   };
};
export async function getStaticProps(context) {
   //console.log("getStaticProps context",context);

   let config = await import("../../config/config");
   //console.log("config",config);

   let axResponse = await axios.get(`${config.default.apiEndpoint}&cAction=getPROD&prodCode=${context.params.code}`);
   //console.log("prod getStaticProps response",axResponse);
   if ( axResponse ) {
      return {
         props: axResponse.data,
         revalidate: config.default.cacheKeepAlive.prod
      }
   } else {
      return {
         props: null
      }
   }
};

export default Product;