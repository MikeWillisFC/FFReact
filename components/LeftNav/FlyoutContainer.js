import {useEffect,useState,cloneElement,Fragment} from "react";
import { ListItem,Icon,useDisclosure } from "@chakra-ui/react";
import { FaCaretRight } from 'react-icons/fa';
import Link from "next/link";

import Department from "./departments/Department";

import styles from "../../styles/leftnav.module.scss";

const FlyoutListItem = (props) =>  {
   //console.log("FlyoutListItem props",props);

   const [ state_arrowColor, setState_arrowColor ] = useState(props.caretColors.off);

   let handleMouseEnter = () => {
      setState_arrowColor( props.caretColors.on );
   }
   let handleMouseLeave = () => {
      setState_arrowColor( props.caretColors.off );
   }

   return (
      <ListItem
         className={styles.parentList}
         onClick={props.toggleFlydowns}
         onMouseLeave={()=>{props.setFlyout(false);}}
         onMouseEnter={()=>{props.setFlyout(true);}}
      >
         <Link
            shallow
            className="lna"
            href={props.linkTarget}
         >
            <a
               onMouseEnter={()=>{props.setFlyout(true);}}
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
   const [state_flydownsVisible, setState_flydownsVisible] = useState( false );
   const [state_flyoutVisible, setState_flyoutVisible] = useState( false );
   const { isOpen, onToggle } = useDisclosure();

   console.log("isOpen",isOpen);

   let toggleFlydowns = () => {
      setState_flydownsVisible( prevState=>!prevState );
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
         toggleFlydowns={onToggle}
         toggleFlyout={toggleFlyout}
         setFlyout={setFlyout}
      >
         <Department
            basePrices={props.basePrices}
            caretColors={props.caretColors}
            flydowns={props.flydowns}
            flydownsVisible={isOpen}
            flyoutVisible={state_flyoutVisible}
            flyout={props.flyout}
            toggleFlyout={toggleFlyout}
            setFlyout={setFlyout}
         />
      </FlyoutListItem>
   )
};

export default FlyoutContainer;