import React, { useContext, useEffect, useState } from 'react'
import Header from '../Header'
import '../../css/Checkout.css'
import CartImage from "../../Assets/Images/icons/cart.png";
import Paypal from "../../Assets/Images/logo/paypal_logo.png";
import Visa from "../../Assets/Images/logo/visa_logo.png";
import Mastercard from "../../Assets/Images/logo/mastercard_logo.png";
import Maestro from "../../Assets/Images/logo/maestro_logo.png";
import Discover from "../../Assets/Images/logo/discover_logo.png";
import Ideal from "../../Assets/Images/logo/ideal_logo.png";
import Inpost from "../../Assets/Images/logo/inpost_logo.png";
import DPD from "../../Assets/Images/logo/dpd_logp.png";
import DHL from "../../Assets/Images/logo/dhl_logo.png";
import Fedex from "../../Assets/Images/logo/fedex_logo.png";
import Countries from '../../Assets/data/countries.json'
import Products from '../../Assets/data/products.json'
import Product from './Product';
import Login from '../Login';
import HeaderLogo from "../../Assets/Images/logo/header_logo.png";
import { userContext } from '../../App';

function Checkout() {
    let { state, dispatch } = useContext(userContext)
    if (state.user === true) {
    }
    let [userdata, updateuserdata] = useState({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        address: "",
        pincode: "",
        city: "",
        country: "India",
    })
    let [loginprompt, updateloginprompt] = useState(0)
    let [loginorsignupprompt, updateloginsignupprompt] = useState(0)
    let amount = 0
    Products.forEach(element => {
        amount = amount + element.price;
    });
    let [totalAmount, updateTotalAmount] = useState(amount)
    function hidetheprompt() {
        updateloginprompt(0);
    }
    function filluserdata(event) {
        updateuserdata((prevalue) => {
            return ({
                ...userdata,
                [event.target.name]: event.target.value
            })
        })
    }

    function submitOrder(event, payment_mode) {
        if (userdata.fname === "" || userdata.lname === "" || userdata.email === "" || userdata.phone.length !== 10 || userdata.address === "" || userdata.pincode === "" || userdata.pincode.length !== 6 || userdata.city === "") {
            window.alert("Please Fill the Shipping information Completely and Correctly \nNote: phone number should be of ten degit and pincode of six digits")
        }
        else {
            if (payment_mode === "online_payment") {
                var options = {
                    "key": "rzp_test_EEuQ8JIJq9Beoh",
                    "amount": totalAmount * 76 * 100,
                    "currency": "INR",
                    "name": "E-Shop",
                    "description": "Test Transaction",
                    "image": HeaderLogo,
                    "handler": function (response) {
                        alert("Yor payment is Recieved with Test Payment ID : " + response.razorpay_payment_id);
                    },
                    "prefill": {
                        "name": userdata.fname + " " + userdata.lname,
                        "email": userdata.email,
                        "contact": userdata.phone
                    },
                    "theme": {
                        "color": "#3399cc"
                    }
                };
                var razopay = new window.Razorpay(options);
                razopay.open();
                razopay.on('payment.failed', function (response) {
                    alert(response.error.code);
                    alert(response.error.description);
                    alert(response.error.source);
                    alert(response.error.step);
                    alert(response.error.reason);
                    alert(response.error.metadata.order_id);
                    alert(response.error.metadata.payment_id);
                });
            }
        }
    }
    return (
        <>
            {
                loginprompt === 1 ? (
                    <>
                        <Login hidetheprompt={hidetheprompt} islogin={loginorsignupprompt} />
                    </>
                ) : (<></>)
            }
            <Header />
            <div className="paymentContainer">
                <div className="heading">
                    <h2>Shopping and Payment</h2>
                    <div className="flow">
                        <div>
                            <img src={CartImage} alt="cart" />
                        </div>
                        <hr />
                        <i className="fas fa-truck"></i>
                    </div>
                </div>
                <div className="paymentInfoContainer">
                    <div className="details">
                        {
                            state.user === false ? (<>
                                <div className="logintsatus">
                                    <button className="loginButton" onClick={() => {
                                        updateloginprompt(1)
                                        updateloginsignupprompt(0)
                                    }}>
                                        LOG IN
                                    </button>
                                    <button className="signupButton" onClick={() => {
                                        updateloginprompt(1)
                                        updateloginsignupprompt(1)
                                    }}>
                                        SIGN UP
                                    </button>
                                </div>
                            </>) : (<></>)
                        }
                        <div className="shippingInfo">
                            <h4>Shipping Information</h4>
                            <div className="inputs">
                                <input type="email" name="email" id="email" placeholder='Email' onChange={filluserdata} value={userdata.email} />
                                <input type="text" name="address" id="address" placeholder='Address' onChange={filluserdata} value={userdata.address} />
                            </div>
                            <div className="inputs">
                                <input type="text" name="fname" id="fname" placeholder='First Name' onChange={filluserdata} value={userdata.fname} />
                                <input type="text" name="city" id="city" placeholder='City' onChange={filluserdata} value={userdata.city} />
                            </div>
                            <div className="inputs">
                                <input type="text" name="lname" id="lname" placeholder='Last name' onChange={filluserdata} value={userdata.lname} />
                                <input type="number" name="pincode" id="pincode" placeholder='Postal Code/Zip' onChange={filluserdata} value={userdata.pincode} />
                            </div>
                            <div className="inputs">
                                <input type="number" name="phone" id="phone" placeholder='Phone Number' onChange={filluserdata} value={userdata.phone} />
                                <select name="country" id="country" onChange={filluserdata} value={userdata.country}>
                                    <option value="India">India</option>
                                    {
                                        Countries.map((element, index) => {
                                            return (
                                                <>
                                                    <option key={index} value={element.name}>{element.name}</option>
                                                </>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="method">
                        <div className="paymentMethods">
                            <h4>Payment Method</h4>
                            <div className="paymentOptions">
                                <input type="radio" name="payment_method" id="paypal" />
                                <label htmlFor='paypal'>
                                    <img src={Paypal} alt="" />
                                </label>
                                <input type="radio" name="payment_method" id="visa" />
                                <label htmlFor='visa'>
                                    <img src={Visa} alt="" />
                                </label>
                                <input type="radio" name="payment_method" id="mastercard" />
                                <label htmlFor='mastercard'>
                                    <img src={Mastercard} alt="" />
                                </label>
                            </div>
                            <div className="paymentOptions">
                                <input type="radio" name="payment_method" id="meastro" />
                                <label htmlFor='meastro'>
                                    <img src={Maestro} alt="" />
                                </label>
                                <input type="radio" name="payment_method" id="discover" />
                                <label htmlFor='discover'>
                                    <img src={Discover} alt="" />
                                </label>
                                <input type="radio" name="payment_method" id="ideal" />
                                <label htmlFor='ideal'>
                                    <img src={Ideal} alt="" />
                                </label>
                            </div>
                        </div>
                        <div className="deliveryMethods">
                            <h4>Delivery Method</h4>
                            <div className="deliveryOptions">
                                <input type="radio" name="delivery_method" id="inpost" />
                                <label htmlFor='inpost'>
                                    <img src={Inpost} alt="" />
                                    <div className="deliveryrate">
                                        $20.00
                                    </div>
                                </label>
                                <input type="radio" name="delivery_method" id="dpd" />
                                <label htmlFor='dpd'>
                                    <img src={DPD} alt="" />
                                    <div className="deliveryrate">
                                        $12.00
                                    </div>
                                </label>
                            </div>
                            <div className="deliveryOptions">
                                <input type="radio" name="delivery_method" id="dhl" />
                                <label htmlFor='dhl'>
                                    <img src={DHL} alt="" />
                                    <div className="deliveryrate">
                                        $15.00
                                    </div>
                                </label>
                                <input type="radio" name="delivery_method" id="fedex" />
                                <label htmlFor='fedex'>
                                    <img src={Fedex} alt="" />
                                    <div className="deliveryrate">
                                        $10.00
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="productsContainer">
                        <h4>Your Cart</h4>
                        <div className="productContainer">
                            {
                                Products.map((element, index) => {
                                    return (
                                        <Product key={index} data={element} />
                                    )
                                })
                            }
                        </div>
                        <div className="totalAmount">
                            <span>Total Cost</span>
                            <span>${totalAmount}</span>
                        </div>
                        <div className="freeDeliveryCriteria">
                            <i className="fas fa-truck"></i>
                            <span>
                                {
                                    totalAmount >= 200 ? (<>
                                        You are Eligible for Free Delivery
                                    </>) : (
                                        <>
                                            You are ${(200 - totalAmount).toFixed(2)} away from free shipping
                                        </>
                                    )
                                }
                            </span>
                        </div>
                    </div>
                </div>
                <div className="pageNavigationOption">
                    <div className="back">
                        <i className="fas fa-long-arrow-alt-left"></i>
                        <span>Back</span>
                    </div>
                    <div className="procedOptions">
                        <button >Continue Shoping</button>
                        <button onClick={(event) => {
                            submitOrder(event, "online_payment")
                        }}>Proceed To Payment</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Checkout
