import {useEffect, useState, useRef} from "react";

const LazyImage = (props) => {
   const [state_isVisible, setState_isVisible] = useState( false );
   const [state_src,setState_src] = useState( "https://www.favorfavor.com/images/misc/loadingRing.svg" );

   let imgRef = useRef( null );

   let handleIntersect = (entries) => {
      const [ entry ] = entries;
      setState_isVisible( entry.isIntersecting );
   };

   let intersectOptions = {
      root: null,
      rootMargin: "0px 0px 0px -20px",
      threshold: 0
   };

   useEffect(()=>{
      let observer = new IntersectionObserver( handleIntersect, intersectOptions );
      if ( imgRef.current ) {
         observer.observe( imgRef.current );
      }

      return () => {
         if ( imgRef.current ) {
            observer.unobserve( imgRef.current );
         }
      }
   },[imgRef,intersectOptions]);

   useEffect(()=>{
      if ( state_isVisible ) {
         setState_src(props.src);
      }
   },[state_isVisible,props.src]);

   return (
      <img
         ref={imgRef}
         src={state_src}
         height={props.height}
         width={props.width}
         alt={props.alt}
      />
   );
};

export default LazyImage;
