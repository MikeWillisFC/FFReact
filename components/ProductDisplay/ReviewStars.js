import Image from 'next/image';

const ReviewStars = props => {
   return (
      <div style={{whiteSpace:"nowrap", display: "inline-block"}}>
         {
            [1,2,3,4,5].map(i=>{
               if ( props.stars >= i ) {
                  return <Image key={i} src={`https://${props.domain}/images/misc/heartSolid.png`} width="18" height="16" alt="solid heart" />
               } else {
                  return <Image key={i} src={`https://${props.domain}/images/misc/heartEmpty.png`} width="18" height="16" alt="empty heart" />
               }
            })
         }
      </div>
   );
};

export default ReviewStars;