import React, { useContext, useState } from 'react'
import '../css/Login.css'
import { userContext } from '../App';

function Login(object) {
    let { state, dispatch } = useContext(userContext)
    let [loginsignupprompt, updateloginsignuporompt] = useState(object.islogin)
    let [logindata, updatelogindata] = useState({
        email: "",
        password: ""
    })
    let [signupdata, updatesignupdata] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    })
    function handlelogindata(event) {
        updatelogindata((prevalue) => {
            return ({
                ...prevalue,
                [event.target.name]: event.target.value
            })
        })
    }
    function handlesignupdata(event) {
        updatesignupdata((prevalue) => {
            return ({
                ...prevalue,
                [event.target.name]: event.target.value
            })
        })
    }
    async function login(event) {
        event.preventDefault()
        if (logindata.email == "" || logindata.password.length < 8) {
            window.alert("any one of the following criteria is missing\n1. any input should not be empty\n2. Password Length should be greater than of equal to 8 characters")
        } else {
            try {
                let response = await fetch('/login', {
                    method: "POST",
                    headers: {
                        "Content-Type": "Application/json"
                    },
                    body: JSON.stringify({
                        ...logindata
                    })
                })
                if (response.status === 200) {
                    console.log("logged in");
                    let result = await response.json()
                    dispatch({ type: "LOGIN", username: result.username })
                    object.hidetheprompt()
                } else {
                    window.alert("invalid Credentials");
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    async function signup(event) {
        event.preventDefault()
        if (signupdata.name == "" || signupdata.email == "" || signupdata.phone.length != 10 || signupdata.password.length < 8) {
            window.alert("any one of the following criteria is missing\n1. any input should not be empty\n2. Phonbe Number should be of 10 character\n3. Password Length should be greater than of equal to 8 characters")
        } else {
            try {
                let response = await fetch('/signup', {
                    method: "POST",
                    headers: {
                        "Content-Type": "Application/json"
                    },
                    body: JSON.stringify({
                        ...signupdata
                    })
                })
                if (response.status === 200) {
                    console.log("signned up");
                    let result = await response.json()
                    dispatch({ type: "LOGIN", username: result.username })
                    object.hidetheprompt()
                } else if (response.status === 403) {
                    window.alert("User Already Exists with this email or phone number");
                } else {
                    window.alert("Some error occured, please try after some time")
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    return (
        <>
            <div className="logincontainer">

                {
                    loginsignupprompt === 0 ? (
                        <>
                            <form onSubmit={login}>
                                <i onClick={object.hidetheprompt} className="fas fa-times"></i>
                                <h2>Login Here</h2>
                                <input type="text" name='email' id='email' placeholder='Enter Email' value={logindata.email} onChange={handlelogindata} required />
                                <input type="password" name="password" id="password" placeholder='Enter Password' value={logindata.password} onChange={handlelogindata} required />
                                <input type="submit" value="Submit" />
                                <p>Don't have account <a href="#signup" onClick={() => {
                                    updateloginsignuporompt(1)
                                }}> Create an account</a></p>
                            </form>
                        </>
                    ) : (
                        <>
                            <form onSubmit={signup}>
                                <i onClick={object.hidetheprompt} className="fas fa-times"></i>
                                <h2>Signup Here</h2>
                                <input type="text" name="name" id="name" placeholder='Enter Name' onChange={handlesignupdata} value={signupdata.name} required />
                                <input type="text" name='email' id='email' placeholder='Enter Email' onChange={handlesignupdata} value={signupdata.email} required />
                                <input type="number" name="phone" id="phone" placeholder='Enter Phone Number' onChange={handlesignupdata} value={signupdata.phone} required />
                                <input type="password" name="password" id="password" placeholder='Enter Password' onChange={handlesignupdata} value={signupdata.password} required />
                                <input type="submit" value="Submit" />
                                <p>Already have account <a href="#login" onClick={() => {
                                    updateloginsignuporompt(0)
                                }}> Login </a></p>
                            </form>
                        </>
                    )
                }
            </div>
        </>
    )
}

export default Login
