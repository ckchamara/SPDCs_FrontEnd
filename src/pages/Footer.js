import React, {Component} from 'react';
import footer from "../images/footer.png";

class Footer extends Component{
    render(){
        return(
            <div className="footer">
                <img className="footerM" src={footer} style={{width:'100%'}} alt={footer}/>
            </div>
        );
    }
}
export default Footer;