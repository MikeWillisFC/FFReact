import {Fragment} from "react";
import _ from "lodash";
import axios from "axios";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Center,Spinner } from '@chakra-ui/react';

import AllReviews from "../../components/AllReviews";

import styles from "../../styles/allReviews.module.scss";

const Reviews = props => {
   //console.log("Reviews rendering, props",props);
   let globalConfig = useSelector((state)=>{
      return state.global;
   });
   return (
      <Fragment>
         {
            props.reviews ? (
               <Fragment>
                  <Fragment>
                     <p>
                        All Reviews for
                        <Link href={`/page/FF/PROD/${props.code}`}>
                           <a className={styles.prodLink}>
                              {props.reviews.pName}
                           </a>
                        </Link>
                     </p>
                     <AllReviews domain={globalConfig.domain} reviews={props.reviews} code={props.code} />
                  </Fragment>
               </Fragment>
            ) : (
               <Center>
                  <Spinner />
               </Center>
            )
         }
      </Fragment>
   );
};

// server-side render and pre-render
export async function getStaticPaths() {
   let config = await import("../../config/config");
   let axResponse = await axios.get(`https://${config.default.domain}/api/get/ti.php`);
   return {
      paths: axResponse.data.items.map(item=>({ params: { code: item } })),
      fallback: true
   };
};
export async function getStaticProps(context) {
   let config = await import("../../config/config");
   let axResponse = await axios.get(`${config.default.apiEndpoint_static}&sft=reviews&code=${context.params.code}`);
   return {
      props: {...axResponse.data,code:context.params.code},
      revalidate: config.default.cacheKeepAlive.rvws
   };
};

export default Reviews;