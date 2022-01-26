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
   console.log("Product rendering, props:",props);

   let {
      product
   } = props;

   const [state_product,setState_product] = useState( product || false );
   const [state_productIsSet,setState_productIsSet] = useState( false );
   const [state_focusedImageData,setState_focusedImageData] = useState( false );
   const [state_descTabIndex,setState_descTabIndex] = useState(false);
   const [state_minimum,setState_minimum] = useState({});
   const [state_samplesPermitted,setState_samplesPermitted] = useState(true);

   let quantityRef = useRef();
   let attributeValuesRef = useRef([]);
   let descriptionRef = useRef();

   const imageModalDisclosure = useDisclosure();

   let {setNavVisibility} = props;
   useEffect(()=>{
      setNavVisibility(true);
   },[setNavVisibility]);

   useEffect(()=>{
      console.log("PRODUCT USEEFFECT",product);
      let min = product.customFields.minimum ? product.customFields.minimum : ( product.customFields.MINIMUM ? product.customFields.MINIMUM : 1 );
      let minimum = {};
      if ( min.indexOf("^") !== -1 ) {
         min = min.split("^");
         minimum.prodMin = min[0];
         minimum.quantityIncrement = min[1];
         minimum.prodQuantityMax = min[2];
      } else {
         minimum.prodMin = min;
         minimum.quantityIncrement = false;
         minimum.prodQuantityMax = false;
      }
      setState_minimum( minimum );
      setState_product( product );

      setState_samplesPermitted(()=>{
         if (
            product.customFields.blockSamples.trim() !== "" ||
            product.customFields.blockSamples.trim() === "yes" ||
            (
               product.customFields.hideSampleButton &&
               (
                  product.customFields.hideSampleButton.trim() === "1" ||
                  product.customFields.hideSampleButton.trim() === "yes"
               )
            )
         ) {
            return false;
         } else {
            return true;
         }
      });
      setState_productIsSet( true );
   },[product]);

   useEffect(()=>{
      //console.log("PRODUCT USEEFFECT - state_product");
   },[state_product]);
   useEffect(()=>{
      //console.log("PRODUCT USEEFFECT - state_productIsSet");
   },[state_productIsSet]);

   /* it's not intuitive, but miva puts the template code in the code field, and the code in the template code field
   * wtf?? I guess they think of the code as whatever the template is saying the code is. Jesus.
   */
   let receiveAttributeValue = useCallback((value, code, templateCode, rowIndex, attemp_id) => {
      //console.log("receiveAttributeValue",value,code,templateCode);
      let attValue = { value:value, code:code, templateCode:templateCode, rowIndex:rowIndex, attemp_id:attemp_id };
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

   let renderSpinner = (size=false,margin=false) => {
      if ( !size ) {
         size = "xl";
      }
      if ( !margin ) {
         margin = "30px 0px";
      }
      return (
         <Box
            style={{textAlign: "center", margin: margin}}
         >
            <Spinner
               thickness="4px"
               speed="1s"
               emptyColor="gray.200"
               color="blue.500"
               size={size}
            />
         </Box>
      );
   }; // renderSpinner

   let decodeEntities = encodedString => {
      return _.unescape(encodedString);
   }; // decodeEntities

   let prepFormSubmit = quantityOverride => {
      let bodyFormData = new FormData();

      bodyFormData.set( "Action", "ADPR" );
      bodyFormData.set( "Store_Code", "FF" );
      bodyFormData.set( "Product_Code", state_product.code );
      bodyFormData.set( "Quantity", quantityOverride !== false ? quantityOverride : quantityRef.current );

      return bodyFormData;
   }; prepFormSubmit

   let runFormSubmit = async (bodyFormData,goToBasket,returnResult) => {
      const headers = { 'Content-Type': 'multipart/form-data' };
      if ( true ) {
         const response = await axios.post( globalConfig.apiEndpoint, bodyFormData, {
            headers: headers,
            withCredentials: true
         });
         if ( response.status ) {
            if ( goToBasket ) {
               props.miscModalDisclosure.onClose();
               console.log("pushing route");
               router.push(`/Basket`);
            } else if ( returnResult ) {
               return true;
            }
         } else if ( returnResult ) {
            return false;
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
   }; // runFormSubmit

   let handleSubmit = (event,goToBasket=true,quantityOverride=false,returnResult=false) => {
      event.preventDefault();
      //console.log("form submitted, attributeValuesRef.current:",attributeValuesRef.current);

      let bodyFormData = prepFormSubmit(quantityOverride);

      if ( attributeValuesRef.current.length ) {
         attributeValuesRef.current.forEach((attribute,index)=>{
            index++; // Miva doesn't start at 0
            let rowIndex = attribute.rowIndex + 1; // Miva doesn't start at 0
            let attKey = `Product_Attributes[${rowIndex}]`;

            /* it's not intuitive, but miva puts the template code in the code field, and the code in the template code field.
            * wtf?? I guess they think of the code as whatever the template is saying the code is. Jesus.
            */
            bodyFormData.set( `${attKey}:value`, attribute.value );
            if ( attribute.attemp_id && attribute.attemp_id !== "0" && attribute.code ) {
               bodyFormData.set( `${attKey}:template_code`, attribute.code );
            }
            if ( attribute.templateCode ) {
               bodyFormData.set( `${attKey}:code`, attribute.templateCode );
            }
         });
      }
      //console.log("bodyFormData",bodyFormData);

      return runFormSubmit(bodyFormData,goToBasket,returnResult);
   }; // handleSubmit

   let formID = "basketAdd";

   let renderAttributes = () => {
      return (
         <Attributes
            product={state_product}
            attributes={state_product.attributes}
            parentTemplateCode=""
            globalConfig={globalConfig}
            miscModalDisclosure={props.miscModalDisclosure}
            setMiscModal={props.setMiscModal}
            receiveAttributeValue={receiveAttributeValue}
            samplesPermitted={state_samplesPermitted}
         />
      );
   };

   return (
      !state_product ? renderSpinner() : (
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
                        className={styles.basketAddForm}
                     >
                        {
                           state_product.customFields.offerSeparateOptions.trim() === "" && renderAttributes()
                        }

                        <AddToCart
                           formID={formID}
                           quantity={quantityRef.current}
                           quantityRef={quantityRef}
                           minimum={state_minimum}
                           enforceMinimum={state_product.customFields.enforceMinimum.trim() !== ""}
                           samplesPermitted={state_samplesPermitted}

                           // for attribute rendering if offerSeparateOptions is turned on
                           offerSeparateOptions={state_product.customFields.offerSeparateOptions.trim() !== ""}
                           renderAttributes={renderAttributes}
                           miscModalDisclosure={props.miscModalDisclosure}
                           setMiscModal={props.setMiscModal}
                           handleSubmit={handleSubmit}
                           renderSpinner={renderSpinner}
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
      )
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
      //fallback: true,
      fallback: 'blocking'
   };
};
export async function getStaticProps(context) {
   //console.log("getStaticProps context",context);

   let config = await import("../../config/config");
   //console.log("config",config);

   let axResponse = await axios.get(`${config.default.apiEndpoint}&cAction=getPROD&prodCode=${context.params.code}`);
   //console.log("prod getStaticProps response",axResponse);
   if ( axResponse ) {
      if ( !axResponse.data.result || axResponse.data.result === '0' ) {
         // deactivated or discontinued
         return { notFound: true };
      } else {
         return {
            props: axResponse.data,
            revalidate: config.default.cacheKeepAlive.prod
         }
      }
   } else {
      return {
         props: null
      }
   }
};

export default Product;