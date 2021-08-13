import {Fragment,useState,useEffect,useRef} from "react";
import { Box,Button,Select,Icon,HStack,Input,Checkbox,List,ListItem,ListIcon } from "@chakra-ui/react";
import { FaCircle } from 'react-icons/fa';
import { motion,AnimatePresence,useAnimation } from "framer-motion";

const TagPrompt = props => {
   const [state_detailsVisible,setState_detailsVisible] = useState( false );

   const controls = useAnimation();

   let handleDetailsClick = event => {
      setState_detailsVisible( prevState=>{
         let newState = !prevState;
         if ( newState ) {
            controls.start("open");
         } else {
            controls.start("collapsed");
         }
         return newState;
      });
   }; // handleDetailsClick

   let checkStyle = {
      position:"absolute",
      right:"10px"
   };
   if ( !state_detailsVisible ) {
      checkStyle.backgroundColor = "#fff";
   }

   return (
      <Fragment>
         <Button
            width="90%"
            className="lightBlueButton"
            style={{justifyContent: "left"}}
            onClick={handleDetailsClick}
         >
            {props.attribute.tagPrompt}
            <Checkbox style={checkStyle} isChecked={state_detailsVisible}></Checkbox>
         </Button>

         <motion.div
            variants={{
               open: { opacity: 1, height: "auto" },
               collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: .6, ease: [0.04, 0.62, 0.23, 0.98] }}
            initial="collapsed"
            exit="collapsed"
            animate={controls}
            style={{overflow:"hidden"}}
         >
            <List
               style={{fontSize:"1em",marginLeft: "10%",textIndent:"-1.5em"}}
               spacing={1}
            >
               {
                  props.attribute.tagDetails.map((detail,index)=>{
                     return (
                        <ListItem
                           key={`tagDetails|${index}`}
                        >
                           <ListIcon as={FaCircle} color="blue.100" />
                           <span dangerouslySetInnerHTML={{__html: detail}}></span>
                        </ListItem>
                     );
                  })
               }
            </List>

            <a
               className="fashioncraftDesignerLink"
               href={props.attribute.promptTarget}
               style={{display:"block",width:"90%",margin:"5px auto"}}
            >
               <img src={`https://${props.globalConfig.domain}/images/buttons/designYourLabels.png`} width="329" height="64" alt="Design Your Labels" />
            </a>
         </motion.div>
      </Fragment>
   )
};

export default TagPrompt;