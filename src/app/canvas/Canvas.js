import React, { Component } from 'react';

class Canvas extends Component {

    render() {
        return (
            <div>
            <h1>The canvas</h1>
            <table className="canvas">
                <tbody>
                <tr>
                {Array.from({length: 8}, (_, i) => i+1).map((i, index) => (
                    <td key={index} className="pixel-cell">
                        <div className="pixel" data-space={index} style={{'backgroundColor': '#'+Number(this.props.tokenColorForIndex(index)).toString(16)}} onClick={this.props.handlePixelSelect}></div>
                    </td>
                ))}
                </tr>
                <tr>
                {Array.from({length: 8}, (_, i) => i+1).map((i, index) => (
                    <td key={index+8} className="pixel-cell">
                        <div className="pixel" data-space={index+8} style={{'backgroundColor': '#'+Number(this.props.tokenColorForIndex(index+8)).toString(16)}} onClick={this.props.handlePixelSelect}></div>
                    </td>
                ))}
                </tr>
                <tr>
                {Array.from({length: 8}, (_, i) => i+1).map((i, index) => (
                    <td key={index+16} className="pixel-cell">
                        <div className="pixel" data-space={index+16} style={{'backgroundColor': '#'+Number(this.props.tokenColorForIndex(index+16)).toString(16)}} onClick={this.props.handlePixelSelect}></div>
                    </td>
                ))}
                </tr>
                <tr>
                {Array.from({length: 8}, (_, i) => i+1).map((i, index) => (
                    <td key={index+24} className="pixel-cell">
                        <div className="pixel" data-space={index+24} style={{'backgroundColor': '#'+Number(this.props.tokenColorForIndex(index+24)).toString(16)}} onClick={this.props.handlePixelSelect}></div>
                    </td>
                ))}
                </tr>
                <tr>
                {Array.from({length: 8}, (_, i) => i+1).map((i, index) => (
                    <td key={index+32} className="pixel-cell">
                        <div className="pixel" data-space={index+32} style={{'backgroundColor': '#'+Number(this.props.tokenColorForIndex(index+32)).toString(16)}} onClick={this.props.handlePixelSelect}></div>
                    </td>
                ))}
                </tr>
                <tr>
                {Array.from({length: 8}, (_, i) => i+1).map((i, index) => (
                    <td key={index+40} className="pixel-cell">
                        <div className="pixel" data-space={index+40} style={{'backgroundColor': '#'+Number(this.props.tokenColorForIndex(index+40)).toString(16)}} onClick={this.props.handlePixelSelect}></div>
                    </td>
                ))}
                </tr>
                <tr>
                {Array.from({length: 8}, (_, i) => i+1).map((i, index) => (
                    <td key={index+48} className="pixel-cell">
                        <div className="pixel" data-space={index+48} style={{'backgroundColor': '#'+Number(this.props.tokenColorForIndex(index+48)).toString(16)}} onClick={this.props.handlePixelSelect}></div>
                    </td>
                ))}
                </tr>
                <tr>
                {Array.from({length: 8}, (_, i) => i+1).map((i, index) => (
                    <td key={index+56} className="pixel-cell">
                        <div className="pixel" data-space={index+56} style={{'backgroundColor': '#'+Number(this.props.tokenColorForIndex(index+56)).toString(16)}} onClick={this.props.handlePixelSelect}></div>
                    </td>
                ))}
                </tr>
                </tbody>
            </table>
            </div>
        )
    }
}

export default Canvas;