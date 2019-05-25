import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import '../jquery-3.3.1.min.js';
import '../bundle.js';

import '../App.css';

class Buy extends Component {

    constructor() {
        super();

        this.state = {
            email: '',
            mobile: '',
            name: '',
            address: '',
            nic: '',
            paymentMethod: '',
            cardNo: '',
            expireDate: '',
            cvc: '',
            mobileNo: '',
            pin: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        console.log('The form was submitted with the following data:');
        console.log(this.state);

        const buy = {
            email: this.state.email,
            mobile: this.state.mobile,
            name: this.state.name,
            address: this.state.address,
            nic: this.state.nic,
            paymentMethod: this.state.paymentMethod,
            cardNo: this.state.cardNo,
            expireDate: this.state.expireDate,
            cvc: this.state.cvc,
            mobileNo: this.state.mobileNo,
            pin: this.state.pin,
        };
        const { email, mobile, name, address, nic, paymentMethod, cardNo, expireDate, cvc, mobileNo, pin } = this.state;
        axios.post('/api/buy', { email, mobile, name, address, nic, paymentMethod, cardNo, expireDate, cvc, mobileNo, pin })
            .then((result) => {
                this.props.history.push("/buy")
            });
    }

    render() {
        return (
            <div className="buy">
                <div className="FormCenter">
                    <div className="FormField">
                        <label className="FormField__Label" htmlFor="pay">You are paying Rs:</label>
                    </div>
                    <form onSubmit={this.handleSubmit} className="FormFields">
                        <div className="FormField">
                            <label className="FormField__Label" htmlFor="email">Email</label>
                            <input type="email" id="email" className="FormField__Input" placeholder="Enter your email"
                                   name="email" required value={this.state.email} onChange={this.handleChange}/>
                        </div>
                        <div className="FormField">
                            <label className="FormField__Label" htmlFor="mobile">Mobile Number</label>
                            <input type="text" id="mobile" pattern="[0-9]{10}" className="FormField__Input"
                                   placeholder="Enter your phone number" name="mobile" required
                                   value={this.state.mobile} onChange={this.handleChange}/>
                        </div>
                        <div className="FormField">
                            <label className="FormField__Label" htmlFor="name">Name</label>
                            <input type="text" id="name" className="FormField__Input" onChange={this.handleChange}
                                   placeholder="Enter your name" name="name" required value={this.state.name}/>
                        </div>
                        <div className="FormField">
                            <label className="FormField__Label" htmlFor="address">Address</label>
                            <input type="text" id="address" className="FormField__Input"
                                   placeholder="Enter your address"
                                   name="address" required="" value={this.state.address} onChange={this.handleChange}/>
                        </div>
                        <div className="FormField">
                            <label className="FormField__Label" htmlFor="nic">NIC Number</label>
                            <input type="text" id="nic" className="FormField__Input"
                                   placeholder="958463885V"
                                   name="nic" required="" value={this.state.nic} onChange={this.handleChange}/>
                        </div>
                        <div className="FormField">
                            <label className="FormField__Label" htmlFor="paymentMethod">Payment Method</label><br/>
                            <input type="radio" name="paymentMethod" id="credit" value="card" checked/>Credit/Debit Card <br/>
                            <input type="radio" name="paymentMethod" id="mobile" value="bill"/>Add to Dialog Postpaid Bill
                        </div>
                        <div className="FormField">
                            <label className="FormField__Label" htmlFor="cardNo">Card Number</label>
                            <input type="text" id="cardNo" pattern="[0-9]{16}" className="FormField__Input"
                                   placeholder="3444 3232 4444 5454" name="cardNo" required value={this.state.cardNo}
                                   onChange={this.handleChange}/>
                        </div>
                        <div className="FormField">
                            <label className="FormField__Label" htmlFor="expireDate">Expiry Date</label>
                            <input type="text" id="expireDate" className="FormField__Input" placeholder="12/20"
                                   name="expireDate" required value={this.state.expireDate}
                                   onChange={this.handleChange}/>
                        </div>
                        <div className="FormField">
                            <label className="FormField__Label" htmlFor="cvc">CVC</label>
                            <input type="text" pattern="[0-9]{3}" id="cvc" className="FormField__Input"
                                   placeholder="123"
                                   name="cvc" required value={this.state.cvc} onChange={this.handleChange}/>
                        </div>
                        <div className="FormField">
                            <label className="FormField__Label" htmlFor="mobileNo">Dialog Mobile Number</label>
                            <input type="text" id="mobileNo" pattern="[0-9]{10}" className="FormField__Input"
                                   placeholder="0777 429 399" name="mobileNo" required value={this.state.mobileNo}
                                   onChange={this.handleChange}/>
                        </div>
                        <div className="FormField">
                            <label className="FormField__Label" htmlFor="pin">Pin</label>
                            <input type="text" id="pin" className="FormField__Input" placeholder="1234" name="pin"
                                   required="" value={this.state.pin} onChange={this.handleChange}/>
                        </div>
                        <button id="pin" className="FormField__Button1 mr-1">Request Pin</button>
                        <br/>
                        <br/>
                        <div className="FormField">
                            <Link to="/sign-in">
                                <button id="buy" className="FormField__Button mr-20">Proceed to Payment</button>
                            </Link></div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Buy;