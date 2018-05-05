import React from 'react';
import './MyMenu.css';
import '../lib/animate.css';
import _ from 'lodash';

const MyMenu = ({menuItems, onClickFunc})=> {

    let menuJSX = [];

    for (const key in menuItems) {
        if (menuItems.hasOwnProperty(key)) {
            /*console.log (" --> " + key + " : " + menuItems[key]);*/
            menuJSX.push (<div key={`_myMenu_${key}`} className="animated bounceInRight" onClick={onClickFunc.bind(this,key)}><p id={`"_myMenu_${key}"`}>{_.capitalize(key)}</p></div>);
        }
    }

    /* console.log ("MENU JSX : ", menuJSX); */

    return (
        <div className="myMenuContainer">
        {menuJSX}
        </div>
    )

}




export default MyMenu;

