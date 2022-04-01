import {useState,useEffect} from "react";
import Head from 'next/head';
import Link from "next/link";
import Image from 'next/image';
import { useSelector } from "react-redux";
import axios from "axios";
import {
   Box,
   Heading,
   HStack,
   Flex
} from '@chakra-ui/react';

import styles from "../../../styles/weddingPlanning.module.scss";

const WeddingPlanning = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   const [st_articles,sst_articles] = useState([]);

   useEffect(()=>{
      let getArticles = async () => {
         const response = await axios.get(`${globalConfig.apiEndpoint_static}&sft=weddingPlanning`);
         //console.log("response",response);
         if ( response.status ) {
            if ( response.data.status ) {
               // great
               sst_articles(response.data.articles);
            }
         }
      };
      getArticles();
   },[globalConfig.apiEndpoint_static]);

   return (
      <Box>
         <Head>
            <title>Wedding Planning Tips from Favor Favor</title>
            <meta name="keywords" content="wedding planning, wedding planning tips, help wedding planning" />
            <meta name="description" content="Need help planning your wedding? Check out our tutorials on planning all aspects of your wedding, from invitations and seating charts to receptions and honeymoons, Favor Favor has it all covered!" />
            <meta name="robots" content="noodp, noydir" />
         </Head>

         <Heading as="h1" size="md" className="darkBlue">
            Wedding Planning Help
         </Heading>

         <Box>
            <Box
               padding={4}
               columnGap="8px"
               // https://chakra-ui.com/docs/styled-system/features/the-sx-prop
               sx={{ columnCount: [1, 2] }}
            >
               {
                  st_articles.map(articleList=>{
                     return (
                        <Box key={`articleList|${articleList.name}`} className={styles.articleList}>
                           <Heading as="h2" size="sm" className="darkBlue">
                              {articleList.name}
                           </Heading>
                           {
                              articleList.articles.map(article=>{
                                 //console.log("article",article);
                                 //article.thumbnail = JSON.parse(article.thumbnail);
                                 return (
                                    <Box key={`article|${article.id}`} className={styles.article}>
                                       <Flex spacing='2px'>
                                          <Box
                                             width={`${parseFloat(article.thumbnail.width) + 10}px`}
                                             textAlign="center"
                                             marginRight="5px"
                                          >
                                             <Link href={article.path}>
                                                <a>
                                                   <Image
                                                      src={`https://${globalConfig.apiDomain}${article.thumbnail.path}`}
                                                      width={article.thumbnail.width}
                                                      height={article.thumbnail.height}
                                                      alt={article.thumbnail.alt}
                                                   />
                                                </a>
                                             </Link>
                                          </Box>
                                          <Box flex="1">
                                             <Link href={article.path}>
                                                <a>
                                                   {article.title}
                                                </a>
                                             </Link>
                                             <br />
                                             {article.subtitle}
                                             <br />
                                             <em>{article.authorNote}</em>
                                          </Box>
                                       </Flex>


                                    </Box>
                                 )
                              })
                           }
                        </Box>
                     );
                  })
               }
            </Box>

         </Box>

      </Box>
   );
}; // WeddingPlanning

export default WeddingPlanning;