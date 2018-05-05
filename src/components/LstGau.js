import React from 'react';
import './LstGau.css';
import '../lib/animate.css';
/* import _ from 'lodash'; */

const LstGau = ({lstGauItems, propKeyName, loadingInProgress, loadingHowMany})=> {

    /* console.log("RRRRRR :", lstGauItems); */
    console.log ("loadingHowMany", loadingHowMany);

    let lstGauJSX = [];

    if (loadingInProgress) {
        lstGauJSX.push(<p className="animated infinite flash loading" key={`"_lstGau_loading_"`}>LOADING IN PROGRESS...</p>);
        lstGauJSX.push(<p className="loadingFile" key={`"_lstGau_loadingFile_"`}> ---== fetching {loadingHowMany} classified files ==---</p>);
    }

    lstGauItems.forEach(Item => {
        lstGauJSX.push (<div className="animated bounceInUp" key={`"_lstGau_${Item[propKeyName]}"`}><p>{Item[propKeyName]}</p></div>)
    });
    

    return (
        <div className="lstGauContainer">
            {lstGauJSX}
        </div>
    )

}




export default LstGau;

