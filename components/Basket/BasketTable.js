import { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
   HStack,
   Stack,
   Skeleton,
   Box,
   Center,
   Container,
   Table,
   Thead,
   Tbody,
   Tr,
   Th,
   Td,
   AlertIcon,
   Alert,
   AlertDescription,
   Divider,
   Button,
   Drawer,
   DrawerBody,
   DrawerHeader,
   DrawerOverlay,
   DrawerContent,
   DrawerCloseButton,

   useDisclosure
} from "@chakra-ui/react";

import ItemRow from "./ItemRow";
import IframeModal from "../ProductDisplay/IframeModal";

import { loadScript } from "../../utilities/";

import styles from "../../styles/basket.module.scss";
import prodStyles from "../../styles/product.module.scss";

const BasketTable = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

	const [st_iframeMFR,sst_iframeMFR] = useState(null);
	const [st_FCInitScript,sst_FCInitScript] = useState(false);

   /* props.viewType:
   *  -- shoppingCart: interactions = quantity, remove
   *  -- savedBasket: interactions = move to cart / remove
   *  -- orderStatus: interactions = none
   */
	useEffect(()=>{
		if ( st_FCInitScript && !document.getElementById("FCRDInit") ) {
			loadScript(st_FCInitScript,"FCRDInit");
		}
	},[
		st_FCInitScript
	]);

   let columns = [];
   let quantityEditable;
   switch( props.viewType ) {
   case "shoppingCart":
      columns = ["thumb","Name","Price","Quantity","Total","Remove"];
      quantityEditable = true;
      break;
   case "savedBasket":
      columns = ["thumb","Name","Quantity","Date Added","Move To Cart","Remove"];
      quantityEditable = false;
      break;
   case "orderStatus":
      columns = ["thumb","Name","Quantity","Price","Total"];
      quantityEditable = false;
      break;
   }

   console.log("columns",columns);

   return (
		<Fragment>
			<Table className={styles.basketTable}>
				<Thead>
					<Tr>
						<Th className={styles.thumbColumn}>&nbsp;</Th>
						<Th className={styles.nameColumn}>Name</Th>

						{ columns.includes("Price") && <Th className={styles.priceColumn}>Price</Th> }
						{ columns.includes("Quantity") && <Th className={styles.qtyColumn}>Quantity</Th> }
						{ columns.includes("Total") && <Th className={styles.qtyColumn}>Total</Th> }
						{ columns.includes("Date Added") && <Th className={styles.qtyColumn}>Date Added</Th> }
						{ columns.includes("Move To Cart") && <Th className={styles.qtyColumn}>Move To Cart</Th> }
						{ columns.includes("Remove") && <Th className={styles.qtyColumn}>Remove</Th> }

					</Tr>
				</Thead>
				<Tbody>
					{
						props.items.map( item => {
							return (
								<ItemRow
									columns={columns}
									key={item.lineID}
									item={item}

									quantityEditable={quantityEditable}
									viewType={props.viewType}
									basketID={props.basketID}
									onQuantityChange={props.onQuantityChange}
									onRemoveItem={props.onRemoveItem}
									onMoveToBasket={props.onMoveToBasket}
									setIframeMFR={sst_iframeMFR}
									setFCInitScript={sst_FCInitScript}
								/>
							)
						})
					}
				</Tbody>
			</Table>

			<IframeModal
				globalConfig={props.globalConfig}
				styles={prodStyles}
				title="Design Your Item"
				manufacturer={st_iframeMFR}
			/>
		</Fragment>
   );
};

export default BasketTable;