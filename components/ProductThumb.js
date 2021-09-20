import Link from "next/link";
import Image from 'next/image';

import {formatPrice} from "../utilities";

import styles from "../styles/productThumb.module.scss";

const ProductThumb = (props) => {
   // default is large

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
      <div className={className}>
         <Link href={`/page/FF/PROD/${props.code}`}>
            <a>
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
               <span dangerouslySetInnerHTML={{__html: props.name}}></span>
               <br />
               <span className="darkBlue"><b>{formatPrice(parseInt(props.basePrice))}</b></span>
            </a>
         </Link>
      </div>
   );
}

export default ProductThumb;