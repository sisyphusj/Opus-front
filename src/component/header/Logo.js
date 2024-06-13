/**
 * @name Logo
 * @description Logo component to display the logo of the application.
 * @param isDarkMode: boolean - Dark mode status
 * @param onClick: function - Function to execute when the logo is clicked
 */
import React from 'react';
import {NavLink} from 'react-router-dom';
import {ReactComponent as LightLogo} from "../../assets/lightlogo.svg";
import {ReactComponent as DarkLogo} from "../../assets/darklogo.svg";

const Logo = ({isDarkMode, onClick}) => (
    <NavLink to="/" onClick={onClick} style={{textDecoration: "none"}}>
        {isDarkMode ? <DarkLogo width="110" height="54"/> : <LightLogo
            width="110" height="54"/>}
    </NavLink>
);

export default Logo;
