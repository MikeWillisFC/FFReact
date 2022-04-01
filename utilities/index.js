import axios from "axios";

// used wherever the cart is displayed
export const quantityIsValid = item => {
   //console.log("quantityIsValid, item:", item);
   if ( item.customFields.minimum && (item.customFields.enforceMinimum === "1" || item.customFields.enforceMinimum === "yes") ) {
      let quantity = parseInt(item.quantity);
      // there's a minimum and it's enforced
      if ( quantity >= parseInt( item.customFields.minimum ) ) {
         return true;
      } else {
         if ( quantity === 1 && !item.customFields.blockSamples.trim() ) {
            // samples are allowed, we're good
            return true;
         } else {
            // no good
            return false;
         }
      }
   } else {
      return true;
   }
};


// see https://stackoverflow.com/a/46181/1042398
export const validateEmail = email => {
 const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 return re.test(email);
}

export const logOut = async (apiEndpoint) => {
   const response = await axios.get(`${apiEndpoint}&Action=LOGO&LOGO=1`, {
      withCredentials: true
   });
   if ( response && response.status === 200 ) {
      // console.log("logOut response.data",response.data);
      return response.data.cli && response.data.cli === "true";
   } else {
      return false;
   }
};

export const isLoggedIn = async (apiEndpoint) => {
   const response = await axios.get(`${apiEndpoint}&cAction=checkCLI`, {
      withCredentials: true
   });
   if ( response && response.status === 200 ) {
      console.log("isLoggedIn response.data",response.data);
      let result = response.data.cli && response.data.cli === "true";
      console.log("returning result:",result);
      return result;
   } else {
      return false;
   }
}; // checkLogin

export const parseMessages = (data,dispatch,messagesActions) => {
   // console.log("parseMessages called");
   // console.log("data",data);
   // console.log("dispatch",dispatch);
   // console.log("messagesActions",messagesActions);

   let errorMessages;
   let informationMessages;

   if ( data.messageList ) {
      errorMessages = [...data.messageList.errorMessages];
      informationMessages = [...data.messageList.informationMessages];
   } else {
      errorMessages = [];
      informationMessages = [];
   }

   // console.log("errorMessages A",errorMessages);
   // console.log("informationMessages A",informationMessages);

   if ( data.subMessageList ) {
      // console.log("data.subMessageList.errorMessages",data.subMessageList.errorMessages);
      // console.log("data.subMessageList.informationMessages",data.subMessageList.informationMessages);

      errorMessages = [...errorMessages,...data.subMessageList.errorMessages];
      informationMessages = [...informationMessages,...data.subMessageList.informationMessages];

      // console.log("errorMessages B",errorMessages);
      // console.log("informationMessages B",informationMessages);

      // de-dupe, see https://stackoverflow.com/a/9229821/1042398
      errorMessages = errorMessages.filter(function(item, pos) {
         return errorMessages.indexOf(item) === pos;
      });
      informationMessages = informationMessages.filter(function(item, pos) {
         return informationMessages.indexOf(item) === pos;
      });
   }

   // console.log("errorMessages C",errorMessages);
   // console.log("informationMessages C",informationMessages);

   if ( errorMessages.length ) {
      // that's not good
      // console.log("dispatching setErrorMessages");
      dispatch(messagesActions.setErrorMessages(errorMessages));
   }
   if ( informationMessages.length ) {
      // that's not good
      // console.log("dispatching setInformationMessages");
      dispatch(messagesActions.setInformationMessages(informationMessages));
   }

   return {
      errorMessages: errorMessages,
      informationMessages: informationMessages
   };
}; // parseMessages

export const addScript = (source,id,remove=true) => {
   /* 2021-08-11: first check if this script has already been added to the dom, perhaps
   * by another product page. If so, remove it
   */
   let existing = document.getElementById(id);
   if ( existing && remove ) {
      existing.remove();
   }

   if ( !existing || remove ) {
      const script = document.createElement("script");
      script.src = source;
      script.id = id;
      script.async = true;
      document.body.appendChild(script);
   }
}; // addScript


