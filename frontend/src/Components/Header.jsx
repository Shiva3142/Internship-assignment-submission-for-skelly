import React, { useContext } from 'react'
import '../css/Header.css'
import CartImage from "../Assets/Images/icons/cart.png";
import HeaderLogo from "../Assets/Images/logo/header_logo.png";
import { userContext } from '../App';

function Header() {
    let { state, dispatch } = useContext(userContext)
    async function logout() {
        try {
            let response = await fetch('/logout', {
                method: "POST"
            })
            dispatch({ type: "LOGOUT" })
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <header>
                <div className="logo">
                    <img src={HeaderLogo} alt="logo" />
                    <h1>
                        <span>E-</span>
                        Shop
                    </h1>
                </div>
                <nav>
                    <a href="#men">Men</a>
                    <a href="#women">Women</a>
                    <a href="#kids">Kids</a>
                </nav>
                <div className="headerOptions">
                    <div className="searchbox">
                        <i className="fas fa-search"></i>
                    </div>
                    <img src={CartImage} alt="CART" />
                    <div className="user">
                        <i className="far fa-user">
                            {
                                state.user === true ? (<> {" " + state.username}</>) : (<></>)
                            }
                        </i>
                    </div>
                    {
                        state.user === true ? (<>
                            <div className="logout">
                                <a href="#logout" onClick={logout}>Logout</a>
                            </div>
                        </>) : (<></>)
                    }
                </div>
            </header>
        </>
    )
}

export default Header
