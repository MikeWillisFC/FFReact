import {Fragment,useRef} from "react";
import { Button,LinkBox,Link } from "@chakra-ui/react";

import {addScript} from "../../utilities";

const FCReactDesignToolPrompt = props => {
	console.log("FCDesignToolPrompt running, props:",props);

   let handleClick = event => {
      console.log("clicked");
      event.preventDefault();
   };

	const ref_designID = useRef();
	
	if ( !window.fashioncraftFormFields ) { window.fashioncraftFormFields = {}; }
	window.fashioncraftFormFields.designID = ref_designID.current;

	let waitingForAddOnPrices = setInterval(()=>{
		// console.log("int");
		if ( typeof( window.FCAddonPricesLoaded ) !== "undefined" || window.FCAddonPricesSkip ) {
			clearInterval( waitingForAddOnPrices );
			console.log("waitingForAddOnPrices clr");
			window.fashioncraftPricing = {
				"classic": 0,
				"photo": 0,
				"metallic": 0.04,
				"vintage": 0,
				"chalkboard" : 0
			};

			if ( !window.FCAddonPricesSkip && (window.fashioncraftAddonCharges.displayBoxes || window.fashioncraftAddonCharges.displayBoxes_Craft) ) {
				window.fashioncraftPricing.boxes = {};
				if ( window.fashioncraftAddonCharges.displayBoxes ) {
					window.fashioncraftPricing.boxes.white = parseFloat(window.fashioncraftAddonCharges.displayBoxes.replace("$",""));
				}
				if ( window.fashioncraftAddonCharges.displayBoxes_Craft ) {
					window.fashioncraftPricing.boxes.craft = parseFloat(window.fashioncraftAddonCharges.displayBoxes_Craft.replace("$",""));
				}
			}
			// console.log("add");
			if ( !window.FCAddonPricesSkip ) {
				addScript( "//www.fashioncraft.com/rDesigner/init/init.js", "FCDesignStudioInit" );
			} else {
				// 2021-01-11: this only happens when we're doing a design edit on the bask screen
				addScript( "//www.fashioncraft.com/rDesigner/init/editDesign.js", "FCDesignStudioInit" );
			}

			let maxWaits = 50;
			let totalWaits = 0;
			let waitingForFCInit = setInterval(function(){
				console.log("waiting for FC Init");
				if ( window?.fashioncraftDT?.initialized || totalWaits === maxWaits ) {
					clearInterval( waitingForFCInit );
					console.log("FC init complete");
					if (
						window.fashioncraftDT?.initialized &&
						window.fashioncraftDT?.initComplete &&
						window.fashioncraftDT?.settings?.activationLinkSelectors
					) {
						window.FCPreload = {
							permitted: true,
							completed: false,
							started: false,
						};
					}
				} else {
					totalWaits++;
				}
			}, 100 );
		}
	}, 100);

   return (
      <Fragment>
         <a
            className={"fashioncraftDesigner"}
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
				props.attribute.type === "text" && props.attribute.code === "DesignID" ? (
					<input ref={ref_designID} type="hidden" id={props.attribute.code} value="" />
				) : ""
			}
      </Fragment>
   );
}; // FCReactDesignToolPrompt

export default FCReactDesignToolPrompt;