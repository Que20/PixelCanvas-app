import React, { Component } from 'react';
import { generateFromString } from 'generate-avatar'

class Header extends Component {
    constructor(props) {
        super(props)
    }

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
                    <a className="menu-item" href='#' onClick={this.showCanvas}>Canvas</a> <a className="menu-item" href='#' onClick={this.showAccount}>Account</a>
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