import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../jquery-3.3.1.min.js';
import '../bundle.js';

class SignIn extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            password: ''
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
        const { email, password } = this.state;
        axios.post('/api/users', { email, password })
            .then((result) => {
                this.props.history.push("/sign-in")
            });
        console.log('The form was submitted with the following data:');
        console.log(this.state);
    }

    render() {
        const { email, password } = this.state;
        return (
            <div className="FormCenter">
                <form onSubmit={this.handleSubmit} className="FormFields" onSubmit={this.handleSubmit}>
                    <div className="FormField">
                        <label className="FormField__Label" htmlFor="email">E-Mail Address</label>
                        <input type="email" id="email" className="FormField__Input" placeholder="Enter your email"
                               name="email" value={this.state.email} onChange={this.handleChange} required/>
                    </div>

                    <div className="FormField">
                        <label className="FormField__Label" htmlFor="password">Password</label>
                        <input type="password" id="password" className="FormField__Input"
                               placeholder="Enter your password" name="password" value={this.state.password}
                               onChange={this.handleChange} required/>
                    </div>

                    <div className="FormField">
                        <a target="_blank" href="">
                            <Link to="/search">
                                <button id="signin" className="FormField__Button mr-20">Sign In</button>
                            </Link>
                        </a> <Link to="/" className="FormField__Link">Create an account</Link>
                    </div>
                </form>
            </div>
        );
    }
}

export default SignIn;