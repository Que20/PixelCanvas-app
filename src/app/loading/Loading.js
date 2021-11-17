import React, { Component } from 'react';

class Loading extends Component {

    render() {
        return (
            <div className="loadingView">
                <div className="lds-grid">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <p>{this.props.message}</p>
            </div>
        )
    }
}

export default Loading;