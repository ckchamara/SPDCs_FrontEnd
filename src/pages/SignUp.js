import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../jquery-3.3.1.min.js';
import '../bundle.js';

class SignUp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            phoneNo: '',
            password: '',
            cpassword: '',
            nic: '',
            email: '',
            hasAgreed: false
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
        const { name, phoneNo, password, cpassword, nic, email } = this.state;
        console.log('The form was submitted with the following data:');
        console.log(this.state);
        axios.post('/api/users', {name, phoneNo, password, cpassword, nic, email })
            .then((result) => {
                this.props.history.push("/")
            });
    }
        render() {
            const { name, phoneNo, password, cpassword, nic, email } = this.state;
            return (
                <div className="FormCenter">
                    <form onSubmit={this.handleSubmit} className="FormFields" onSubmit={this.handleSubmit}>
                        <div className="FormField">
                        <label className="FormField__Label" htmlFor="name">Full Name</label>
                        <input type="text" id="name" className="FormField__Input" placeholder="Enter your full name" name="name" required value={this.state.name} onChange={this.handleChange} />
                    </div>
                    <div className="FormField">
                        <label className="FormField__Label" htmlFor="phoneNo">Phone Number</label>
                        <input type="text" id="phoneNo" className="FormField__Input" pattern="[0-9]{10}" placeholder="Enter your phone number" name="phoneNo" required value={this.state.phoneNo} onChange={this.handleChange} />
                    </div>
                     <div className="FormField">
                         <label className="FormField__Label" htmlFor="password">Password</label>
                         <input type="password" id="password" className="FormField__Input" placeholder="Enter your password" name="password" required value={this.state.cpassword} onChange={this.handleChange} />
                     </div>
                    <div className="FormField">
                        <label className="FormField__Label" htmlFor="cpassword">Confirm Password</label>
                        <input type="password" id="cpassword" className="FormField__Input" placeholder="Confirm your password" name="cpassword" required value={this.state.cpassword} onChange={this.handleChange} />
                    </div>
                     <div className="FormField">
                         <label className="FormField__Label" htmlFor="nic">NIC Number</label>
                         <input type="text" id="nic" className="FormField__Input" placeholder="958463986V" name="nic" required value={this.state.nic} onChange={this.handleChange} />
                     </div>
                    <div className="FormField">
                        <label className="FormField__Label" htmlFor="email">E-Mail Address</label>
                        <input type="email" id="email" className="FormField__Input" placeholder="Enter your email" name="email" required value={this.state.email} onChange={this.handleChange} />
                    </div>

                    <div className="FormField">
                        <label className="FormField__CheckboxLabel">
                            <input className="FormField__Checkbox" type="checkbox" name="hasAgreed" required value={this.state.hasAgreed} onChange={this.handleChange} /> I agree all statements in <a href="" className="FormField__TermsLink">terms of service</a>
                        </label>
                    </div>

                    <div className="FormField">
                        <Link to="/sign-in"><button id="signup" className="FormField__Button mr-20">Sign Up</button></Link> <Link to="/sign-in" className="FormField__Link">I'm already member</Link>
                    </div>
                </form>
            </div>
        );
    }
}
export default SignUp;