import {Fragment,useRef,useEffect,useState,useCallback,memo} from "react";
import { motion,useAnimation } from "framer-motion";
import { FaCircle,FaEdit,FaCheckCircle,FaTimesCircle } from 'react-icons/fa';
import axios from "axios";
import { useSelector } from "react-redux";
import {
	Icon,
	Tr,
	Td,
	Spinner,
	Box,
	Button,
} from "@chakra-ui/react";

import {formatPrice} from "../../utilities";

import baskStyles from "../../styles/basket.module.scss";

const OptionVal = props => {

	/* 2021-12-09: not in use for whatever reason... */
	const [state_hover,setState_hover] = useState(false);

	return (
		state_hover ? (
			<Fragment>
				<input value={props.value} />fdsa
			</Fragment>
		) : (
			<b>{props.value}</b>
		)
	);
};

let parseStoredFCDesign = design => {
	let greekMonogram = [];
	let monogram = [];
	let clipart = false;
	let rowsAdded = 0;
	let options = [];
	
	for( let [key, value] of Object.entries(design) ) {
		//console.log(`${key}: ${value}`);
		let displayPrompt = false;
		let displayValue = false;
		switch( key ) {
		case "design":
			displayPrompt = "Design";
			displayValue = `${value.graphicName} - ${value.colorName}`;
			break;
		case "backgroundColor":
			displayPrompt = "Background Color";
			displayValue = value.colorName;
			break;
		case "borderColor":
			displayPrompt = "Border Color";
			displayValue = value.colorName;
			break;
		case "pattern":
			displayPrompt = "Pattern";
			displayValue = value.patternName;
			break;
		case "patternColor":
			displayPrompt = "Pattern Color";
			displayValue = value.name;
			break;
		case "clipArt":
			displayPrompt = "Clip Art";
			displayValue = value.graphicName;
			clipart = value;
			break;
		case "designText":
			displayPrompt = "Design Text";
			displayValue = value;
			break;
		case "foilColor":
			displayPrompt = "Foil Color";
			displayValue = value.colorName;
			break;
		case "color":
			displayPrompt = "Color";
			displayValue = value.colorName;
			break;
		case "font":
			displayPrompt = "Font";
			displayValue = value.name;
			break;
		case "Headline Color":
			displayPrompt = "Headline Color";
			displayValue = value[0];
			break;
		case "textColor":
			displayPrompt = "Text Color";
			displayValue = value[0];
			break;
		case "designText":
			displayPrompt = "Design Text";
			displayValue = value;
			break;
		case "textLine1":
			displayPrompt = "Text Line 1";
			displayValue = value;
			break;
		case "textLine2":
			displayPrompt = "Text Line 2";
			displayValue = value;
			break;
		case "textLine3":
			displayPrompt = "Text Line 3";
			displayValue = value;
			break;
		case "greekLetter1":
			greekMonogram[0] = value;
			break;
		case "greekLetter2":
			greekMonogram[1] = value;
			break;
		case "greekLetter3":
			greekMonogram[2] = value;
			break;
		case "monogramLetter1":
			monogram[0] = value;
			break;
		case "monogramLetter2":
			monogram[1] = value;
			break;
		case "monogramLetter3":
			monogram[2] = value;
			break;
		}
		// console.log("displayPrompt",displayPrompt);
		// console.log("displayValue",displayValue);
		if ( displayPrompt && displayValue ) {
			options.push({
				code: displayPrompt,
				value: displayValue,
				editable: false,
				price: false,
				maxLength: 9999,
			});
		}
	}

	if ( clipart ) {
		if ( greekMonogram.length && clipart.graphicID === "MGM014" ) {
			options.push({
				code: "Greek Monogram",
				value: greekMonogram.join(""),
				editable: false,
				price: false,
				maxLength: 9999,
			});
		}

		if ( monogram.length ) {
			switch( clipart.graphicID ) {
			case "MGM010":
			case "MGM011":
				options.push({
					code: "Monogram",
					value: monogram.join(""),
					editable: false,
					price: false,
					maxLength: 9999,
				});
				break;
			}
		}
	}

	return options;
}; // parseStoredFCDesign

