import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import '../jquery-3.3.1.min.js';
import '../bundle.js';

import '../App.css';

class Search extends Component {

    constructor() {
        super();

        this.state = {
            search:'',
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

        const search1 = {
            search: this.state.search,
        };
        const { search } = this.state;
        axios.post('/api/search', { search1 })
            .then((result) => {
                this.props.history.push("/search")
            });
        console.log('The form was submitted with the following data:');
        console.log(this.state);
    }

    render() {
        return (
            <div className="search">
                <div className="FormCenter">
                    <div className="FormField">
                    </div>
                    <form onSubmit={this.handleSubmit} className="FormFields">
                        <div className="FormField">
                            <input type="text" id="searcht" className="FormField__Input mr-20" placeholder="Search for book train "
                                   name="searcht" required value={this.state.search} onChange={this.handleChange}/>
                        </div>
                        <div className="FormField">
                            <Link to="/buy">
                                <button id="search" className="FormField__Button mr-20">Search</button>
                            </Link></div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Search;