const openModal = options => {
   options.setModal({
      title: options.title,
      content: options.content,
      size: options.size,
      minHeight: options.minHeight || false,
      maxHeight: options.maxHeight || false
   });
}; // openModal
export const openMiscModal = async (options) => {
   options.disclosure.onOpen();
   if ( options.event ) {
      options.event.preventDefault();
   }

   if ( options.href ) {
      let response = await axios.get(options.href);
      if ( response.status ) {
         openModal({
            setModal: options.setModal,
            title: options.title,
            content: response.data,
            size: options.size,
            minHeight: options.minHeight || false,
            maxHeight: options.maxHeight || false
         });
      } else {
         // boo
      }
   } else if ( options.content ) {
      openModal({
         setModal: options.setModal,
         title: options.title,
         content: options.content,
         size: options.size,
         minHeight: options.minHeight || false,
         maxHeight: options.maxHeight || false
      });
   }
}; // openMiscModal

export const scrollTo = (ref) => {
   //console.log("scrollTo called on ref",ref);
   if ( ref && ref.current ) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
   }
}; // scrollTo

export const formatPrice = price => {
   // v1.0
   /* price is expected to be stored as cents. Divide by 100, format, and return
   */
   return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price / 100);
}

export const formatNumber = number => {
   // v1.0
   return new Intl.NumberFormat('en-US').format(number);
}

export const isZipUSorCA = zip => {
   return ( zip.match(/[a-zA-Z][0-9][a-zA-Z](-| |)[0-9][a-zA-Z][0-9]/) || /\d{5}-\d{4}$|^\d{5}$/.test(zip) );
};

export const getStateByZip = zip => {
	// v2, returns 'CANADA' if zip appears to be in canada
	let result = "";

	/* first we have to figure out if it's a canada zip code
	* these have letters so that's the first test
	*/
	if ( !isNaN(zip) ) {
		zip = zip.replace(/^\s+|\s+$/g, '');
		let allStates = new Array();
		allStates["AK"] = "9950099929";
		allStates["AL"] = "3500036999";
		allStates["AR"] = "71600729997550275505";
		allStates["AZ"] = "8500086599";
		allStates["CA"] = "9000096199";
		allStates["CO"] = "8000081699";
		allStates["CT"] = "0600006999";
		allStates["DC"] = "20000200992020020599";
		allStates["DE"] = "1970019999";
		allStates["FL"] = "32000339993410034999";
		allStates["GA"] = "3000031999";
		allStates["HI"] = "96700967989680096899";
		allStates["IA"] = "5000052999";
		allStates["ID"] = "8320083899";
		allStates["IL"] = "6000062999";
		allStates["IN"] = "4600047999";
		allStates["KS"] = "6600067999";
		allStates["KY"] = "40000427994527545275";
		allStates["LA"] = "70000714997174971749";
		allStates["MA"] = "0100002799";
		allStates["MD"] = "20331203312060021999";
		allStates["ME"] = "038010380103804038040390004999";
		allStates["MI"] = "4800049999";
		allStates["MN"] = "5500056799";
		allStates["MO"] = "6300065899";
		allStates["MS"] = "3860039799";
		allStates["MT"] = "5900059999";
		allStates["NC"] = "2700028999";
		allStates["ND"] = "5800058899";
		allStates["NE"] = "6800069399";
		allStates["NH"] = "03000038030380903899";
		allStates["NJ"] = "0700008999";
		allStates["NM"] = "8700088499";
		allStates["NV"] = "8900089899";
		allStates["NY"] = "004000059906390063900900014999";
		allStates["OH"] = "4300045999";
		allStates["OK"] = "73000731997340074999";
		allStates["OR"] = "9700097999";
		allStates["PA"] = "1500019699";
		//allStates["PR"] = "0060000729";
		allStates["PR"] = "0060000988";
		allStates["RI"] = "02800029990637906379";
		allStates["SC"] = "2900029999";
		allStates["SD"] = "5700057799";
		allStates["TN"] = "37000385997239572395";
		allStates["TX"] = "7330073399739497394975000799998850188599";
		allStates["UT"] = "8400084799";
		allStates["VA"] = "2010520199203012030120370203702200024699";
		allStates["VT"] = "0500005999";
		allStates["WA"] = "9800099499";
		allStates["WI"] = "49936499365300054999";
		allStates["WV"] = "2470026899";
		allStates["WY"] = "8200083199";
		let zipLength;
		let segments;
		for( let i in allStates ) {
			zipLength = String( allStates[i].length );
			// the zips will be 10, 20, 30, or 40 in length
			segments = new Array();
			switch (zipLength) {
			case "10":
				segments[0] = allStates[i].substring( 0, 5 );
				segments[1] = allStates[i].substring( 5, 10 );
				break;
			case "20":
				segments[0] = allStates[i].substring( 0, 5 );
				segments[1] = allStates[i].substring( 5, 10 );
				segments[2] = allStates[i].substring( 10, 15 );
				segments[3] = allStates[i].substring( 15, 20 );
				break;
			case "30":
				segments[0] = allStates[i].substring( 0, 5 );
				segments[1] = allStates[i].substring( 5, 10 );
				segments[2] = allStates[i].substring( 10, 15 );
				segments[3] = allStates[i].substring( 15, 20 );
				segments[4] = allStates[i].substring( 20, 25 );
				segments[5] = allStates[i].substring( 25, 30 );
				break;
			case "40":
				segments[0] = allStates[i].substring( 0, 5 );
				segments[1] = allStates[i].substring( 5, 10 );
				segments[2] = allStates[i].substring( 10, 15 );
				segments[3] = allStates[i].substring( 15, 20 );
				segments[4] = allStates[i].substring( 20, 25 );
				segments[5] = allStates[i].substring( 25, 30 );
				segments[6] = allStates[i].substring( 30, 35 );
				segments[7] = allStates[i].substring( 35, 40 );
				break;
			}

			for ( let j = 0; j <= segments.length; j += 2 ) {
				if ( zip >= segments[j] && zip <= segments[j+1] ) {
					result = i;
				}
			}
		}
	} else {
		/* it's likely that this is canadian
		* or that the user entered a letter by mistake
		*/
		// now use regex
		if ( zip.match( /[a-z]\d[a-z]\d[a-z]\d/i ).length ) {
			// looks like it's canada
			result = "CANADA";
		}
	}
	return result;
}; // getStateByZip

