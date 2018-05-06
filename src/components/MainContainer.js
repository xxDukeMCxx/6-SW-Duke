import React from 'react';
import './mainContainer.css';
import '../lib/animate.css';
import _ from "lodash";


const MainContainer = ({detailToShow, loadingInProgress, loadingHowMany})=> {


        let myDetailJSX = [];
        let nbElem = 0;

        if (loadingInProgress) {
            return <div className="mainContainer mainContainerLoadingInProgress">
                        <div>
                            <h1>Hacking Galactic Empire Network Database....</h1>
                            <h2 className="animated infinite flash">--- {loadingHowMany} datas stolen ---</h2>
                        </div>
                  </div>
        }


        const ignoredProp = ['url', 'created', 'edited'];

        for (const prop in detailToShow) {
            if (!ignoredProp.includes(prop)) {
                nbElem++;
                //detect if value is an Array
                if (Array.isArray(detailToShow[prop])) { // if it's an Array, split each element  
                    
                    let localURLSJSX = [];
                    detailToShow[prop].map(value=> localURLSJSX.push (<li>{value}</li>));

                    let localJSX = <tr>
                                    <td className="tdProp">{_.capitalize(prop)}</td>
                                    <td className="tdValue"><div> {localURLSJSX} </div></td>
                                   </tr>;
                    myDetailJSX.push(localJSX);
                    
                } else {  ///if not an array, just put value
                    myDetailJSX.push(<tr>
                        <td className="tdProp">{_.capitalize(prop)}</td>
                        <td className="tdValue">{_.capitalize(detailToShow[prop])}</td>
                    </tr>)
                }
            }
        }

         return (

            <div className="mainContainer"> 
            { nbElem>0 ? 
                    <div className="animated bounceInRight" id={`"_mainContainer_divAnime_${_.values(detailToShow)[0]}"`} key={`"_mainContainer_divAnime_${_.values(detailToShow)[0]}"`}>
                        <table className="tableMainContainer">
                            <tbody>
                                {myDetailJSX}
                           </tbody>
                        </table>
                    </div>
              : ""
            }

            </div>
        )

}

export default MainContainer;

