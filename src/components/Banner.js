import React from 'react';
import './Banner.css';
import gitLogo from './githublogo.png'

const Banner = ()=> {

    return (
        <div className="bannerContainer">   
            <div className="divTitleBanner">
                <h1>Duke SW API Browser</h1>
            </div>
            <div className="divLogoBanner">
                <a href="https://github.com/xxDukeMCxx/6-sw-duke" target="_blank" rel="noopener noreferrer"><img alt="gitHub link" src={gitLogo} /></a>
            </div>
        </div>
    )

}

export default Banner;

