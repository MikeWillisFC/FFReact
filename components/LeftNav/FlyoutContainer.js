import {Fragment,useEffect,useState,useCallback} from "react";
import { ListItem,Icon } from "@chakra-ui/react";
import { FaCaretRight } from 'react-icons/fa';
import Link from "next/link";
import { useHoverIntent } from 'react-use-hoverintent';

import Flyout from "./departments/Flyout";
import Flydown from "./departments/Flydown";

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

   let pSetFlyout = props.setFlyout;
   let setFlyout = useCallback(
      isHovering=>{pSetFlyout(isHovering);},
      [pSetFlyout]
   );
   // setFlyout = useCallback(
   //    props.setFlyout,
   //    []
   // );
   useEffect(()=>{
      //console.log(`${props.linkText} isHovering:`,isHovering);
      setFlyout(isHovering);
   },[isHovering,setFlyout]);

   return (
      <Fragment>
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
            {props.flyout}
         </ListItem>
         {
            props.flydowns &&
            <ListItem>
               {props.flydown}
            </ListItem>
         }
      </Fragment>
   );
}; // FlyoutListItem

const FlyoutContainer = (props) => {
   const [state_flydownsVisible, setState_flydownsVisible] = useState( props.openedFlydown === props.linkTarget );
   const [state_flyoutVisible, setState_flyoutVisible] = useState( false );

   //console.log("FlyoutContainer rendering, props:",props);
   useEffect(()=>{
      //console.log("FlyoutContainer useEffect running");
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
      //console.log("setting flyout",setting);
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
         flyout={
            <Flyout
               basePrices={props.basePrices}
               caretColors={props.caretColors}
               flyoutVisible={state_flyoutVisible}
               flyout={props.flyout}
               toggleFlyout={toggleFlyout}
               setFlyout={setFlyout}
            />
         }
         flydowns={props.flydowns}
         flydown={
            <Flydown
               basePrices={props.basePrices}
               caretColors={props.caretColors}
               flydowns={props.flydowns}
               flydownsVisible={state_flydownsVisible}
            />
         }
      >
      </FlyoutListItem>
   )
};

export default FlyoutContainer;