/* 2021-08-13: I didn't know that Next.js' Images are lazy
* loaded by default, when I wrote this component.
* it's probably worth eventually updating it to not bother doing
* the lazy load.
*/

import {useEffect, useState, useRef} from "react";
import Image from 'next/image';

const LazyImage = (props) => {
   const [state_isVisible, setState_isVisible] = useState( false );
   const [state_src,setState_src] = useState( "https://www.favorfavor.com/images/misc/loadingRing.svg" );

   let imgRef = useRef( null );

   let handleIntersect = (entries) => {
      const [ entry ] = entries;
      setState_isVisible( entry.isIntersecting );
   };



   useEffect(()=>{
      let ref = imgRef.current;
      let intersectOptions = {
         root: null,
         rootMargin: "0px 0px 0px -20px",
         threshold: 0
      };
      let observer = new IntersectionObserver( handleIntersect, intersectOptions );
      if ( ref ) {
         observer.observe( ref );
      }

      return () => {
         if ( ref ) {
            observer.unobserve( ref );
         }
      }
   },[imgRef]);

   useEffect(()=>{
      if ( state_isVisible ) {
         setState_src(props.src);
      }
   },[state_isVisible,props.src]);

   return (
      <Image
         ref={imgRef}
         src={state_src}
         height={props.height}
         width={props.width}
         alt={props.alt}
      />
   );
};

export default LazyImage;
