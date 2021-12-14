import React, { Component } from 'react';

class Canvas extends Component {

    componentDidMount() {
        console.log(this.props.selected)
    }

    render() {
        const rows = [0, 8, 16, 24, 32, 40, 48, 56]
        return (
            <div>
                {/* <p>{this.props.allTokens.length+''}</p> */}
                <table className="canvas">
                    <tbody>
                    {Array.from({length: 8}, (_, i) => i+1).map((i, row) => (
                        <tr key={rows[row]}>
                        {Array.from({length: 8}, (_, i) => i+1).map((i, index) => (
                            <td key={index+rows[row]} className="pixel-cell">
                                <div    className="pixel"
                                        data-space={index+rows[row]}
                                        style={{
                                            'backgroundColor': '#'+Number(this.props.allTokens.find((e) => { return e.index === (index+rows[row])+"" })?.color ?? 0).toString(16),
                                            // 'border' : (this.props.selected == index ? '1px solid #a0c4ff' : 'none')
                                        }}
                                        onClick={this.props.handlePixelSelect}>
                                            {this.props.selected == index+rows[row] ? (
                                                <div className='blink-selection' style={{'backgroundColor': 'rgba(0, 0, 0, 0.2)', 'width':'100%', 'height':'100%'}}> </div>
                                            ) : null}
                                </div>
                            </td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )
    }

    // tokenColorForIndex = (i) => {
    //     let token = this.props.allTokens.find((element) => {
    //         return element.index === i+""
    //     })
    //     return token?.color ?? 0
    // }
}

export default Canvas;