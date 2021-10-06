import {useState,useEffect,useRef,useCallback} from "react";
import Link from "next/link";
import Image from 'next/image';
import { Container, useBreakpointValue } from "@chakra-ui/react"

import styles from "../styles/rotatingBanner.module.scss";

/* 2021-03-02: In a functional component, an event handler can get the state that
* existed at the moment the handler was defined, NOT the current state. That's ridiculous.
* So, we have to use useRef and .current to get the real state. Fucking unbelievable.
* see https://stackoverflow.com/a/62015336/1042398 for where this function came from.
* Also see https://reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function
*/
let useReferredState = (initialValue) => {
   const [state, setState] = useState(initialValue);
   const reference = useRef(state);
   const setReferredState = value => {
      reference.current = value;
      setState(value);
   };
   return [reference, setReferredState];
}; // useReferredState

const RotatingBanner = (props) => {
   const [state_slides, setState_slides] = useState( [] );
   const [state_targetURL, setState_targetURL] = useState( "" );
   const [state_interval, setState_interval] = useState( false );

   const breakPoint = useBreakpointValue({ base: "hidden", md: "visible" })

   useEffect(()=>{
      setState_slides(props.slides.map((slide,index)=>{
         let opacity = 0;
         if ( index === 0 ) {
            opacity = 1;
            setState_targetURL( slide.target );
         }
         return {
            ...slide,
            opacity: opacity
         }
      }));
   },[props.slides]);

   useEffect(()=>{
      let rotateIntervalIndex = null;

      let startInterval = () => {
         //console.log("starting inverval");
         rotateIntervalIndex = setInterval(()=>{
            //console.log("interval running");
            // get the currently visible slide, defaulting with the first one
            let currentVisible = 0;
            let nextVisible = 0;
            state_slides.forEach((slide,index)=>{
               //console.log("slide",slide);
               if ( slide.opacity === 1 ) {
                  currentVisible = index;
                  nextVisible = currentVisible + 1;
                  if ( currentVisible === state_slides.length - 1 ) {
                     nextVisible = 0;
                  }
               }
            });

            //console.log("currentVisible",currentVisible);
            //console.log("nextVisible",nextVisible);
            // ok now fade out current, fade in next, and set the new target URL
            setState_slides( prevState=>{
               let newState = prevState.map((slide,index)=>{
                  if ( index === currentVisible ) {
                     return { ...slide, opacity: 0 };
                  } else if ( index === nextVisible ) {
                     setState_targetURL( slide.target );
                     return { ...slide, opacity: 1 };
                  } else {
                     return slide;
                  }
               })

               //console.log("returning newState",newState);
               return newState;
            });
         }, props.duration);
      };

      if ( state_slides.length ) {
         startInterval();
         return ()=>{clearInterval(rotateIntervalIndex);}
      }
   },[state_slides,props.duration]);

   let handleMouseOver = ()=>{
      //clearInterval( state_slides );
   };
   let handleMouseOut = ()=>{
      //startInterval();
   }

   return (
      breakPoint === "hidden" ? null :
      <Container display={["none","none","block"]} maxW="container.xl">
         <div className={styles.container}>
            <a
               href={state_targetURL}
               onMouseOver={handleMouseOver}
               onMouseOut={handleMouseOut}
            >
               {
                  state_slides.length ? state_slides.map((slide,index)=>{
                     let loading = index > 0 ? "lazy" : "eager";

                     return (
                        <div key={slide.src} style={{opacity: slide.opacity}} className={styles.banner}>
                           <Image
                              key={slide.src}
                              src={slide.src}
                              alt={slide.title}
                              layout="fill"
                              loading={loading}
                           />
                        </div>
                     );
                  }) : ""
               }
            </a>
         </div>
      </Container>
   );
};

export default RotatingBanner;