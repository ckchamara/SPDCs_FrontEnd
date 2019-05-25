import React, {Component} from 'react';
import {HashRouter as Router, Route, Link, NavLink} from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Buy from './pages/Buy';
import Search from './pages/Search';
import footer from './images/footer.png';

import './App.css';

class App extends Component {
    render() {
        return (
            <Router basename="/users/">
                <div className="App">
                    <div className="App__Aside"></div>
                    <div className="App__Form">
                        <div className="PageSwitcher">
                            <NavLink to="/sign-in" activeClassName="PageSwitcher__Item--Active"
                                     className="PageSwitcher__Item"
                            >Sign In</NavLink>
                            <NavLink exact to="/" activeClassName="PageSwitcher__Item--Active"
                                     className="PageSwitcher__Item"
                            >Sign Up</NavLink>
                        </div>

                        <div className="FormTitle">
                            <NavLink to="/sign-in" activeClassName="FormTitle__Link--Active"
                                     className="FormTitle__Link">Sign In
                            </NavLink> or <NavLink exact to="/" activeClassName="FormTitle__Link--Active"
                                                   className="FormTitle__Link"
                        >Sign Up</NavLink>.
                        </div>

                        <Route exact path="/" component={SignUp}>
                        </Route>
                        <Route path="/sign-in" component={SignIn}>
                        </Route>
                        <Route path="/search" component={Search}>
                        </Route>
                        <Route exact path="/order" component={Buy}>
                        </Route>
                    </div>
                    <div className="footer">
                        <Footer/>
                    </div>
                </div>
            </Router>

        );
    }
}

class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <img className="footerM" src={footer} style={{width: '100%'}} alt={footer}/>
            </div>
        );
    }
}

export default App;