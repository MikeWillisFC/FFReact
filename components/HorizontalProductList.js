import {Fragment} from "react";
import Link from "next/link";
// import { FixedSizeList as List } from 'react-window';
// import { Virtuoso } from 'react-virtuoso'
// import { ResponsiveReactWindow } from 'responsive-react-window';
import { useBreakpointValue } from "@chakra-ui/react";

import ProductThumb from "./ProductThumb";

import styles from "../styles/horizontalProductList.module.scss";

// 2021-10-05: works fine but makes lots of divs for items outside of view
const HorizontalProductList_ORIGINAL = (props) => {
   return (
      <div className={styles.list}>
         <h2 className="darkBlue">
            <Link href={props.target}>{props.text}</Link>
         </h2>
         <div className={styles.itemsContainer}>
            <div className={styles.items}>
               {
                  props.items.map(item=>{
                     return <ProductThumb key={item.code} size="medium" {...item} />
                  })
               }
            </div>
         </div>
      </div>
   );
};

// 2021-10-05: works fine
const HorizontalProductList_INTERSECT = (props) => {

   const breakPoint = useBreakpointValue({ base: "mobile", md: "notMobile" });

   return (
      <div className={styles.list}>
         <h2 className="darkBlue">
            <Link href={props.target}>{props.text}</Link>
         </h2>
         <div className={styles.itemsContainer}>
            <div className={styles.items}>
               {
                  props.items.map((item,index)=>{
                     /* we lazy load / intersect on row 4+ and image 4+. Basically, anything that
                     * will show up in the viewport on a mobile device will NOT be lazy loaded
                     */
                     let requireIntersect;
                     if ( breakPoint === "mobile" ) {
                        requireIntersect = props.rowNumber > 2 || index > 2;
                     } else {
                        requireIntersect = props.rowNumber > 2 || index > 5;
                     }
                     // console.log("props.rowNumber",props.rowNumber);
                     // console.log("index",index);
                     // console.log("requireIntersect",requireIntersect);
                     return <ProductThumb eagerLoad={!requireIntersect} requireIntersect={requireIntersect} key={item.code} size="medium" {...item} />
                  })
               }
            </div>
         </div>
      </div>
   );
};

// 2021-10-05: works but is not responsive. wtf
// const HorizontalProductList_WINDOW = (props) => {
//    const Column = ({ index, style }) => {
//       return (
//          <ProductThumb style={style} key={props.items[index].code} size="medium" {...props.items[index]} />
//       );
//    }
//
//    return (
//       <div className={styles.list}>
//          <h2 className="darkBlue">
//             <Link href={props.target}>{props.text}</Link>
//          </h2>
//          <List
//             itemCount={props.items.length}
//             itemSize={153}
//             layout="horizontal"
//             width={600}
//             height={300}
//             style={{overflowY:"hidden"}}
//          >
//             {Column}
//          </List>
//       </div>
//    );
// };
// 2021-10-05: works, is responsive, but is only vertical. wtf
// const HorizontalProductList_VIRTUOSO = (props) => {
//    return (
//       <div className={styles.list}>
//          <h2 className="darkBlue">
//             <Link href={props.target}>{props.text}</Link>
//          </h2>
//          <Virtuoso
//             style={{ height: "300px", width: "100%", border: "1px solid #f00" }}
//             totalCount={props.items.length}
//             itemContent={index => <Fragment><ProductThumb size="medium" {...props.items[index]} /></Fragment>}
//          />
//       </div>
//    );
// };
// 2021-10-05: doesn't work
// const HorizontalProductList_RESPONSIVEWINDOW = (props) => {
//    const Holder = props => {
//       return <div>yo</div>;
//    };
//
//    return (
//       <div className={styles.list}>
//          <h2 className="darkBlue">
//             <Link href={props.target}>{props.text}</Link>
//          </h2>
//          <ResponsiveReactWindow
//             entries={props.entries}
//             ItemComponent={Holder}
//          />
//       </div>
//    );
// };

// HorizontalProductList_ORIGINAL
// HorizontalProductList_WINDOW
// HorizontalProductList_VIRTUOSO
// HorizontalProductList_RESPONSIVEWINDOW
 // HorizontalProductList_INTERSECT
const HorizontalProductList = HorizontalProductList_INTERSECT;

export default HorizontalProductList;