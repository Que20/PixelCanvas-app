import React, { Component } from 'react';
import { generateFromString } from 'generate-avatar'

class Header extends Component {

    render() {
        return (
            <div>
                <header className="app-header">
                    <table className="main">
                    <tbody>
                        <tr>
                            <td>
                                <p> Connected with{" "+this.props.account} </p>
                            </td>
                            <td>
                                <img className="account-img" src={`data:image/svg+xml;utf8,${generateFromString(this.props.account)}`} alt=""/>
                            </td>
                        </tr>
                    </tbody>
                    </table>
                    <div>
                    <button className="menu-item" onClick={this.showCanvas}>Canvas</button>
                    <button className="menu-item"  onClick={this.showAccount}>Account</button>
                    </div>
                </header>
            </div>
        )
    }

    showCanvas = () => {
        this.props.delegate.menuItem("canvas")
    }

    showAccount = () => {
        this.props.delegate.menuItem("account")
    }
}

export default Header;