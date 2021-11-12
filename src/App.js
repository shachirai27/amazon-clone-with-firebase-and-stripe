import './App.css';
import React, { useEffect } from 'react';
import Login from './Login';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes as Switch } from "react-router-dom";
import Checkout from './Checkout';
import Payment from './Payment';
import Orders from './Orders';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useStateValue } from './StateProvider';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const promise = loadStripe('pk_live_51JueHwSIt0CJ4ljdtSOjZMbhvlugJa3AgH7qhpYDRjMlv4GYWt4YeXgQ5hOb3zLT4HdphVNMaris1HoDnufq23zA00mEIJHxBL');

function App() {

  const [{ user }, dispatch] = useStateValue();
  useEffect(() => {
    //will run only once when app component loads
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // the user just logged in or was logged in
        dispatch({
          type: 'SET_USER',
          user: user
        })
      } else {
        // User is signed out
        dispatch({
          type: 'SET_USER',
          user: null
        })
      }
    });

  }, [])

  return (
    //BEM 
    <Router>
      <div className="app">
        {/* render header regardles of the route */}
        <Switch>
          <Route path="/loginPage" element={<Login />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="payment" element={<Elements stripe={promise}><Payment /></Elements>} />
          <Route path="/" element={<Home />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
