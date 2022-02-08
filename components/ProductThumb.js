import {Fragment,useEffect,useState} from "react";
import Link from "next/link";
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { Box,Flex } from "@chakra-ui/react";

import {formatPrice} from "../utilities";

import styles from "../styles/productThumb.module.scss";

const ProductThumb = props => {
   //console.log("ProductThumb props",props);

   // default is large
   const [st_viewType,sst_viewType] = useState(props.viewType || "grid");
   const [state_isInView,setState_isInView] = useState(false);
   const [inView_ref, inView_isInView, inView_entry] = useInView({
      threshold: 0,
   });

   let {
      viewType
   } = props;

   useEffect(()=>{
      sst_viewType(viewType || "grid");
   },[viewType]);

   useEffect(()=>{
      /* 2021-10-05: setting the state to false on scroll out does empty the div, which seems nice
      * but on re-scroll it makes another network request for the image, which sucks. Maybe that
      * only happens on localhost though, must check on web. For now, we load once and forget it.
      */
      if ( inView_isInView ) {
         setState_isInView(true);
      }
   },[inView_isInView]);

   //console.log("ProductThumb props",props);

   let imageWidth = 160;
   let className = styles.thumbLarge;

   switch( props.size ) {
   case "medium":
      imageWidth = 137;
      className = styles.thumbMedium;
      break;
   }

   let { thumbnail } = props;
   if ( thumbnail.substr(0,8) === "graphics" ) {
      thumbnail = `/mm5/${thumbnail}`;
   } else if ( thumbnail.substr(0,3) == "../" ) {
      thumbnail = thumbnail.substring(2);
   }

   let imageHeight = imageWidth; // we use square thumbnails

   if ( props.noFloat ) {
      className = `${className} noFloat`;
   }

   let renderProductName = () => {
      return (
         props.highlightedName ? (
            <span className={styles.highlighted} dangerouslySetInnerHTML={{__html: props.highlightedName}}></span>
         ) : (
            <span dangerouslySetInnerHTML={{__html: props.name}}></span>
         )
      );
   }; // renderProductName

   let renderProductPrice = () => {
      return (
         <span className={`darkBlue ${styles.price}`}>
            {
               props.basePrice ?
                  formatPrice(parseInt(props.basePrice))
               :
               (
                  props.price ?
                     formatPrice(parseInt(props.price))
                  : ""
               )
            }
         </span>
      );
   }; // renderProductPrice

   let renderThumbnail = () => {
      return (
         <Link
            href={`/page/FF/PROD/${props.code}`}
         >
            <a
               className={className}
               ref={inView_ref}
            >
               {
                  !props.requireIntersect || state_isInView ? (
                     <Fragment>
                        {
                           !props.eagerLoad ? (
                              <Fragment>
                                 {
                                    props.blurThumb ? (
                                       <Image
                                          src={`https://www.favorfavor.com${thumbnail}`}
                                          width={imageWidth}
                                          height={imageHeight}
                                          alt={props.alt || props.name}
                                          placeholder="blur"
                                          blurDataURL={props.blurThumb}
                                       />
                                    ) : (
                                       <Image
                                          src={`https://www.favorfavor.com${thumbnail}`}
                                          width={imageWidth}
                                          height={imageHeight}
                                          alt={props.alt || props.name}
                                       />
                                    )
                                 }
                              </Fragment>
                           ) : (
                              <Fragment>
                                 <Image
                                    src={`https://www.favorfavor.com${thumbnail}`}
                                    width={imageWidth}
                                    height={imageHeight}
                                    alt={props.alt || props.name}
                                    loading="eager"
                                 />
                              </Fragment>
                           )
                        }

                        {
                           st_viewType === "grid" && (
                              <Fragment>
                                 {renderProductName()}

                                 {renderProductPrice()}
                              </Fragment>
                           )
                        }
                     </Fragment>
                  ) : ("Loading...")
               }
            </a>
         </Link>
      );
   }; // renderThumbnail

   return (
      st_viewType === "grid" ? (
         <Fragment>
            {renderThumbnail()}
         </Fragment>
      ) : (
         <Box className={styles.listThumb} width="100%">
            <Flex>
               <Box>
                  {renderThumbnail()}
               </Box>
               <Box flex='1'>
                  <span style={{display:"inline-block",float:"right"}}>
                     {renderProductPrice()}
                  </span>
                  <Link
                     href={`/page/FF/PROD/${props.code}`}
                  >
                     <a
                        className={className}
                        ref={inView_ref}
                     >
                        <b>{renderProductName()}</b>
                     </a>
                  </Link>
                  <br />
                  <span style={{fontSize:"0.7em"}}>Item Number: {props.code}</span>
                  <br />
                  <Fragment>
                     {props.description && props.description.substr(0,400)}...
                  </Fragment>
               </Box>
            </Flex>

         </Box>
      )
   );
}

export default ProductThumb;