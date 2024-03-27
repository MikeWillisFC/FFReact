import {Fragment,useState,useEffect,useRef,useCallback} from "react";
import { Box,Button,Select,Icon,HStack,Input,Checkbox,Tag,TagLeftIcon,TagLabel,Textarea } from "@chakra-ui/react";
import { FaRegCheckCircle,FaAngleDown,FaInfoCircle } from 'react-icons/fa';
import axios from "axios";
import Image from 'next/image';
import _ from "lodash";

import OptionModal from "./OptionModal";
import IframeModal from "./IframeModal";
import TagPrompt from "./TagPrompt";
import CheckboxAttribute from "./AttributeFields/CheckboxAttribute";
import FCDesignToolPrompt from "./FCDesignToolPrompt";
import FCReactDesignToolPrompt from "./FCReactDesignToolPrompt";
import { openMiscModal, getViewportSize } from "../../utilities";

const Attribute = memo(props => {
	const [state_modal,setState_modal] = useState(false);
	const [state_value,setState_value] = useState("");
	const [state_textValue,setState_textValue] = useState("");
	const [state_selectIcon,setState_selectIcon] = useState(null);
	const [state_disabled,setState_disabled] = useState(false);
	const [state_iframeSource,setState_iframeSource] = useState( false );

	console.log("Attribute rendering, props:",props);
	const elRef = useRef();
	const buttonRef = useRef();

	let {domain} = props.globalConfig;
	let {
		attribute,
		receiveAttributeValue,
		onChange,
		samplesPermitted,
		rowIndex,
		setMiscModal,
		miscModalDisclosure,
		onChangeVal
	} = props;

	useEffect(()=>{
		if ( onChangeVal.code === attribute.code ) {
			// console.log("onChangeVal.val",onChangeVal.val);
			setState_value( onChangeVal.val );
			setState_textValue( onChangeVal.val );
		}
	},[onChangeVal,attribute.code]);

	useEffect(()=>{
		let icon;
		if ( state_value ) {
			icon = (
				<span style={{display:"inline-block",marginLeft:"5px"}}>
					<Image src={`https://${domain}/images/misc/greencheck.gif`} alt="check" width="18" height="18" />
				</span>
			);
		}
		setState_selectIcon( icon );
	},[state_value,domain]);

	useEffect(()=>{
		// console.log("Attribute useEffect running");
		/* it's not intuitive, but miva puts the template code in the code field, and the code in the template code field
		* wtf?? I guess they think of the code as whatever the template is saying the code is. Jesus.
		*/
		//console.log("attribute",attribute);
		// receiveAttributeValue( state_value, attribute.code, attribute.templateCode, rowIndex, attribute.attemp_id );
		// if ( attribute.onChange ) {
		//    onChange( state_value, attribute.onChange, attribute.code, attribute.templateCode );
		// }
	},[
		state_value,
		receiveAttributeValue,
		attribute.code,
		attribute.templateCode,
		attribute.onChange,
		attribute.attemp_id,
		onChange,
		rowIndex
	]);
	// useEffect(()=>{console.log("state_value changed",state_value);},[state_value]);
	// useEffect(()=>{console.log("receiveAttributeValue changed",receiveAttributeValue);},[receiveAttributeValue]);
	// useEffect(()=>{console.log("attribute changed",attribute);},[attribute]);
	// useEffect(()=>{console.log("onChange changed",onChange);},[onChange]);

	useEffect(()=>{
		if ( typeof( props.attribute.disabled ) === "string" ) {
			setState_disabled( props.attribute.disabled === "true" );
		}
	},[props.attribute.disabled]);

	useEffect(()=>{
		// allow iframe modal for whatever reasons we want
		if ( props.product.customFields.MANUFACTURER === "Fashioncraft" ) {
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
				}
			}; // openFashioncraftDesignToolModal_proxied

			// window.closeFashioncraftDesignToolModal = ()=>{
			// 	setState_iframeSource(false);
			// }; // closeFashioncraftDesignToolModal
		}

		return ()=>{
			window.openFashioncraftDesignToolModal = null;
		}
	},[props.product.customFields.MANUFACTURER]);

	// console.log("attribute.prompt",attribute.prompt);
	// console.log("attribute.prompt.substr(0,1)",attribute.prompt.substr(0,1));
	if ( attribute.prompt.substr(0,1) === "{" ) {
		attribute.promptDecoded = JSON.parse( attribute.prompt );
		// console.log("attribute.promptDecoded",attribute.promptDecoded);
		attribute.prompt = attribute.promptDecoded.prompt;
	}

	let renderDecodedPrompt = useCallback(() => {
		//console.log("prompt",prompt);
		return (
			<Button
				width="90%"
				colorScheme="blue"
				onClick={(event)=>getChoices(event)}
				ref={buttonRef}
			>
				{attribute.prompt}
			</Button>
		);
	},[getChoices,attribute.prompt]); // renderDecodedPrompt

	let _getChoices = _.memoize(async (get) => {
		return await axios.get(`https://${props.globalConfig.domain}${attribute.previewURL}`);
	});
	let getChoices = useCallback(async (event) => {
		event.preventDefault();
		let response = await _getChoices(`https://${domain}${attribute.previewURL}`);
		if ( response.status ) {
			//console.log("response.data",response.data);
			setState_modal({
				options: response.data,
				title: attribute.prompt
			});
		}
	},[
		domain,
		attribute.previewURL,
		_getChoices,
		attribute.prompt
	]); // getChoices

	let handleTextChange = useCallback(event=>{
		// console.log("handleTextChange called:",event.target.value);
		setState_textValue(event.target.value);
	},[]);

	useEffect(()=>{
		let timer = setTimeout(()=>{
			handleChange(false,state_textValue);
		},[100]);
		return ()=>{
			clearTimeout(timer);
		}
	},[state_textValue,handleChange]);

	let handleChange = useCallback((event,value=false) => {
		// console.log("handleChange called");
		// console.log("event",event);
		// console.log("value",value);
		let newValue = value || (event ? event.target.value : "");
		// console.log("newValue",newValue);
		setState_value( newValue );

		receiveAttributeValue( newValue, attribute.code, attribute.templateCode, rowIndex, attribute.attemp_id );
		if ( attribute.onChange ) {
			onChange( newValue, attribute.onChange, attribute.code, attribute.templateCode );
		}
	},[
		receiveAttributeValue,
		attribute.code,
		attribute.templateCode,
		attribute.onChange,
		attribute.attemp_id,
		onChange,
		rowIndex
	]);

	let handleSelectClick = useCallback(event => {
		//console.log("handleSelectClick called");
		if ( !state_disabled ) {
			// nothing to see here
		} else if ( buttonRef.current ) {
			// pretend they clicked the design button
			buttonRef.current.click();
		}
	},[
		state_disabled,
		//buttonRef.current // Mutable values like 'buttonRef.current' aren't valid dependencies because mutating them doesn't re-render the component.
	]); // handleSelectClick

	let renderAttribute = useCallback(() => {
		console.log("renderAttribute attribute",attribute);
		let style = {};

		let handleInfoClick = (event,title,url) => {
			event.preventDefault();
			openMiscModal({
				setModal: setMiscModal,
				disclosure: miscModalDisclosure,
				title: title,
				href: url,
				size: "xl"
			});
		};

		switch( attribute.type ) {
		case "checkbox":
			if ( attribute.code.substr( 0, 13 ) === "ScriptInclude" ) {
				// 2024-03-22: this is handled in Attributes.js
				return null;
			} else {
				return (
					<CheckboxAttribute
						styles={props.styles}
						attribute={attribute}
						onChange={handleChange}
					/>
				);
			}
			break;
		case "textarea":
		case "memo":
			let textAreaMaxLength = 30;
			if ( attribute.textLimit ) {
				textAreaMaxLength = attribute.textLimit;
			}
			let textAreaCharCountStyle = {
				color: state_value.length < textAreaMaxLength ? "" : "#f00"
			};
			return (
				<Box>
					{ attribute.prePrompt || "" }
					{
						attribute.required ? (
							<b>{attribute.prompt}</b>
						) : (
							<Fragment>{attribute.prompt}</Fragment>
						)
					}

					<HStack
						spacing="4px"
						width="90%"
						marginRight="5%"
						marginLeft="5%"
					>
						<Textarea
							data-code={attribute.code}
							width="58%"
							ref={elRef}
							maxLength={textAreaMaxLength}
							value={state_value}
							onChange={handleChange}
						/>
						<Box>
							<span
								className="blue"
							>
								{" "}<span style={textAreaCharCountStyle}>{state_value.length}</span>{` - ${textAreaMaxLength} Characters - Max`}
							</span>
						</Box>
					</HStack>
				</Box>
			);
			break;
		case "text":
			let maxLength = 30;
			if ( attribute.textLimit ) {
				maxLength = attribute.textLimit;
			}
			let charCountStyle = {
				color: state_textValue.length < maxLength ? "" : "#f00"
			};

			if ( attribute.code === "DesignID" ) {
				window.FashioncraftDesignIDSelector = "input[data-code='DesignID']";
			}

			if ( attribute.FCReactDesignTool ) {
				return (
					<FCReactDesignToolPrompt
						attribute={attribute}
						globalConfig={props.globalConfig}
					/>
				);
			} else {
				return (
					<Box>
						{ attribute.prePrompt || "" }
						{
							attribute.required ? (
								<b>{attribute.prompt}</b>
							) : (
								<Fragment>{attribute.prompt}</Fragment>
							)
						}

						<HStack
							spacing="4px"
							width="90%"
							marginRight="5%"
							marginLeft="5%"
						>
							<Input
								data-code={attribute.code}
								width="58%"
								ref={elRef}
								type="text"
								maxLength={maxLength}
								value={state_textValue}
								onChange={handleTextChange}
							/>
							<Box>
								<span
									className="blue"
								>
									{" "}<span style={charCountStyle}>{state_textValue.length}</span>{` - ${maxLength} Characters - Max`}
								</span>
							</Box>
						</HStack>
					</Box>
				);
			}
			break;
		case "select":
			if ( attribute.hiddenSetting === "hiddenOption" ) {
				style.display = "none";
			}
			let defaultStyle = {display:"inline",margin:"0px",padding:"0px"};
			if ( attribute.required ) {
				defaultStyle.fontWeight = "bold" ;
			}

			switch( attribute.code ) {
			case "GiftBox":
				if ( !window.fashioncraftFormFields ) { window.fashioncraftFormFields = {}; }
				window.fashioncraftFormFields.boxes = elRef.current;
				break;
			case "TagsOrStickers":
				if ( !window.fashioncraftFormFields ) { window.fashioncraftFormFields = {}; }
				window.fashioncraftFormFields.tagsOrStickers = elRef.current;
				break;
			case "DesignType":
				if ( !window.fashioncraftFormFields ) { window.fashioncraftFormFields = {}; }
				window.fashioncraftFormFields.designType = elRef.current;
				break;
			}

			return (
				<Box>
					{ attribute.prePrompt || "" }
					{
						attribute.previewURL ? (
							renderDecodedPrompt()
						) : (
							attribute.tagPrompt ? (
								<TagPrompt
									attribute={attribute}
									globalConfig={props.globalConfig}
								/>
							) : (
								attribute.FCDesignTool ? (
									<FCDesignToolPrompt
										attribute={attribute}
										globalConfig={props.globalConfig}
									/>
								) : (
									<div style={defaultStyle} dangerouslySetInnerHTML={{__html: _.unescape(attribute.prompt)}}></div>
								)
							)
						)
					}
					{
						attribute.info && (
							<Fragment>
								{" "}
								<Tag
									colorScheme='teal'
									className={props.styles.infoLink}
									onClick={event=>handleInfoClick(event,attribute.info.title,`https://${props.globalConfig.domain}${attribute.info.url}`)}
								>
									<Icon as={FaInfoCircle} />
									{" "}
									<TagLabel>{attribute.info.prompt}</TagLabel>
								</Tag>
							</Fragment>
						)
					}
					<HStack
						spacing="4px"
						width="90%"
						marginRight="5%"
						marginLeft="5%"
						onClick={handleSelectClick}
						style={style}
					>
						<Select
							width="90%"
							name={attribute.code}
							value={state_value}
							placeholder="Please Choose"
							onChange={handleChange}
							ref={elRef}
							disabled={state_disabled}
						>
							{
								attribute.options.map(option=>{
									if ( !samplesPermitted && option.code.toLowerCase() === "sample" ) {
										return "";
									} else {
										return ( <option key={option.code} value={option.code}>{option.prompt}</option> );
									}
								})
							}
						</Select>
						{state_selectIcon}
					</HStack>
				</Box>
			);
			break;
		}
	},[
		attribute,
		elRef,
		state_value,
		state_textValue,
		handleChange,
		handleTextChange,
		renderDecodedPrompt,
		handleSelectClick,
		samplesPermitted,
		state_selectIcon,
		props.globalConfig,
		state_disabled,
		setMiscModal,
		miscModalDisclosure,
		props.styles
	]); // renderAttribute

	return (
		<Fragment>
			{renderAttribute()}
			{
				state_modal !== false &&
				<OptionModal
					globalConfig={props.globalConfig}
					styles={props.styles}
					modal={state_modal}
					setModal={setState_modal}
					setValue={handleChange}
					elRef={elRef}
				/>
			}
			{
				state_iframeSource && (
					<IframeModal
						source={state_iframeSource}
						setSource={setState_iframeSource}
						globalConfig={props.globalConfig}
						styles={props.styles}
						title="Design Your Item"
					/>
				)
			}
		</Fragment>
	);
}, (prevProps,currentProps)=>{
	let isEqual = JSON.stringify(prevProps) === JSON.stringify(currentProps);
	console.log("Attribute isEqual",isEqual);
	return isEqual;
}); // Attribute

export default Attribute;