// ported from PHP from http://cookbooks.adobe.com/post_Resolve_province_from_Canadian_postal_code__PHP_ve-17899.html
export const getProvinceCode = postalCode => {
	switch( postalCode.toUpperCase().substring( 0, 1 ) ) {
		case "A": return "NL"; // Newfoundland and Labrador
		case "B": return "NS"; // Nova Scotia
		case "C": return "PE"; // Prince Edward Island
		case "E": return "NB"; // New Brunswick
		case "G":  // Eastern Quebec
		case "H":  // Metropolitan Montreal
		case "J": return "QC"; // Western Quebec
		case "K": // Eastern Ontario
		case "L": // Central Ontario
		case "M": // Metropolitan Toronto
		case "N": // Southwestern Ontario
		case "P": return "ON"; // Northern Ontario
		case "R": return "MB"; // Manitoba
		case "S": return "SK"; // Saskatchewan
		case "T": return "AB"; // Alberta
		case "V": return "BC"; // British Columbia
		case "X": return "NT,NU"; // Northwest Territories and Nunavut
		case "Y": return "YT"; // Yukon Territory
		default : return "";
	}
}; // getProvinceCode

// see https://stackoverflow.com/a/7719185/1042398
/* usage:
loadScript(cdnSource)
    .catch(loadScript.bind(null, localSource))
    .then(successCallback, failureCallback);
*/
export const loadScript = (src,id=false) => {
   return new Promise(function (resolve, reject) {
      let js;
      let add = true;
      js = document.createElement('script');
      js.src = src;
      js.onload = resolve;
      js.onerror = reject;
      js.async = true;
      if ( id ) {
         js.id = id;
         let existing = document.getElementById(id);
         if ( existing ) {
            add = false;
         }
      }
      if ( add ) {
         console.log("LOADSCRIPT adding id '" + id + "'", js);
         document.head.appendChild(js);
      }
   });
}

// 2021-10-27: see https://stackoverflow.com/a/1349426/1042398
export const semiRandomString = (length,startChar="") => {
   var result = startChar;
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt( Math.floor( Math.random() * charactersLength ) );
   }
   return result;
};

export const createMD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}
