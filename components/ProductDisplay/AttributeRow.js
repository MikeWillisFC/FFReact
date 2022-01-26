import { useState, useEffect } from "react";
import { motion,AnimatePresence,useAnimation } from "framer-motion";
import { Box } from "@chakra-ui/react";

import Attribute from "./Attribute";

const AttributeRow = props => {
   const [state_rowClass,setState_rowClass] = useState( "" );

   const controls = useAnimation();

   let {isOpen} = props;
   useEffect(()=>{
      if ( isOpen ) {
         setState_rowClass("");

         /* 2021-01-11: this ridiculous timeout makes the animation more smooth. If you
         * turn it off, the animation jumps at the last instant. Don't believe me? Go ahead,
         * remove the timeout.
         * It *seems* like we have to wait until the above state set completes. But we're not
         * waiting at all, testing has shown that a 0 millisecond timeout works just fine.
         * Note that the state set adjusts the row numbering. When the animation completes,
         * the class is set to hidden. There's a CSS rule that says to ignore hidden rows
         * when numbering. The number itself is injected by CSS :before. So, removing the
         * number changes the row height significantly, which is probably why the animation
         * jumps at the end - it was animating to the wrong spot. Hence the need to wait until
         * the state change happens before triggering the animation. So again, why the wait of
         * 0 milliseconds works is beyond me.
         */
         setTimeout(()=>{
            controls.start("open");
         },0);
      } else {
         controls.start("collapsed");
      }
   },[
      isOpen,
      controls
   ]);

   return (
      <motion.div
         variants={{
            open: { opacity: 1, height: "auto" },
            collapsed: { opacity: 1, height: 0, overflow:"hidden" }
         }}
         transition={{ duration: .4, ease: "easeInOut" }}
         initial="collapsed"
         exit="collapsed"
         animate={controls}
         data-rowindex={props.index}
         onAnimationComplete={definition=>{
            //console.log("animation complete",definition);
            if ( definition === "collapsed" ) {
               setState_rowClass(props.styles.hiddenAtt);
            }
         }}
      >
         <Box
            className={`${props.styles.attributeLine} ${state_rowClass}`}
         >
            <Attribute
               attribute={props.attribute}
               styles={props.styles}
               globalConfig={props.globalConfig}
               miscModalDisclosure={props.miscModalDisclosure}
               setMiscModal={props.setMiscModal}
               onChange={props.onChange}
               product={props.product}
               receiveAttributeValue={props.receiveAttributeValue}
               samplesPermitted={props.samplesPermitted}
               rowIndex={props.rowIndex}
            />
         </Box>
      </motion.div>
   );
};

export default AttributeRow;