import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { auth } from './firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useNavigate();

    const signIn = e => {
        e.preventDefault(); //will stop from refreshing 
        //firebase login
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                if (userCredential) {
                    history('/');
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
            });
    }

    const register = e => {
        e.preventDefault(); //will stop from refreshing 
        //firebase register
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);
                if (userCredential) {
                    history('/');
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
            });
    }

    return (
        <div className='login'>
            <Link to="/">
                <img className='login__logo' src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="" />
            </Link>

            <div className="login__container">
                <h1>Sign In</h1>
                <form>
                    <h5>E-mail</h5>
                    <input type='text' value={email} onChange={e => setEmail(e.target.value)} />

                    <h5>Password</h5>
                    <input type='Password' value={password} onChange={e => setPassword(e.target.value)} />

                    <button type='submit' onClick={signIn} className='login__signInButton'>Sign In</button>
                </form>
                <p>By Signing in, you agree to AMAZON FAKE CLONE Conditions of Use and Sale. </p>
                <button onClick={register} className='login__registerButton'>Create Your Amazon Account</button>
            </div>
        </div>
    )
}

export default Login
