import {Fragment,useEffect,useState,useCallback} from "react";
import { ListItem,Icon } from "@chakra-ui/react";
import { FaCaretRight } from 'react-icons/fa';
import Link from "next/link";
import { useHoverIntent } from 'react-use-hoverintent';

import Flyout from "./departments/Flyout";
import Flydown from "./departments/Flydown";

import styles from "../../styles/leftnav.module.scss";

const FlyoutListItem = props =>  {
   //console.log("FlyoutListItem rendering, props:",props);

   const [ state_arrowColor, setState_arrowColor ] = useState(props.caretColors.off);
   const [isHovering, ref] = useHoverIntent({
      timeout: 50
   });

   let {on,off} = props.caretColors;
   let handleMouseEnter = useCallback(() => {
      setState_arrowColor( on );
   },[on]);
   let handleMouseLeave = useCallback(() => {
      setState_arrowColor( off );
   },[off]);

   let pSetFlyout = props.setFlyout;
   let setFlyout = useCallback(isHovering=>{
      pSetFlyout(isHovering);
   }, [pSetFlyout] );

   // setFlyout = useCallback(
   //    props.setFlyout,
   //    []
   // );
   useEffect(()=>{
      //console.log(`${props.linkText} isHovering:`,isHovering);
      /* 2021-12-07: isHovering unfortunately isn't completely reliable. Sometimes if you click
      * rapidly between categories, while moving the house over some etc, you can trigger
      * a flyout to open, and isHovering will be true. Then it will remain open until you
      * hover over the link again. But adding the check for :hover seems to fix the problem.
      * Maybe it has something to do with state updates happening asynchronously, so by the time
      * this useEffect fires, the object is no longer hovered, but isHover is set to true. But
      * since we're also checking the ref, that can definitely only be right if the user is still
      * hovering.
      */
      if ( isHovering && ref.current.matches(":hover") ) {
         setFlyout(isHovering);
      } else {
         setFlyout(false);
      }
   },[isHovering,setFlyout,ref]);

   return (
      <Fragment>
         <ListItem
            className={styles.parentList}
            onClick={event=>{props.setOpenedFlydown(props.linkTarget)}}
            //onMouseLeave={()=>{props.setFlyout(false);}}
            //onMouseEnter={()=>{props.setFlyout(true);}}
            ref={ref}
         >
            <Link
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

const FlyoutContainer = props => {
   const [state_flydownsVisible, setState_flydownsVisible] = useState( props.openedFlydown === props.linkTarget );
   const [state_flyoutVisible, setState_flyoutVisible] = useState( false );

   //console.log("FlyoutContainer rendering, props:",props);
   useEffect(()=>{
      //console.log("FlyoutContainer useEffect running",props.openedFlydown,props.linkTarget);
      setState_flydownsVisible( props.openedFlydown === props.linkTarget );
   }, [props.openedFlydown,props.linkTarget]);
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
         setOpenedFlydown={props.setOpenedFlydown}
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
               linkTarget={props.linkTarget}
               setOpenedFlydown={props.setOpenedFlydown}
               openedFlydown={props.openedFlydown}
            />
         }
      >
      </FlyoutListItem>
   )
};

export default FlyoutContainer;