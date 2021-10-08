import {Fragment,useEffect,useState} from "react";
import Link from "next/link";
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

import {formatPrice} from "../utilities";

import styles from "../styles/productThumb.module.scss";

const ProductThumb = (props) => {
   // default is large
   const [state_isInView,setState_isInView] = useState(false);
   const [inView_ref, inView_isInView, inView_entry] = useInView({
      threshold: 0,
   });

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

   return (
      <Link
         href={`/page/FF/PROD/${props.code}`}
      >
         <a
            className={className}
            ref={inView_ref}
         >
            {
               !props.requireIntersect || state_isInView ?
                  <Fragment>
                     {
                        !props.eagerLoad ?
                           <Fragment>
                              {
                                 props.blurThumb ? (
                                    <Image
                                       src={`https://www.favorfavor.com${thumbnail}`}
                                       width={imageWidth}
                                       height={imageHeight}
                                       alt={props.alt}
                                       placeholder="blur"
                                       blurDataURL={props.blurThumb}
                                    />
                                 ) : (
                                    <Image
                                       src={`https://www.favorfavor.com${thumbnail}`}
                                       width={imageWidth}
                                       height={imageHeight}
                                       alt={props.alt}
                                    />
                                 )
                              }
                           </Fragment>
                        : <Fragment>
                           <Image
                              src={`https://www.favorfavor.com${thumbnail}`}
                              width={imageWidth}
                              height={imageHeight}
                              alt={props.alt}
                              loading="eager"
                           />
                        </Fragment>
                     }

                     <span dangerouslySetInnerHTML={{__html: props.name}}></span>
                     <span className={`darkBlue ${styles.price}`}>{formatPrice(parseInt(props.basePrice))}</span>
                  </Fragment>
               : "Loading..."
            }

         </a>
      </Link>
   );
}

export default ProductThumb;