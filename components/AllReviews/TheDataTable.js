import {memo} from "react";
import DataTable from 'react-data-table-component';

import ReviewStars from "../ProductDisplay/ReviewStars";
import Review from "../ProductDisplay/Review";

const TheDataTable = memo(props => {
   console.log("datatable rendering");
   console.log("props.reviews",props.reviews);
   let columns = [
      {
         name: 'Rating',
         selector: row=>row.rating,
         width:"110px",
         sortable: true,
         sortFunction: (rowA, rowB) => {
            let a = rowA.rating !== "" ? parseInt(rowA.rating) : 0;
            let b = rowB.rating !== "" ? parseInt(rowB.rating) : 0;
            if ( a > b ) { return 1; }
            if ( b > a ) { return -1; }
            return 0;
         },
         // eslint-disable-next-line react/display-name
         cell: row=>{
            return <ReviewStars domain={props.domain} stars={row.rating} />;
         }
      },
      {
         name: 'Date',
         selector: row=>row.printableDate,
         sortable: true,
         sortFunction: (rowA, rowB) => {
            let getSeconds = value => {
               if ( !value ) {
                  return 999999999999999;
               } else {
                  let val = value.split("/");
                  let date = new Date(`${val[2]}-${val[0]}-${val[1]}T00:00:00.000Z`);
                  return date.getTime() / 1000;
               }
            }; // getSeconds
            let a = getSeconds(rowA.printableDate);
            let b = getSeconds(rowB.printableDate);
            if ( a > b ) { return 1; }
            if ( b > a ) { return -1; }
            return 0;
         }
      },
      {
         name: 'Review',
         selector: row=>row.review,
         sortable: false,
         grow: 6,
         // eslint-disable-next-line react/display-name
         cell: row=>{
            return (
               <Review
                  domain={props.domain}
                  review={{...row}}
                  displayStyle="viewAll"
                  code={props.code}
                  setImageData={props.setImageData}
               />
            );
         }
      }
   ];

   return (
      <DataTable
         data={props.reviews}
         columns={columns}
         selectableRows={false}

         defaultSortFieldId={2}
         defaultSortAsc={false}

         pagination={true}

         highlightOnHover={true}
         striped={true}
         dense={true}
         persistTableHead={false}
         responsive={true}
      />
   );
});

export default TheDataTable;