const OptionRow = memo(props => {
	console.log("OptionRow rendering, props:",props);

	let globalConfig = useSelector((state)=>{
		return state.global;
	});

	let {
		setTotalRows,
		totalOptions,
		setIframeMFR,
		setFCInitScript,
		optionKey,
	} = props;

	// console.log("OptionRow rendering, optionKey:",optionKey);
	// console.log("OptionRow prompt:",JSON.parse( props.option.prompt ));

	const [state_optionWidth,setState_optionWidth] = useState("auto");
	const [state_optionVal,setState_optionVal] = useState(props.option.value);
	const [state_lastOptionVal,setState_lastOptionVal] = useState(props.option.value);
	const [state_rowCollapsing,setState_rowCollapsing] = useState(props.motion.collapsing);
	const [state_updating,setState_updating] = useState(false);
	const [state_updateResult,setState_updateResult] = useState(null);
	const [state_focused,setState_focused] = useState(false);
	const [st_fcReactDesignToolChoices,sst_fcReactDesignToolChoices] = useState([]);

	const controls = useAnimation();

	let { basketID,lineID,option,receiveWidth,optionWidth } = props;
	let { attID,attCode } = option;
	let propsOptionValue = props.option.value
	let collapsing = props.motion.collapsing;

	//console.log("option",option);

	let spanRef = useRef();

	let getPrompt = prompt => {
		//console.log("prompt",prompt);
		let result;
		if ( prompt.substr(0,1) === "{" ) {
			result = JSON.parse( prompt );
		} else {
			result = {prompt:prompt};
		}
		//console.log("result",result);
		return result;
	}; // getPrompt

	let maxLength = 30;
	let prompt = getPrompt( option.prompt );
	//console.log("prompt",prompt);
	if ( prompt.textLimit ) {
		maxLength = parseInt(prompt.textLimit);
	}

	if ( prompt.FCReactDesignTool ) {

	}

	useEffect(()=>{
		setState_rowCollapsing(collapsing);
		if ( collapsing ) {
			//console.log("collapsing");
			controls.start("collapsed");
		}
	},[
		controls,
		collapsing
	]);

	useEffect(()=>{
		if ( spanRef.current ) {
			//console.log("spanRef.current.offsetWidth:",spanRef.current.offsetWidth);
			receiveWidth(spanRef.current.offsetWidth);
		}
	},[
		//spanRef.current,
		receiveWidth
	]);

	useEffect(()=>{
		setState_optionVal(propsOptionValue);
	},[propsOptionValue]);

	useEffect(()=>{
		//console.log("received optionWidth:",props.optionWidth);
		if ( optionWidth ) {
			setState_optionWidth( `${optionWidth}.px` );
		}
	},[optionWidth]);

	let formatCamelCase = useCallback(promptText => {
		/* Cleans up attribute prompts (ex. "borderColor" -> "Border Color") */
		let needsFormatting = false;

		// If this prompt is camelCase, it probably needs formatting:
		for (let i=0; i<promptText.length; i++) {
			if ( (i>0) && (promptText[i].match(/[a-zA-Z0-9]/i)) && (promptText[i] === promptText[i].toUpperCase()) ) {
				needsFormatting = true;
				break;
			}
		}

		// Adjust spacing:
		if ( needsFormatting ) {
			let editted = false;
			do {
				editted = false;
				for (let i=0; i<promptText.length; i++) {
					let char = promptText[i];
					let prevChar = promptText[i-1];
					if (
						(i>0) && (prevChar !== " ") &&
						((char.match(/[a-zA-Z]/i) && char === char.toUpperCase() && !(char === 'D' && prevChar === 'I')) ||
						(char.match(/[0-9]/i)))
					) {
						// Add space before this character
						let beforeSpace = promptText.slice(0, i);
						let afterSpace = promptText.slice(i, promptText.length);
						promptText = beforeSpace + " " + afterSpace;
						editted = true;
						break;
					}
				}
			} while (editted === true);
		}

		// Make sure first chracter is capitalized:
		promptText = promptText.charAt(0).toUpperCase() + promptText.substr(1);

		return promptText;
	},[]); // formatCamelCase

	let handleEditableChange = event => {
		//console.log("change",event.target.value);
		setState_optionVal(event.target.value);
	}; // handleEditableChange

	useEffect(()=>{
		if ( state_updateResult ) {
			let timeout = setTimeout(()=>{
				setState_updateResult(null);
			}, 2000);
			return ()=>{
				clearTimeout(timeout);
			}
		}
	},[state_updateResult]);

	let handleEditableBlur = useCallback(async (event) => {
		setState_focused(false);
		// console.log("blur",state_optionVal);
		// console.log("option",option);
		// console.log("basketID",props.basketID);

		const headers = { 'Content-Type': 'multipart/form-data' };
		let bodyFormData = new FormData();
		bodyFormData.set( "responseType", "json" );
		bodyFormData.set( "basketID", basketID );
		bodyFormData.set( "basketLineID", lineID );
		bodyFormData.set( "attID", attID );
		bodyFormData.set( "attCode", attCode );
		bodyFormData.set( "value", state_optionVal );

		//console.log("globalConfig",globalConfig);
		setState_updating( true );

		try {
			const response = await axios.post( `https://${globalConfig.domain}/pscripts/misc/attEdit.php`, bodyFormData, {
				headers: headers,
				withCredentials: true
			});
			if ( response && response.status ) {
				setState_updating( false );
				//console.log("response.data",response.data);
				if ( response.data.status === "1" && response.data.validated ) {
					setState_updateResult("success");
					setState_lastOptionVal( state_optionVal );
				} else {
					setState_updateResult("error");
					setState_optionVal( state_lastOptionVal );
				}
			} else {
				setState_updating( false );
				setState_updateResult("error");
				setState_optionVal( state_lastOptionVal );
			}
		} catch (e) {
			setState_updating( false );
			setState_updateResult("error");
			setState_optionVal( state_lastOptionVal );
		}

	},[
		basketID,
		lineID,
		globalConfig.domain,
		attID,
		state_optionVal,
		state_lastOptionVal,
		attCode
	]); // handleEditableBlur

	let charCountStyle = useCallback(()=>{
		return {
			color: state_optionVal.length < maxLength ? "" : "#f00"
		};
	},[
		state_optionVal.length,
		maxLength,
	]);

	let handleKeyUp = event => {
		if ( event.key === 'Enter' || event.keyCode === 13 ) {
			event.preventDefault();
			event.target.blur();
		}
	}; // handleKeyUp

	let printValue = useCallback((settings)=>{
		// console.log("printValue called, settings:",settings);
		if ( !settings.FCReactDesignTool ) {
			return (
				<b>{settings.value}</b>
			);
		} else {
			return (
				<a
					className={"fashioncraftDesigner"}
					href={`${prompt.promptTarget}&edit=1&id=${settings.value}`}
					style={{display:"inline-block",margin:"2px auto",opacity:"0",pointerEvents:"none"}}
					onClick={event=>{
						event.preventDefault();
						// handleClick
					}}
				>
					<Button
						display="inlineBlock"
						colorScheme="blue"
						onClick={event=>{
							event.preventDefault();
							// handleClick
						}}
						size="sm"
						margin="0px"
					>
						edit
					</Button>
				</a>
			);
		}
	},[
		prompt,
	]); // printValue

	let renderRow = useCallback(rowSettings=>{
		return (
			<Tr key={rowSettings.key} className={baskStyles.optionRow}>
				<Td colSpan={(rowSettings.price ? 1 : (props.editable ? 4 : 3))} className={(state_rowCollapsing ? baskStyles.collapsing : '')}>
					<motion.div
						variants={props.motion.variants}
						transition={props.motion.transition}
						initial={props.motion.initial}
						exit={props.motion.exit}
						animate={controls}
					>
						<span ref={spanRef} style={{display:"inline-block",width:state_optionWidth}}>
							{
								rowSettings.editable === "true" && props.editable ? (
									<Icon as={FaEdit} color="#000" boxSize=".8em" />
								) : (
									<Icon as={FaCircle} color="#000" boxSize=".8em" />
								)
							}
							{" "}
							{formatCamelCase(rowSettings.code)}
						</span>
						<span style={{display:"inline-block",margin:"0px 8px 0px 3px"}}>:</span>
						<Fragment>
							{
								rowSettings.editable === "true" && props.editable ? (
									<Fragment>
										<input
											value={rowSettings.value}
											onKeyUp={handleKeyUp}
											onChange={handleEditableChange}
											onBlur={handleEditableBlur}
											onFocus={()=>{setState_focused(true)}}
											maxLength={rowSettings.maxLength}
										/>
										{
											state_focused && (
												<span className="blue">
													{" "}<span style={charCountStyle}>{rowSettings.value.length}</span>{` - ${rowSettings.maxLength} Characters - Max`}{" "}
												</span>
											)
										}
										{ state_updating && <Spinner size="sm" /> }
										{ state_updateResult === "success" && <Icon as={FaCheckCircle} color="#090" boxSize="1.4em" /> }
										{ state_updateResult === "error" && <Icon as={FaTimesCircle} color="#f00" boxSize="1.4em" /> }
									</Fragment>
								) : (
									<Fragment>
										{printValue({
											value: rowSettings.value,
											FCReactDesignTool: rowSettings.FCReactDesignTool
										})}
									</Fragment>
								)
							}
						</Fragment>
					</motion.div>
				</Td>
				{
					rowSettings.price ? (
						<Fragment>
							<Td className={(state_rowCollapsing ? baskStyles.collapsing : '')}>
								<motion.div
									variants={props.motion.variants}
									transition={props.motion.transition}
									initial={props.motion.initial}
									exit={props.motion.exit}
									animate={controls}
								>
									{formatPrice(parseInt(rowSettings.price))}
								</motion.div>
							</Td>
							<Td className={(state_rowCollapsing ? baskStyles.collapsing : '')}></Td>
							<Td className={(state_rowCollapsing ? baskStyles.collapsing : '')}>
								<motion.div
									variants={props.motion.variants}
									transition={props.motion.transition}
									initial={props.motion.initial}
									exit={props.motion.exit}
									animate={controls}
								>
									{formatPrice(props.quantity * parseInt(rowSettings.price))}
								</motion.div>
							</Td>
						</Fragment>
					) : null
				}
			</Tr>
		);
	},[
		charCountStyle,
		controls,
		formatCamelCase,
		handleEditableBlur,
		props.editable,
		props.motion.exit,
		props.motion.initial,
		props.motion.transition,
		props.motion.variants,
		props.quantity,
		state_focused,
		state_optionWidth,
		state_rowCollapsing,
		state_updateResult,
		state_updating,
		printValue,
	]);

	useEffect(()=>{
		if ( prompt.FCReactDesignTool ) {
			retrieveFCReactDesignToolChoices(option.value);
			window.fashioncraftDTEditorAllowNullOnUnload = false;
			
			/* be careful when setting this piece of state! It defaults to false, and when you
			* set it to a new Object, it triggers a re-render, which causes this to run again and
			* set it again, so you'll have an infinite loop. So, only set it if it's false, that means
			* it has not been set yet. If it's anything other than false, return the previous object.
			*/
			setFCInitScript(prev=>{
				if ( prev === false ) {
					return {
						script: "https://www.fashioncraft.com/rDesigner/init/editDesign.js",
						rerun: ()=>{
							if ( window.fashioncraftDTEditor?.init && typeof ( window.fashioncraftDTEditor.init ) === "function" ) {
								window.fashioncraftDTEditor.init();
							}
						}
					};
				} else {
					if ( prev.rerun && typeof( prev.rerun ) === "function" ) {
						prev.rerun();
					}
					return prev;
				}
			});
			setIframeMFR("Fashioncraft");
			if ( !window.fashioncraftOnComplete || typeof( window.fashioncraftOnComplete ) === "function" ) {
				window.fashioncraftOnComplete = {};
			}
			window.fashioncraftOnComplete[option.value] = ()=>{
				// console.log("window.fashioncraftOnComplete called");
				sst_fcReactDesignToolChoices([]);
			}
		}
	},[
		prompt,
		option.value,
		retrieveFCReactDesignToolChoices,
		setIframeMFR,
		setFCInitScript,
	]);

	let checkFCReactDesignToolChoices = option=>{
		try {
			let parsedPrompt = JSON.parse( option.prompt );
			if ( parsedPrompt.FCReactDesignTool ) {
				return "checkFCReactDesignToolChoices valid";
			// 	return await retrieveFCReactDesignToolChoices(option.value);
			}
		} catch (error) {
			return "checkFCReactDesignToolChoices error";
		}

		return "";
	}; // checkFCReactDesignToolChoices

	let retrieveFCReactDesignToolChoices = useCallback( async (designID,force=false)=>{
		// console.log("retrieveFCReactDesignToolChoices called, designID:",designID);
		if ( force || !st_fcReactDesignToolChoices.length ) {
			// console.log("proceeding");
			// first check if a design is stored, if so use that
			let storedDesign;
			if ( storedDesign = window.fashioncraftDT?.store?.get(designID) ) {
				// console.log("storedDesign",storedDesign);
				let options = parseStoredFCDesign(storedDesign.design);
				sst_fcReactDesignToolChoices( options );
			} else {
				// console.log("fetching, st_fcReactDesignToolChoices:",st_fcReactDesignToolChoices);
				let formData = new FormData();
				formData.append( "id", designID );
				let response = await fetch("https://www.fashioncraft.com/rDesigner/api/retrieveDesigns.php",{
					method: "post",
					body: formData
				});
				
				// console.log("response",response);

				if ( !response.ok ) {
					sst_fcReactDesignToolChoices([]);
				} else {
					let jsonResponse = await response.json();
					// console.log("jsonResponse",jsonResponse);
					let chosenDesign = jsonResponse.chosenDesign;
					let options = [];
					Object.keys(chosenDesign).forEach(function(key) {
						options.push({
							code: key,
							value: chosenDesign[key],
							editable: false,
							price: false,
							maxLength: 9999,
						})
					});
					sst_fcReactDesignToolChoices( options );
				}
			}
		}

		return "word";
	},[
		st_fcReactDesignToolChoices
	]); // retrieveFCReactDesignToolChoices

	useEffect(()=>{
		if ( st_fcReactDesignToolChoices.length ) {
			setTotalRows(totalOptions + 1 + st_fcReactDesignToolChoices.length);
		} else {
			setTotalRows(totalOptions + 1);
		}
	},[
		st_fcReactDesignToolChoices,
		setTotalRows,
		totalOptions,
	]);

	let renderFCReactDesignChoices = useCallback(()=>{
		// console.log("renderFCReactDesignChoices running, st_fcReactDesignToolChoices:",st_fcReactDesignToolChoices);

		return st_fcReactDesignToolChoices.map((choice,index)=>{
			// console.log("choice",choice);
			choice.FCReactDesignTool = false;
			return renderRow({...choice,key:`${optionKey}|c${index}`});
		});
	},[
		st_fcReactDesignToolChoices,
		renderRow,
		optionKey,
	]);

	return (
		<Fragment>
			{
				renderRow({
					code: option.code,
					value: state_optionVal,
					editable: option.editable,
					price: option.price,
					maxLength: maxLength,
					FCReactDesignTool: prompt.FCReactDesignTool,
					key: `${optionKey}|p`,
				})
			}
			{
				st_fcReactDesignToolChoices.length ? (
					renderFCReactDesignChoices()
				) : null
			}
		</Fragment>
	);
});

OptionRow.displayName = "OptionRow";

export default OptionRow;