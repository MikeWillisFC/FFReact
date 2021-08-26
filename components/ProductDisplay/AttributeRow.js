import { useState, useEffect } from "react";
import { motion,AnimatePresence,useAnimation } from "framer-motion";
import { Box } from "@chakra-ui/react";

import Attribute from "./Attribute";

const AttributeRow = props => {
   const [state_rowClass,setState_rowClass] = useState( "" );

   const controls = useAnimation();

   useEffect(()=>{
      if ( props.isOpen ) {
         controls.start("open");
         setState_rowClass("");
      } else {
         controls.start("collapsed");
         setState_rowClass(props.styles.hiddenAtt);
      }
   },[props.isOpen,controls,props.styles.hiddenAtt]);

   return (
      <motion.div
         variants={{
            open: { opacity: 1, height: "auto" },
            collapsed: { opacity: 0, height: 0, overflow:"hidden" }
         }}
         transition={{ duration: .8, ease: [0.04, 0.62, 0.23, 0.98] }}
         initial="collapsed"
         exit="collapsed"
         animate={controls}
         data-rowindex={props.index}
      >
         <Box
            className={`${props.styles.attributeLine} ${state_rowClass}`}
         >
            <Attribute
               attribute={props.attribute}
               styles={props.styles}
               globalConfig={props.globalConfig}
               generalModalDisclosure={props.generalModalDisclosure}
               setGeneralModal={props.setGeneralModal}
               onChange={props.onChange}
               product={props.product}
               receiveAttributeValue={props.receiveAttributeValue}
            />
         </Box>
      </motion.div>
   );
};

export default AttributeRow;