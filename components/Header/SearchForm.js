import { Fragment,useState,useEffect,useRef,useCallback } from "react";
import { FaSearch } from 'react-icons/fa';
import {useRouter} from 'next/router';
import { useSelector } from "react-redux";
import { CUIAutoComplete } from 'chakra-ui-autocomplete';
import {
   Icon,
   Box,
   Input,
   Button
} from "@chakra-ui/react";

import AutocompleteInput from "./AutocompleteInput";

import styles from "../../styles/autocomplete.module.scss";

import {addScript} from "../../utilities";

const SearchForm = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   const [st_search,sst_search] = useState("");
   const [st_autocompleteTerms,sst_autocompleteTerms] = useState([]);

   const router = useRouter();

   let inputFieldRef = useRef();

   let runSearch = useCallback((event=false,val=false) => {
      if ( event ) {
         event.preventDefault();
      }

      let search = val ? val : st_search;

      router.push({
         pathname: `/search/${search}`
      });
   },[st_search,router]);

   let handleKeyUp = event => {
      if ( event.key === 'Enter' || event.keyCode === 13 ) {
         event.preventDefault();
         runSearch();
         inputFieldRef.current.blur();
      } else if ( event.key === "Escape" || event.keyCode === 27 ) {
         inputFieldRef.current.blur();
      }
   }; // handleKeyUp

   let handleFocus = event => {
      //console.log("handleFocus called,st_autocompleteTerms:",st_autocompleteTerms);
      if ( !window.autocompleteTerms ) {
         addScript( `https://${globalConfig.apiDomain}/jquery/jquery.autocompleteTerms.js`,`autocompleteTerms`,false);
         let maxWaits = 20;
         let waits = 0;
         let waitingForTerms = setInterval(()=>{
            if ( window.jQueryAutocomplete || waits === maxWaits ) {
               clearInterval( waitingForTerms );
            }
            if ( window.jQueryAutocomplete ) {
               window.autocompleteTerms = window.jQueryAutocomplete.map(term=>{
                  return { value: term, label: term };
               });
               sst_autocompleteTerms(window.autocompleteTerms);
            }
         },[50]);
      } else if ( !st_autocompleteTerms.length ) {
         // 2022-02-07: that's weird.. but it happens after autocomplete has been selected..
         sst_autocompleteTerms(window.autocompleteTerms);
      }
   }; // handleFocus

   let handleAutocomplete = val => {
      sst_search(val);
      runSearch(false,val);
   }; // handleAutocomplete

   return (
      <form className="nomarg" action="/search/" method="get" onSubmit={event=>event.preventDefault()} autoComplete="off">


         <Box>
            <AutocompleteInput
               style={{backgroundColor:"#fff",zIndex:"1",paddingRight:"30px"}}
               maxLength="45"
               name="search"
               size="sm"

               width={["70%","70%","200px"]}
               marginRight={["30px","48px"]}
               value={st_search}
               onChange={event=>sst_search(event.target.value)}
               onKeyUp={handleKeyUp}
               onFocus={handleFocus}

               autocompleteChangeVal={handleAutocomplete}
               autocompleteTerms={st_autocompleteTerms}
               autocompleteMaxTerms={10}
               autocompleteFieldRef={inputFieldRef}
               autocompleteClass={styles.autocomplete}
            />

            <Button
               style={{zIndex:"5"}}
               size="sm"
               colorScheme="blue"
               right={["2px","70px","2px"]}
               onClick={runSearch}
               leftIcon={<FaSearch />}
            >
               Search
            </Button>
         </Box>





         { false && <p className="nomarg fLeft"><input className="search_submit miscSpriteMain search-button" type="submit" value="" /></p> }
      </form>
   );
}; // SearchForm

export default SearchForm;