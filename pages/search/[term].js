import {Fragment,useState,useEffect,useCallback} from "react";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import he from "he";
import { useRouter } from 'next/router';
import {
   Box,
   Heading,
   Stack,
   Skeleton
} from "@chakra-ui/react";

import ProductList from "../../components/ProductList";
import {messagesActions} from "../../store/slices/messages";
import {parseMessages} from "../../utilities";
import config from "../../config/config";

import catStyles from "../../styles/category.module.scss";

let defaultSettings = {
   viewType: "list",
   boost: true,
   boostType: "divide",
   fuzzyThreshold: -1, // set to -1 to turn off fuzzy entirely
   resultsPerPage: 32,
   start: 0, // remember start is 0-based!
   listDescriptionLength: 600,
   api: "2013",
   searchEndpoint: "search-favorfavor2013api-w3vrujg4gxjma6gk2usjhxao5y.us-east-1.cloudsearch.amazonaws.com",
   searchPath: "/2013-01-01/search?",
   relativeSR: false,
   allowSpellCorrection: true,
   or: false,
   fuzzy: false,
   boostStrength: 1,
   defaultOperator: false, // if no results, change this to 'or' and try again
   size: 100 // aka resultsPerPage
};

const Search = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });
   const dispatch = useDispatch();

   const [st_term,sst_term] = useState("");
   const [st_originalTerm,sst_originalTerm] = useState("");
   const [st_allowSpellcheck,sst_allowSpellcheck] = useState(true);
   const [st_loading,sst_loading] = useState(false);
   const [st_results,sst_results] = useState(false);
   const [st_searchPhrase,sst_searchPhrase] = useState(false);
   const [st_viewType,sst_viewType] = useState("list");

   const { query } = useRouter();

   let { term,viewType } = query;
   // console.log("router query",query);
   // console.log("router term",term);

   useEffect(()=>{
      if ( viewType === "grid" || viewType === "list" ) {
         sst_viewType(viewType);
      }
   },[viewType]);

   let runSearch = useCallback(async (term,allowSpellcheck) => {
      const headers = { 'Content-Type': 'multipart/form-data' };
      let bodyFormData = new FormData();
      bodyFormData.set( "term", term );

      if ( !allowSpellcheck ) {
         bodyFormData.set( "nsc", "1" );
      }

      sst_loading( true );
      dispatch(messagesActions.setErrorMessages([]));
      const response = await axios.post( `https://${globalConfig.apiDomain}/api/search/`, bodyFormData, {
         headers: headers,
         withCredentials: true
      });
      if ( response ) {
         parseMessages(response.data,dispatch,messagesActions);
         if ( response.status ) {
            sst_loading( false );
            console.log("response.data",response.data);

            // ok then
            if ( response.data.searchPhrase ) {
               sst_searchPhrase(response.data.searchPhrase);
            }

            if ( response.data.resultSet ) {
               // that's good news..

               sst_results(
                  response.data.resultSet.resultSet.hits.hit.map(hit=>{
                     let result = {
                        ...hit.fields,
                        thumbnail: hit.fields.thumbpath,
                        highlightedName:(hit.highlights ? hit.highlights.name : false),
                        price: (hit.fields.pennyprice ? hit.fields.pennyprice : parseFloat(hit.fields.price) * 100),
                        basePrice: (hit.fields.pennyprice ? hit.fields.pennyprice : parseFloat(hit.fields.price) * 100),
                        score: parseFloat(hit.fields._score)
                     };
                     if ( hit.exprs && hit.exprs.name_sales ) {
                        result.boostedScore = parseFloat(hit.exprs.name_sales);
                     }
                     return (result);
                  })
               );
            }
         }
      }
   },[globalConfig.apiDomain,dispatch]); // runSearch

   useEffect(()=>{
      if ( !term ) {
         sst_term("");
         sst_results(false);
         sst_searchPhrase(false);
      } else {
         runSearch(term,st_allowSpellcheck);
      }
   },[term,st_allowSpellcheck,runSearch]);

   useEffect(()=>{
      sst_allowSpellcheck(true);
   },[term]);

   let renderLoading = () => {
      return (
         <Fragment>
            Searching...
            <Stack>
               <Skeleton height='50px' />
               <Skeleton height='50px' />
               <Skeleton height='50px' />
               <Skeleton height='50px' />
               <Skeleton height='50px' />
               <Skeleton height='50px' />
               <Skeleton height='50px' />
            </Stack>
         </Fragment>
      );
   }; // renderLoading

   return (
      <Box>
         {
            st_searchPhrase ? (
               <Fragment>
                  {
                     !st_loading ? (
                        <Fragment>
                           <Heading as='h1' size='md'>
                              Results for &apos;{st_searchPhrase.searchPhrase}&apos;
                           </Heading>

                           {
                              st_searchPhrase.spellCorrected && (
                                 <Box
                                    style={{cursor:"pointer"}}
                                    onClick={()=>{sst_allowSpellcheck(false)}}
                                 >
                                    Search instead for {st_searchPhrase.searchPhraseOriginal}
                                 </Box>
                              )
                           }

                           {
                              st_results ? (
                                 <Box>
                                    <ProductList
                                       products={st_results}
                                       sortFields={["price","bestMatch"]}
                                       allowViewChoice={true}
                                       viewType={st_viewType}
                                    />
                                 </Box>
                              ) : ""
                           }
                        </Fragment>
                     ) : (
                        renderLoading()
                     )
                  }
               </Fragment>
            ) : (
               renderLoading()
            )
         }



      </Box>
   );
}; // Search

export default Search;