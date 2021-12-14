import React, { Component } from 'react';
import { generateFromString } from 'generate-avatar'

class Header extends Component {

    render() {
        {/* <p> Connected with{" "+this.props.account} </p> */}
        return (
            <header className="app-header">
                <div className="header-title">
                    <h1 onClick={this.showCanvas}> Pixel Canvas </h1>
                </div>
                <div className="header-menu">
                    {/* <button className="menu-item" onClick={this.showCanvas}>Canvas</button> */}
                    <a href="https://macncheese.finance/matic-polygon-mainnet-faucet.php"><button className="menu-item faucet">Get free MATIC</button></a>
                    <img className="account-img" src={`data:image/svg+xml;utf8,${generateFromString(this.props.account)}`} alt="" onClick={this.showAccount} />
                </div>
            </header>
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