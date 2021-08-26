import {useEffect,useState,useRef,useImperativeHandle,cloneElement,Fragment} from "react";
import { ListItem,Icon } from "@chakra-ui/react";
import { FaCaretRight } from 'react-icons/fa';
import Link from "next/link";
import { useHoverIntent } from 'react-use-hoverintent';

import Department from "./departments/Department";

import styles from "../../styles/leftnav.module.scss";

const FlyoutListItem = (props) =>  {
   //console.log("FlyoutListItem props",props);

   const [ state_arrowColor, setState_arrowColor ] = useState(props.caretColors.off);
   const [isHovering, ref] = useHoverIntent({
      timeout: 50
   });

   let handleMouseEnter = () => {
      setState_arrowColor( props.caretColors.on );
   }
   let handleMouseLeave = () => {
      setState_arrowColor( props.caretColors.off );
   }

   useEffect(()=>{
      //console.log(`${props.linkText} isHovering:`,isHovering);
      props.setFlyout(isHovering);
   },[isHovering]);

   return (
      <ListItem
         className={styles.parentList}
         onClick={props.toggleFlydowns}
         //onMouseLeave={()=>{props.setFlyout(false);}}
         //onMouseEnter={()=>{props.setFlyout(true);}}
         ref={ref}
      >
         <Link
            shallow
            className="lna"
            href={props.linkTarget}
         >
            <a
               //onMouseEnter={()=>{props.setFlyout(true);}}
               onClick={()=>{props.setFlyout(false);}}
            >
               {props.linkText}
               <Icon as={FaCaretRight} color={state_arrowColor} />
            </a>
         </Link>
         {props.children}
      </ListItem>
   );
}; // FlyoutListItem

const FlyoutContainer = (props) => {
   const [state_flydownsVisible, setState_flydownsVisible] = useState( props.openedFlydown === props.linkTarget );
   const [state_flyoutVisible, setState_flyoutVisible] = useState( false );

   //console.log("FlyoutContainer rendering, props:",props);
   useEffect(()=>{
      setState_flydownsVisible( props.openedFlydown === props.linkTarget );
   }, [props.openedFlydown,props.linkTarget]);

   let toggleFlydowns = () => {
      //setState_flydownsVisible( prevState=>!prevState );
      //console.log("toggleFlydowns",props.linkTarget);
      props.openFlydown(props.linkTarget);
   };
   let toggleFlyout = () => {
      //console.log("toggling flyout");
      setState_flyoutVisible( prevState=>!prevState );
   };
   let setFlyout = setting => {
      //console.log("toggling flyout");
      setState_flyoutVisible( setting );
   };

   return (
      <FlyoutListItem
         linkTarget={props.linkTarget}
         linkText={props.linkText}
         caretColors={props.caretColors}
         toggleFlydowns={toggleFlydowns}
         toggleFlyout={toggleFlyout}
         setFlyout={setFlyout}
      >
         <Department
            basePrices={props.basePrices}
            caretColors={props.caretColors}
            flydowns={props.flydowns}
            flydownsVisible={state_flydownsVisible}
            flyoutVisible={state_flyoutVisible}
            flyout={props.flyout}
            toggleFlyout={toggleFlyout}
            setFlyout={setFlyout}
         />
      </FlyoutListItem>
   )
};

export default FlyoutContainer;