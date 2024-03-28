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

import { getViewportSize } from "../../utilities";

const MotionModalContent = motion(ModalContent);

let animationDuration = 0.4;

const IframeModal = props => {
	console.log("IframeModal props",props);

	const modalDisclosure = useDisclosure({ defaultIsOpen: false });

	const [state_animate,setState_animate] = useState( {} );
	const [state_animationDuration,setState_animationDuration] = useState( 0.4 );
	const [state_iframeSource,setState_iframeSource] = useState( false );

	const modalRef = useRef();

	let  {
		manufacturer
	} = props;
	

	useEffect(()=>{
		// allow iframe modal for whatever reasons we want
		if ( manufacturer === "Fashioncraft" ) {
			let permittedSources = [
				"//www.fashioncraft.com"
			];

			window.openFashioncraftDesignToolModal = href => {
				//console.log("href",href);

				/* IMPORTANT: only use links that point to trusted sources!
				*/
				let proceed = false;
				permittedSources.forEach(source=>{
					//console.log("source",source);
					//console.log("href.substr(0,source.length - 1)",href.substr(0,source.length - 1));
					if ( !proceed && href.substr(0,source.length) === source ) {
						proceed = true;
					}
				});

				//console.log("proceed",proceed);

				if ( proceed ) {
					if ( href.substr(0,5) === "http:" ) {
						href = `https:${href.substring(5,href.length - 1)}`;
					} else if ( href.substr(0,2) === "//" ) {
						href = `https:${href}`;
					}

					setState_iframeSource( href );
					modalDisclosure.onOpen();
				}
			}; // openFashioncraftDesignToolModal

			window.openFashioncraftDesignToolModal_proxied = (href,preload=false) => {
				/* 2022-12-20: this almost works. It gets some minor CORS errors, and FC needs to
				* use it in their init script instead of us hacking our way into it.
				* Also the iframe message is ignored because the origin is NPF instead of FC, so
				* FC needs to check if we're proxying, and if so, allow the source domain to be
				* in the origin list as well.
				* Also this all needs thorough security review.
				*/
				console.log("openFashioncraftDesignToolModal_proxied called");
				if ( preload ) {
					console.log("preloading");
				}
				let url = new URL('https:' + href);
				let queryString = "?";
				for (const [key, value] of url.searchParams) {
					queryString = `${queryString}${key}=${value}&`;
			
					if ( key === "i" && value.substr(0,5).toLowerCase() === "6795s" ) {
						queryString = `${queryString}showOnly=Glassware&`;
					}
				}
			
				// 2024-03-19: probably unnecessary but doesn't hurt
				let safeList = [
					"www.favorfavor.com",
					"www.nicepricefavors.com",
					"localhost",
					"ffr.vercel.app",
				];
				
				if ( !safeList.includes( window.location.hostname ) ) {
					// hmph
				} else {
					let domain = window.location.hostname === "localhost" || window.location.hostname === "ffr.vercel.app" ? "www.favorfavor.com" : window.location.hostname;
					let proxyURL = `https://${domain}/pscripts/FCConnect/proxy.php${queryString}`;
			
					let viewportSize = getViewportSize();
			
					setState_iframeSource( proxyURL );
					modalDisclosure.onOpen();
				}
			}; // openFashioncraftDesignToolModal_proxied

			// window.closeFashioncraftDesignToolModal = ()=>{
			// 	setState_iframeSource(false);
			// }; // closeFashioncraftDesignToolModal
		}

		return ()=>{
			window.openFashioncraftDesignToolModal = null;
		}
	},[
		manufacturer,
		modalDisclosure,
	]);


	useEffect(()=>{
		window.modalDisclosure = modalDisclosure;
		console.log("closeFashioncraftDesignToolModal defining, modalRef:",modalRef);
		window.closeFashioncraftDesignToolModal = () => {
			/* the modal wants to be centered. If we just change the x value (left), it
			* moves to where we want. But when we decrease the width at the same time, it wants to shift
			* itself further to the right to compensate for the smaller width.
			* So we have to compensate for that compensation.
			*/
			console.log("closeFashioncraftDesignToolModal called");
			let elRect = document.getElementById("basketAdd").getBoundingClientRect();
			console.log("closeFashioncraftDesignToolModal running, modalRef:",modalRef);
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
			
			setState_animate(animateTo);
			
			console.log("closeFashioncraftDesignToolModal complete");
		}

		setTimeout(()=>{
			console.log("closeFashioncraftDesignToolModal 2 second wait, modalRef:",modalRef);
		},[2000]);
		setTimeout(()=>{
			console.log("closeFashioncraftDesignToolModal 5 second wait, modalRef:",modalRef);
		},[5000]);
		setTimeout(()=>{
			console.log("closeFashioncraftDesignToolModal 10 second wait, modalRef:",modalRef);
		},[10000]);

		return ()=>{
			window.closeFashioncraftDesignToolModal = null;
		}
	},[modalDisclosure]);

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
				console.log("state_animate useEffect complete");
			},state_animationDuration * 1000);

			return ()=>{clearTimeout(timeout);};
		}
	},[state_animate,modalDisclosure,state_animationDuration]);

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
					{
						state_iframeSource ? (
							<iframe
								src={state_iframeSource}
								style={{margin:"0px",padding:"0px",height:"100%",width:"100%"}}
							/>
						) : ""
					}
				</ModalBody>
			</MotionModalContent>
		</Modal>
	);
}; // IframeModal

export default IframeModal;