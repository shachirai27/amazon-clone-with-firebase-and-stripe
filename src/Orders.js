import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import Header from './Header';
import Order from './Order';
import './Orders.css';
import { useStateValue } from './StateProvider';

function Orders() {
    const [{ basket, user }, dispatch] = useStateValue();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user) {
            db.collection('users').doc(user?.uid).collection('order').orderBy('created', 'desc').onSnapshot(snapshot => (snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            }))))
        } else {
            setOrders([]);
        }
    }, []);

    return (
        <div>
            <Header />
            <div className="orders">
                <h1>Your Orders</h1>
                <div className="order__container">
                    {orders?.map(order => (
                        <Order order={order} />
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Orders
