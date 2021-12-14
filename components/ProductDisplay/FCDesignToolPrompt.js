import {Fragment} from "react";
import { Button,LinkBox,Link } from "@chakra-ui/react";

const FCDesignToolPrompt = props => {

   let handleClick = event => {
      console.log("clicked");
      event.preventDefault();
   };

   return (
      <Fragment>
         <a
            className="fashioncraftDesignerLink"
            href={props.attribute.promptTarget}
            style={{display:"block",width:"90%",margin:"5px auto"}}
            onClick={handleClick}
         >
            <Button
               width="90%"
               colorScheme="blue"
               onClick={handleClick}
            >
               {props.attribute.prompt}
            </Button>
         </a>
      </Fragment>
   );
}; // FCDesignToolPrompt

export default FCDesignToolPrompt;