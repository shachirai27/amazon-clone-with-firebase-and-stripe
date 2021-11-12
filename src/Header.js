import React from 'react';
import './Header.css'
import SearchIcon from '@material-ui/icons/Search';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { Link } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { getAuth, signOut } from "firebase/auth";

function Header() {
    const [{ basket, user }, dispatch] = useStateValue();
    const handleAuthentication = () => {
        if (user) {
            const auth = getAuth();
            signOut(auth).then(() => {
                // Sign-out successful.
            }).catch((error) => {
                // An error happened.
            });
        }
    }
    return (
        <div className='header'>
            <Link to="/">
                <img
                    className="header__logo"
                    src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
                    alt="" />
            </Link>

            <div className="header__search">
                <input
                    className="header__searchInput" type="text" />
                <SearchIcon
                    className="header_searchIcon" />
            </div>

            <div
                className="header_nav">
                <Link to={!user && "/loginPage"}>{/*  would redirect only when initially there was no user */}
                    <div onClick={handleAuthentication} className="header__option">
                        <span className="header_optionLineOne">Hello {!user ? " Guest!" : user.email}</span>
                        <span className="header_optionLineTwo">{user ? 'Sign Out' : 'Sign In'}</span>
                    </div>
                </Link>
                <div className="header__option">
                    <span className="header_optionLineOne">Returns</span>
                    <span className="header_optionLineTwo">& Orders</span>
                </div>
                <div className="header__option">
                    <span className="header_optionLineOne">Your</span>
                    <span className="header_optionLineTwo">Prime</span>
                </div>

                <Link to="/checkout">
                    <div className="header__optionBasket">
                        <ShoppingBasketIcon />
                        <span className="header_optionLineTwo header__basketCount"> {basket?.length}</span>
                    </div>
                </Link>

            </div>
        </div>
    )
}

export default Header
