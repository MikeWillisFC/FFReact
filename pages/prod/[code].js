import { Fragment,useState,useEffect,useRef } from "react";
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
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalFooter,
   ModalBody,
   ModalCloseButton,
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

import { createMD5 } from "../../utilities/";

import styles from "../../styles/product.module.scss";

const _fetchProduct = _.memoize(async (code,endpoint) => {
   let request = `&cAction=getPROD&prodCode=${code}`;
   let hash = createMD5( request );

   return await axios.get(`${endpoint}${request}&h=${hash}`);
});

const Product = (props) => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });
   const router = useRouter();

   const [state_product,setState_product] = useState( props.product.product || {} );
   const [state_productIsSet,setState_productIsSet] = useState( false );
   const [state_generalModal,setState_generalModal] = useState( {title: false,content: false, size:false} );

   let quantityRef = useRef();
   let attributeValuesRef = useRef([]);

   const imageModalDisclosure = useDisclosure();
   const generalModalDisclosure = useDisclosure();

   let {setNavVisibility} = props;
   useEffect(()=>{
      setNavVisibility(true);
   },[setNavVisibility]);

   useEffect(()=>{
      console.log("PRODUCT USEEFFECT",props.product.product);
      setState_product( props.product.product );
      setState_productIsSet( true );
   },[props.product.product]);

   useEffect(()=>{
      console.log("PRODUCT USEEFFECT - state_product");
   },[state_product]);
   useEffect(()=>{
      console.log("PRODUCT USEEFFECT - state_productIsSet");
   },[state_productIsSet]);
   useEffect(()=>{
      console.log("PRODUCT USEEFFECT - state_generalModal");
   },[state_generalModal]);

   console.log("Product props",props);

   /* it's not intuitive, but miva puts the template code in the code field, and the code in the template code field
   * wtf?? I guess they think of the code as whatever the template is saying the code is. Jesus.
   */
   let receiveAttributeValue = (value, code, templateCode) => {
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
   }; // receiveAttributeValue

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
      // see https://stackoverflow.com/a/1395954/1042398
      var textArea = document.createElement('textarea');
      textArea.innerHTML = encodedString;
      return textArea.value;
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
      !state_productIsSet ? renderSpinner() :
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
            <Flex className={styles.details}>
               <Box
                  className={styles.mainImage}
                  w="325px"
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
                  />
               </Box>
               <Box flex="1" className={styles.specifics}>
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
                     generalModalDisclosure={generalModalDisclosure}
                     setGeneralModal={setState_generalModal}
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
                        generalModalDisclosure={generalModalDisclosure}
                        setGeneralModal={setState_generalModal}
                        receiveAttributeValue={receiveAttributeValue}
                     />

                     <AddToCart
                        formID={formID}
                        quantity={quantityRef.current}
                        quantityRef={quantityRef}
                     />

                  </form>

               </Box>
            </Flex>
         </Box>

         <Modal
            isOpen={generalModalDisclosure.isOpen}
            onClose={generalModalDisclosure.onClose}
            size={state_generalModal.size}
            isCentered
         >
            <ModalOverlay />
            <ModalContent
               className={styles.generalModal}
            >
               <ModalHeader className="blueHeader">
                  {state_generalModal.title}
                  <ModalCloseButton />
               </ModalHeader>
               <Box>
                  {
                     typeof( state_generalModal.content ) === "object" ?
                        <ModalBody className={styles.gmBody}>
                           {state_generalModal.content}
                        </ModalBody>
                     : <ModalBody
                        className={styles.gmBody}
                        dangerouslySetInnerHTML={{__html: _.unescape(state_generalModal.content)}}
                       >
                     </ModalBody>
                  }

               </Box>
            </ModalContent>
         </Modal>

      </Fragment>
   );
};

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
//          product: response.data
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
      fallback: true // See the "fallback" section below
   };
};
export async function getStaticProps(context) {
   console.log("getStaticProps context",context);

   let config = await import("../../config/config");
   //console.log("config",config);

   let response = await _fetchProduct(context.params.code,config.default.apiEndpoint_static);
   //console.log("response",response);
   if ( response ) {
      return {
         props: {
            product: response.data
         },
         revalidate: (60 * 30) // seconds
      }
   } else {
      return {
         props: null
      }
   }
};

export default Product;