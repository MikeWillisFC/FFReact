import { Fragment,useState,useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
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

const fetchProduct = async (endpoint, code) => {
   let request = `&cAction=getPROD&prodCode=${code}`;
   let hash = createMD5( request );

   return await axios.get(`${endpoint}${request}&h=${hash}`);
}; // fetchProduct

const Product = (props) => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   const [state_product,setState_product] = useState( props.product.product || {} );
   const [state_productIsSet,setState_productIsSet] = useState( false );
   const [state_generalModal,setState_generalModal] = useState( {title: false,content: false, size:false} );
   const [state_attributeValues,setState_attributeValues] = useState( [] );
   const [state_quantity,setState_quantity] = useState( "" );

   const imageModalDisclosure = useDisclosure();
   const generalModalDisclosure = useDisclosure();

   useEffect(()=>{
      //console.log("product",props.product.product);
      setState_product( props.product.product );
      setState_productIsSet( true );
   },[props.product.product]);

   console.log("Product props",props);

   /* it's not intuitive, but miva puts the template code in the code field, and the code in the template code field
   * wtf?? I guess they think of the code as whatever the template is saying the code is. Jesus.
   */
   let receiveAttributeValue = (value, code, templateCode) => {
      //console.log("receiveAttributeValue",value,code,templateCode);
      setState_attributeValues(
         prevState=>{
            let attValue = { value:value, code:code, templateCode:templateCode };
            if ( !prevState.length ) {
               prevState.push(attValue);
            } else {
               let atIndex = false;
               prevState.forEach( (attribute,index)=>{
                  if ( atIndex === false && attribute.code === code ) {
                     atIndex = index;
                  }
               });
               if ( atIndex !== false ) {
                  prevState[atIndex] = attValue;
               } else {
                  prevState.push(attValue);
               }
            }

            return prevState;
         }
      )
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
      //console.log("form submitted, state_attributeValues:",state_attributeValues);

      const headers = { 'Content-Type': 'multipart/form-data' };
      let bodyFormData = new FormData();

      bodyFormData.set( "Action", "ADPR" );
      bodyFormData.set( "Store_Code", "FF" );
      bodyFormData.set( "Product_Code", state_product.code );
      bodyFormData.set( "Quantity", state_quantity );

      if ( state_attributeValues.length ) {
         state_attributeValues.forEach((attribute,index)=>{
            index++; // Miva doesn't start at 0
            let attKey = `Product_Attributes[${index}]`;

            /* it's not intuitive, but miva puts the template code in the code field, and the code in the template code field
            * wtf?? I guess they think of the code as whatever the template is saying the code is. Jesus.
            */
            bodyFormData.set( `${attKey}:value`, attribute.value );
            bodyFormData.set( `${attKey}:code`, attribute.templateCode );
            bodyFormData.set( `${attKey}:template_code`, attribute.code );
         });
      }

      //console.log("bodyFormData",bodyFormData);

      const response = await axios.post( globalConfig.apiEndpoint, bodyFormData, {
         headers: headers,
         withCredentials: true
      });
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
                        quantity={state_quantity}
                        setQuantity={setState_quantity}
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

Product.getInitialProps = async (context) => {
   //console.log("context",context);

   let config = await import("../../config/config");
   //console.log("config",config);
   let response = await fetchProduct(config.default.apiEndpoint_static, context.query.code);
   //let response = await axios.get(`${config.default.apiEndpoint}&cAction=getPROD&prodCode=${context.query.code}`);

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

export default Product;