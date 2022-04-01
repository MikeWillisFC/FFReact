import {useState,useEffect} from "react";
import Head from 'next/head';
import Link from "next/link";
import { useRouter } from 'next/router'
import { useSelector } from "react-redux";
import axios from "axios";
import {
   Box,
   Heading,
   Stack,
   Flex,
   Skeleton,
   SkeletonCircle,
   SkeletonText
} from '@chakra-ui/react';

const WeddingPlanning = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   const [st_article,sst_article] = useState(false);

   const { query } = useRouter();

   let { aid } = query;

   console.log("aid",aid);

   useEffect(()=>{
      let getArticle = async () => {
         const response = await axios.get(`${globalConfig.apiEndpoint_static}&sft=weddingPlanning&aid=${aid}`);
         console.log("response",response);
         if ( response.status ) {
            if ( response.data.status ) {
               // great
               sst_article(response.data.article);
            }
         }
      };
      getArticle();
   },[
      aid,
      globalConfig.apiEndpoint_static
   ]);

   return (
      <Box>
         {
            !st_article ? (
               <Stack>
                  <Skeleton height='20px' />
                  <Skeleton height='20px' />
                  <Skeleton height='20px' />
               </Stack>
            ) : (
               <Box>
                  <Head>
                     <title>Wedding Planning: {st_article.title}</title>
                  </Head>

                  <Heading as="h1" size="md" className="darkBlue">
                     {st_article.title}
                  </Heading>
                  <p><em>{st_article.authorNote}</em></p>

                  <Box dangerouslySetInnerHTML={{__html: _.unescape(st_article.article.replace(/src='/g, `src='${globalConfig.apiDomain}`).replace(/src="/g, `src="https://${globalConfig.apiDomain}`) )}}>

                  </Box>
               </Box>
            )
         }
      </Box>
   );
}; // WeddingPlanning

export default WeddingPlanning;