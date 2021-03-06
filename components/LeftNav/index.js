import {useEffect,useState,cloneElement,Fragment} from "react";
import { useSelector,useDispatch } from "react-redux";
import { Icon,Box,Center,Stack,Grid,List,ListItem,ListIcon,OrderedList,UnorderedList } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";

import FlyoutContainer from "./FlyoutContainer";
import {messagesActions} from "../../store/slices/messages";
import {parseMessages} from "../../utilities";

import styles from "../../styles/leftnav.module.scss";

const LeftNav = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });
   const dispatch = useDispatch();

   //console.log("LeftNav rendering");
   let {
      bestOfferItems
   } = props;

   const [state_openedFlydown,setState_openedFlydown] = useState(false);

   const [state_leftnav,setState_leftnav] = useState( props.leftnav );
   const [state_basePrices,setState_basePrices] = useState( [] );

   useEffect(()=>{
      let getBasePrices = async () => {
         const headers = { 'Content-Type': 'multipart/form-data' };
         let bodyFormData = new FormData();
         bodyFormData.set( "items", bestOfferItems.join(",") );

         //console.log("globalConfig",globalConfig);
         dispatch(messagesActions.clearMessages());
         const response = await axios.post( `${globalConfig.apiEndpoint}&cAction=getBasePrices`, bodyFormData, {
            headers: headers
         });
         //console.log( "response",response );
         if ( response.status ) {
            parseMessages(response.data,dispatch,messagesActions);
            //console.log("response.data.basePrices",response.data.basePrices);
            setState_basePrices( response.data.basePrices );
         }
      }; // getBasePrices

      getBasePrices();
   },[
      bestOfferItems,
      globalConfig.apiEndpoint,
      dispatch
   ]);

   return (
      <Box className={styles.leftnav}>
         {
            Array.isArray( state_leftnav ) && state_leftnav.length ?
               state_leftnav.map(navBlock=>{

                  let blockClass = "";
                  switch( navBlock.color ) {
                     case "pink":
                        blockClass = styles.pinkSection;
                        break;
                     case "green":
                        blockClass = styles.greenSection;
                        break;
                     case "blue":
                        blockClass = styles.blueSection;
                        break;
                     case "orange":
                        blockClass = styles.orangeSection;
                        break;
                  }

                  return (
                     <Box className={blockClass} key={navBlock.headline}>
                        <h3>{navBlock.headline}</h3>

                        <UnorderedList className={styles.mainMenu}>
                           {
                              navBlock.links.map(link=>{
                                 if ( link.flyout ) {
                                    return (
                                       <FlyoutContainer
                                          key={link.target}
                                          linkTarget={link.target}
                                          linkText={link.text}
                                          caretColors={navBlock.caretColors}

                                          basePrices={state_basePrices}
                                          flydowns={link.flydowns}
                                          flyout={link.flyout}

                                          setOpenedFlydown={setState_openedFlydown}
                                          openedFlydown={state_openedFlydown}
                                       />
                                    )
                                 } else {
                                    return (
                                       <ListItem key={link.target}>
                                          <Link
                                             className="lna"
                                             key={link.target}
                                             href={link.target}
                                          >
                                             <a
                                                onClick={event=>{
                                                   //console.log("clicked");
                                                   // this closes any open flydowns
                                                   setState_openedFlydown(link.target);
                                                }}
                                             >
                                                {link.text}
                                             </a>
                                          </Link>
                                       </ListItem>
                                    );
                                 }
                              })
                           }
                        </UnorderedList>
                     </Box>
                  );
               })
            : ""
         }
      </Box>
   );
};

export default LeftNav;