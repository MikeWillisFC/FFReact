import {Fragment,useRef} from "react";
import { Button,LinkBox,Link } from "@chakra-ui/react";

const FCDesignToolPrompt = props => {
	console.log("FCDesignToolPrompt running, props:",props);

   let handleClick = event => {
      console.log("clicked");
      event.preventDefault();
   };

	const ref_designID = useRef();
	window.fashioncraftFormFields = {
		designID: ref_designID.current
	};

   return (
      <Fragment>
         <a
            className={props.react ? "fashioncraftDesigner" : "fashioncraftDesignerLink"}
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
			{
				props.type === "text" && props.code === "DesignID" && props.react ? (
					<input ref={ref_designID} type="hidden" id={attribute.code} value="" />
				) : ""
			}
      </Fragment>
   );
}; // FCDesignToolPrompt

export default FCDesignToolPrompt;