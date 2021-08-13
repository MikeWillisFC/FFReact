import LazyImage from "./LazyImage";
import Link from "next/link";

import styles from "../styles/productThumb.module.scss";

const ProductThumb = (props) => {
   // default is large
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
      <p className={className}>
         <Link href={`/page/FF/PROD/${props.code}`}>
            <a>
               <LazyImage
                  src={`https://www.favorfavor.com${thumbnail}`}
                  height={imageHeight}
                  width={imageWidth}
                  alt={props.name}
               />
               <span dangerouslySetInnerHTML={{__html: props.name}}></span>
               <br />
               <span className="darkBlue"><b>${props.basePrice}</b></span>
            </a>
         </Link>
      </p>
   );
}

export default ProductThumb;