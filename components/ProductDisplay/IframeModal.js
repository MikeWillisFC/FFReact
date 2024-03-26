import {Fragment,useState,useEffect,useRef} from "react";
import { motion } from "framer-motion";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	Box,
	Wrap,
	WrapItem,
	Center,
	SimpleGrid,
	forwardRef,
	Heading,

	useDisclosure
} from "@chakra-ui/react";

const MotionModalContent = motion(ModalContent);

const IframeModal = props => {
	console.log("IframeModal props",props);
	const modalDisclosure = useDisclosure();
	const [state_animate,setState_animate] = useState( {} );
	const [state_animationDuration,setState_animationDuration] = useState( 0.4 );
	const [state_iframeSource,setState_iframeSource] = useState( false );

	const modalRef = useRef();
	
	useEffect(()=>{
		modalDisclosure.onOpen();

		window.closeFashioncraftDesignToolModal = () => {
			/* the modal wants to be centered. If we just change the x value (left), it
			* moves to where we want. But when we decrease the width at the same time, it wants to shift
			* itself further to the right to compensate for the smaller width.
			* So we have to compensate for that compensation.
			*/
			console.log("closeFashioncraftDesignToolModal called");
			let elRect = document.getElementById("basketAdd").getBoundingClientRect();
			let modalRect = modalRef.current.getBoundingClientRect();
			let newX = elRect.x - modalRect.x;

			// ok great but since we're decreasing the width as well, we have to compensate for that shift
			let offsetDiff = (modalRect.width - elRect.width) / 2;
			newX -= offsetDiff;

			let animateTo = {
				height: elRect.height + "px",
				width: elRect.width + "px",
				margin: 0,
				x: newX,
				y: elRect.y,
				opacity: 0
			};
			console.log("animateTo",animateTo);
			let dt = new Date();
			console.log("setting state",dt.getTime());
			// setState_animate(animateTo);
			console.log("closeFashioncraftDesignToolModal complete");
		}

		return ()=>{
			window.closeFashioncraftDesignToolModal = null;
		}
	},[modalDisclosure]);

	let {setSource} = props;
	useEffect(()=>{
		if ( state_animate && Object.keys(state_animate).length === 0 && state_animate.constructor === Object ) {
			// do nothing, it's empty
		} else {
			console.log("state_animate useEffect running");
			let dt = new Date();
			//console.log("starting timeout",dt.getTime());
			let timeout = setTimeout(()=>{
				let dtB = new Date();
				//console.log("firing timeout",dtB.getTime());
				modalDisclosure.onClose();
				setSource(false);
				console.log("state_animate useEffect complete");
			},state_animationDuration * 1000);

			return ()=>{clearTimeout(timeout);};
		}
	},[state_animate,modalDisclosure,setSource,state_animationDuration]);

	return (
		<Modal
			isOpen={modalDisclosure.isOpen}
			onClose={window.closeFashioncraftDesignToolModal}
			size="6xl"
		>
			<ModalOverlay />
			<MotionModalContent
				className={props.styles.optionModal}

				animate={state_animate}
				transition={{ ease: "easeOut", duration: state_animationDuration }}
				ref={modalRef}
				style={{overflow:"hidden",height:"95%",margin:"10px 0px 0px 0px"}}
			>
				<ModalHeader className="blueHeader">
					{props.title}
					<ModalCloseButton />
				</ModalHeader>
				<ModalBody style={{height:"100%",padding:"0px"}}>
					<iframe
						src={props.source}
						style={{margin:"0px",padding:"0px",height:"100%",width:"100%"}}
					/>
				</ModalBody>
			</MotionModalContent>
		</Modal>
	);
}; // IframeModal

export default IframeModal;