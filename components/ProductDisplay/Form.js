import {useState,useRef,useCallback,useEffect,memo} from "react";
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import { useRouter } from "next/router";

import Attributes from "../../components/ProductDisplay/Attributes";
import AddToCart from "../../components/ProductDisplay/AddToCart";
import {productFormActions} from "../../store/slices/productForm";
import {messagesActions} from "../../store/slices/messages";
import {parseMessages} from "../../utilities";

import styles from "../../styles/product.module.scss";

const Form = memo(props => {
	let {
		globalConfig,
		product
	} = props;

	const dispatch = useDispatch();
	const router = useRouter();

	console.log("Form rendering, props",props);
	useEffect(()=>{console.log("globalConfig changed:", globalConfig);},[globalConfig]);
	useEffect(()=>{console.log("product changed:", product);},[product]);

	const [state_highlightInvalids,setState_highlightInvalids] = useState(false);
	const [state_attributeValidity,setState_attributeValidity] = useState([]);

	let quantityRef = useRef();
	let ref_attributeValidity = useRef([]);
	let attributeValuesRef = useRef([]);

	let productForm = useSelector((state)=>{
		return state.productForm;
	});

	let adjustAttributeValidity = useCallback((code="",newValue="") => {
		// console.log("adjustAttributeValidity called");
		// console.log("adjustAttributeValidity code:",code);
		// console.log("adjustAttributeValidity newValue:",newValue);
		// console.log("adjustAttributeValidity productForm.attributes:",productForm.attributes);
		if ( productForm.attributes[1] ) {
			// console.log("adjustAttributeValidity productForm.attributes[1].value",productForm.attributes[1].value);
		}

		// state-based method...
		productForm.attributes.forEach((attribute,index)=>{
			let value = attribute.value || "";
			if ( attribute.code === code ) {
				// console.log("adjustAttributeValidity code match");
				value = newValue;
			}
			// console.log("adjustAttributeValidity value",value);
			let isValid = attribute.required && !value ? false : true;
			if ( value !== attribute.value ) {
				dispatch(productFormActions.setValue({index:index,value:value}));
			}
			if ( isValid !== attribute.isValid ) {
				dispatch(productFormActions.setIsValid({index:index,isValid:isValid}));
			}
		});
	},[productForm.attributes,dispatch]);

	useEffect(()=>{
		adjustAttributeValidity();
	},[adjustAttributeValidity,productForm.attributes]);

	/* it's not intuitive, but miva puts the template code in the code field, and the code in the template code field
	* wtf?? I guess they think of the code as whatever the template is saying the code is. Jesus.
	*/
	let receiveAttributeValue = useCallback((value, code, templateCode, rowIndex, attemp_id) => {
		// console.log("receiveAttributeValue called",value,code,templateCode);
		adjustAttributeValidity(code, value);
	},[
		adjustAttributeValidity
	]); // receiveAttributeValue


	let prepFormSubmit = quantityOverride => {
		let bodyFormData = new FormData();

		bodyFormData.set( "Action", "ADPR" );
		bodyFormData.set( "Store_Code", "FF" );
		bodyFormData.set( "Product_Code", product.code );
		bodyFormData.set( "Quantity", quantityOverride !== false ? quantityOverride : quantityRef.current );

		return bodyFormData;
	}; prepFormSubmit

	let runFormSubmit = async (bodyFormData,goToBasket,returnResult) => {
		const headers = { 'Content-Type': 'multipart/form-data' };
		if ( true ) {
			dispatch(messagesActions.clearMessages());
			const response = await axios.post( globalConfig.apiEndpoint, bodyFormData, {
				headers: headers,
				withCredentials: true
			});
			if ( response.status ) {
				parseMessages(response.data,dispatch,messagesActions);
				if ( goToBasket ) {
					props.miscModalDisclosure.onClose();
					console.log("pushing route");
					router.push(`/Basket`);
				} else if ( returnResult ) {
					return true;
				}
			} else if ( returnResult ) {
				return false;
			}
		} else {
			const response = await fetch( globalConfig.apiEndpoint, {
				method: 'post',
				credentials: 'include',
				mode: 'cors',
				body: bodyFormData
			});
		}
		//console.log("response",response);
	}; // runFormSubmit

	let checkValidity = useCallback(() => {
		// console.log("checkValidity called, productForm.attributes:",productForm.attributes);
		let highlightInvalids = false;
		productForm.attributes.forEach(attribute=>{
			if ( !highlightInvalids && !attribute.isValid ) {
				highlightInvalids = true;
			}
		});

		// console.log("highlightInvalids",highlightInvalids);
		setState_highlightInvalids(highlightInvalids);
		return !highlightInvalids;
	},[productForm.attributes]);

	let handleSubmit = (event,goToBasket=true,quantityOverride=false,returnResult=false) => {
		event.preventDefault();
		// console.log("form submitted");
		// console.log("form submitted, attributeValuesRef.current:",attributeValuesRef.current);

		if ( !checkValidity() ) {
			// console.log("not valid");
		} else {
			let bodyFormData = prepFormSubmit(quantityOverride);

			if ( productForm.attributes.length ) {
				// console.log("productForm.attributes.length:",productForm.attributes.length);
				// console.log("productForm.attributes:",productForm.attributes);
				productForm.attributes.forEach((attribute,index)=>{
					//console.log(`attribute ${index}`,attribute);
					index++; // Miva doesn't start at 0
					let attKey = `Product_Attributes[${index}]`;

					/* it's not intuitive, but miva puts the template code in the code field, and the code in the template code field.
					* wtf?? I guess they think of the code as whatever the template is saying the code is. Jesus.
					*/
					bodyFormData.set( `${attKey}:value`, attribute.value );
					if ( attribute.templateCode ) {
						bodyFormData.set( `${attKey}:code`, attribute.templateCode );
					}
					if ( attribute.attemp_id && attribute.attemp_id !== "0" && attribute.code ) {
						bodyFormData.set( `${attKey}:template_code`, attribute.code );
					}
				});
			}
			//console.log("bodyFormData",bodyFormData);

			return runFormSubmit(bodyFormData,goToBasket,returnResult);
		}

	}; // handleSubmit

	let renderAttributes = () => {
		return (
			<Attributes
				product={product}
				attributes={product.attributes}
				parentTemplateCode=""
				globalConfig={globalConfig}
				miscModalDisclosure={props.miscModalDisclosure}
				setMiscModal={props.setMiscModal}
				receiveAttributeValue={receiveAttributeValue}
				samplesPermitted={props.samplesPermitted}
				//attributeValidity={ref_attributeValidity}
				attributeValidity={state_attributeValidity}
				adjustAttributeValidity={adjustAttributeValidity}
				attributeValuesRef={attributeValuesRef}
				highlightInvalids={state_highlightInvalids}
			/>
		);
	};

	let formID = "basketAdd";

	return (
		<form
			method="post"
			id={formID}
			action={globalConfig.apiEndpoint}
			onSubmit={handleSubmit}
			className={styles.basketAddForm}
		>
			{
				product.customFields.offerSeparateOptions.trim() === "" ? renderAttributes() : ""
			}

			<AddToCart
				formID={formID}
				quantity={quantityRef.current}
				quantityRef={quantityRef}
				minimum={props.minimum}
				enforceMinimum={product.customFields.enforceMinimum.trim() !== ""}
				samplesPermitted={props.samplesPermitted}

				// for attribute rendering if offerSeparateOptions is turned on
				offerSeparateOptions={product.customFields.offerSeparateOptions.trim() !== ""}
				renderAttributes={renderAttributes}
				miscModalDisclosure={props.miscModalDisclosure}
				setMiscModal={props.setMiscModal}
				handleSubmit={handleSubmit}
				renderSpinner={props.renderSpinner}
			/>
		</form>
	);
});

Form.displayName = "Form";

export default Form;