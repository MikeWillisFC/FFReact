import {useState,useEffect,useRef} from "react";
import Link from "next/link";
import { Container } from "@chakra-ui/react"

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
   const [state_slides, setState_slides] = useReferredState( [] );
   const [state_targetURL, setState_targetURL] = useState( "" );
   const [state_interval, setState_interval] = useReferredState( false );

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
      if ( state_slides.current.length ) {
         startInterval();
         return ()=>{clearInterval(state_interval.current);}
      }
   },[state_slides.current]);

   let startInterval = () => {
      let rotateIntervalIndex = setInterval(()=>{
         // get the currently visible slide, defaulting with the first one
         let currentVisible = 0;
         let nextVisible = 0;
         state_slides.current.forEach((slide,index)=>{
            //console.log("slide",slide);
            if ( slide.opacity === 1 ) {
               currentVisible = index;
               nextVisible = currentVisible + 1;
               if ( currentVisible === state_slides.current.length - 1 ) {
                  nextVisible = 0;
               }
            }
         });

         //console.log("currentVisible",currentVisible);
         //console.log("nextVisible",nextVisible);
         // ok now fade out current, fade in next, and set the new target URL
         setState_slides(state_slides.current.map((slide,index)=>{
            if ( index === currentVisible ) {
               return { ...slide, opacity: 0 };
            } else if ( index === nextVisible ) {
               setState_targetURL( slide.target );
               return { ...slide, opacity: 1 };
            } else {
               return slide;
            }
         }))
      }, props.duration);

      setState_interval( rotateIntervalIndex );
   };

   let handleMouseOver = ()=>{
      clearInterval( state_interval.current );
   };
   let handleMouseOut = ()=>{
      startInterval();
   }

   return (
      <Container display={["none","none","block"]} maxW="container.xl">
         <div className={styles.container}>
            <a
               href={state_targetURL}
               onMouseOver={handleMouseOver}
               onMouseOut={handleMouseOut}
            >
               {
                  state_slides.current.length ? state_slides.current.map(slide=>{
                     return (
                        <img style={{opacity: slide.opacity}} key={slide.src} src={slide.src} alt={slide.title} height="100%" width="100%" />
                     );
                  }) : ""
               }
            </a>
         </div>
      </Container>
   );
};

export default RotatingBanner;