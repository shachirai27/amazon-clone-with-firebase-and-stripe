import { Link } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import CheckoutProduct from './CheckoutProduct';
import Header from './Header';
import './Payment.css';
import { useStateValue } from './StateProvider';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
import axios from './axios';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';

function Payment() {
    const [{ basket, user }, dispatch] = useStateValue();

    const stripe = useStripe();
    const elements = useElements();

    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState(null);
    const history = useNavigate();

    useEffect(() => {
        console.log("INSIDE USEEFFCET");
        //stripe secret that allows us to charge the customer, we use  useEffect coz we need to update once basket changes 
        const getClientSecret = async () => {
            const response = await axios({
                method: 'POST',
                //Stripe expects a total in currency subunits
                url: `/payment/create?total=${getBasketTotal(basket) * 100}`
            });
            console.log('response', response);
            setClientSecret(response.data.clientSecret);
        }
        getClientSecret();
    }, [basket]);

    console.log('clientSEcret', clientSecret);
    console.log('Person', user);
    const handleSubmit = e => {
        e.preventDefault();
        setProcessing(true);

        const payload = async () => {
            await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)
                }
            }).then(({ paymentIntent }) => {

                db.collection('users').doc(user?.uid).collection('orders').doc(paymentIntent.id).set({
                    basket: basket,
                    amount: paymentIntent.amount,
                    created: paymentIntent.created
                });

                setSucceeded(true);
                setError(null);
                setProcessing(false);

                dispatch({
                    type: 'EMPTY_BASKET'
                });

                history('/orders');
            }
            );
        }
    }

    const handleChange = e => {
        /*take an event and do something */
        setDisabled(e.empty);
        setError(e.error ? e.error.message : "");
    }

    return (
        <div>
            <Header />
            <div className="payment">
                <div className="payment__container">
                    <h1>Checkout (<Link to="/checkout">{basket?.length} items</Link>)</h1>
                    {/*Delivery Address*/}
                    <div className="payment__section">
                        <div className="payment__title">
                            <h3>Delivery Address:</h3>
                        </div>
                        <div className="payment__address">
                            <p>{user?.email}</p>
                            <p>23 React Lane</p>
                            <p>India</p>
                        </div>
                    </div>
                    {/*Review Items*/}
                    <div className="payment__section">
                        <div className="payment__title">
                            <h3>Review Items and Delivery</h3>
                        </div>
                        <div className="payment__items">
                            {basket.map(item =>
                                <CheckoutProduct
                                    id={item.id}
                                    title={item.title}
                                    image={item.image}
                                    price={item.price}
                                    rating={item.rating}
                                />)}
                        </div>

                    </div>
                    {/*Payment Method*/}
                    <div className="payment__section">
                        <div className="payment__title">
                            <h3>Payment Method</h3>
                        </div>
                        <div className="payment__details">
                            {/*Stripe*/}
                            <form onSubmit={handleSubmit}>
                                <CardElement onChange={handleChange} />
                                <div className="payment__priceContainer">
                                    <CurrencyFormat
                                        renderText={(value) => (
                                            <>
                                                <h3>Order Total: {value}</h3>
                                            </>
                                        )}
                                        decimalScale={2}
                                        value={getBasketTotal(basket)}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={"$"}
                                    />
                                    <button disabled={processing || disabled || succeeded}>
                                        <span>{processing ? <p>Processing</p> : "Buy NOW"}</span>
                                    </button>
                                </div>
                                {error && <div>{error}</div>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment
