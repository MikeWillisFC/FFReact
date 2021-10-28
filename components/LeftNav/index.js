import {useEffect,useState,cloneElement,Fragment} from "react";
import { useSelector } from "react-redux";
import { Icon,Box,Center,Stack,Grid,List,ListItem,ListIcon,OrderedList,UnorderedList } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";

import FlyoutContainer from "./FlyoutContainer";

import styles from "../../styles/leftnav.module.scss";

const LeftNav = (props) => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   //console.log("LeftNav rendering");

   const [state_openedFlydown,setState_openedFlydown] = useState(false);

   const [state_leftnav,setState_leftnav] = useState( props.leftnav );
   const [state_basePrices,setState_basePrices] = useState( [] );

   useEffect(()=>{
      let getBasePrices = async () => {
         const headers = { 'Content-Type': 'multipart/form-data' };
         let bodyFormData = new FormData();
         bodyFormData.set( "items", props.bestOfferItems.join(",") );

         //console.log("globalConfig",globalConfig);
         const response = await axios.post( `${globalConfig.apiEndpoint}&cAction=getBasePrices`, bodyFormData, {
            headers: headers
         });
         //console.log( "response",response );
         if ( response.status ) {
            //console.log("response.data.basePrices",response.data.basePrices);
            setState_basePrices( response.data.basePrices );
         }
      }; // getBasePrices

      getBasePrices();
   },[props.bestOfferItems,globalConfig.apiEndpoint]);

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

                                          openFlydown={setState_openedFlydown}
                                          openedFlydown={state_openedFlydown}
                                       />
                                    )
                                 } else {
                                    return (
                                       <ListItem key={link.target}>
                                          <Link
                                             shallow
                                             className="lna"
                                             key={link.target}
                                             href={link.target}
                                          >
                                             {link.text}
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