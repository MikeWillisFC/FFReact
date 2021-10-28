import {Fragment} from "react";
import Image from 'next/image';
import Link from "next/link";
import { FaQuoteLeft,FaQuoteRight } from 'react-icons/fa';
import {Icon} from "@chakra-ui/react";

import ReviewStars from "./ReviewStars";

import styles from "../../styles/product.module.scss";

const Review = props => {
   //console.log("Review props", props);
   let renderAuthor = () => {
      return (
         <small>
            <span itemScope itemProp="author" itemType="https://schema.org/Person">
               <span itemProp="name">{props.review.name}{" "}</span>
            </span>
            {
               (props.review.city && props.review.state) &&
               <Fragment>
                  ({props.review.city}, {props.review.state})
               </Fragment>
            }
            {props.review.printableDate && <Fragment>, {props.review.printableDate}</Fragment>}
         </small>
      );
   };

   let showImage = (event,imageDimensions) => {
      event.preventDefault;
      // console.log("showing image",`https://${props.domain}/images/productReviews/${props.code}/${props.review.uploadedImage}`);
      // console.log("imageDimensions",imageDimensions);
      if ( props.imageModalDisclosure ) {
         props.imageModalDisclosure.onOpen();
      }
      props.setImageData({
         url: `/images/productReviews/${props.code}/${props.review.uploadedImage}`,
         width: imageDimensions.width,
         height: imageDimensions.height
      });
   }; // showImage

   let renderImage = () => {
      //console.log("props.review.uploadedImage",props.review.uploadedImage);
      let thumb = {
         src: props.review.uploadedImage.replace( ".jpg", "-th.jpg" ),
         width: 100,
         height: 100
      };
      return (
         <div className={styles.image}>
            <Link
               href={`https://${props.domain}/images/productReviews/${props.code}/${props.review.uploadedImage}`}
            >
               <a onClick={event=>{
                  event.preventDefault();
                  showImage(event,props.review.uploadedImageDimensions);
               }}>
                  <Image
                     src={`https://${props.domain}/images/productReviews/${props.code}/${thumb.src}`}
                     width={thumb.width}
                     height={thumb.height}
                     alt="customer uploaded image"
                  />
               </a>
            </Link>

         </div>
      )
   };

   return (
      <div className={styles.review} itemProp="review" itemScope="" itemType="https://schema.org/Review">
         <meta itemProp="datePublished" content={props.review.date} />
         <div>
            {
               props.displayStyle !== "viewAll" && <ReviewStars domain={props.domain} stars={props.review.rating} />
            }
            {" "}<span itemProp="name">{props.review.title}</span>
            <span itemProp="reviewRating" itemScope="" itemType="https://schema.org/Rating" className="hideMe">
               <span itemProp="ratingValue">{props.review.rating}</span>
            </span>

            <br />
            {props.displayStyle !== "viewAll" && renderAuthor()}

         </div>

         <div itemProp="description">
            { ( props.review.uploadedImage !== "" && props.review.uploadedImageDimensions ) && renderImage() }
            <Icon as={FaQuoteLeft} width={3} height={3} />
            <span dangerouslySetInnerHTML={{__html: props.review.review}}></span>
            <Icon as={FaQuoteRight} width={3} height={3} />
            { ( props.review.uploadedImage !== "" && props.review.uploadedImageDimensions ) && <br className="clear" /> }
         </div>
         {props.displayStyle === "viewAll" && renderAuthor()}
      </div>
   );
};

export default Review;