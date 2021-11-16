import React, { Component } from 'react';
import { SketchPicker } from 'react-color';

const PixelSelectedType = {
    MINT: "mint",
    COLOR: "color",
    NONE: "none",
    OWNED: "owned"
}

class PixelEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            color: "",
        }
    }

    componentDidMount = () => {
        this.setState({
            color: ""
        })
        //'#'+Number(this.props.selectedColor).toString(16)
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    clear = () => {
        this.setState({
            color: "",
        })
    }

    color = () => {
        this.props.delegate.colorise(this.props.selectedId, this.state.color)
    }

    mint = () => {
        this.props.delegate.mint(this.props.selectedIndex, this.state.color)
    }

    handleChangeColor = (color) => {
        this.setState({ color: color.hex.replace('#', '0x') });
    };

    render() {
        switch (this.props.pixelSelectedType) {
            case PixelSelectedType.NONE:
                return (<p> Select a pixel first </p>)
            case PixelSelectedType.MINT:
                return (
                <div>
                    <h1>Buy this pixel</h1>
                    <table className="form">
                        <tbody>
                        <tr>
                            <td>
                            Index (where in the grid - from 0 to 63)
                            </td>
                            <td>
                            <input type="text" name="index" value={this.props.selectedIndex} onChange={this.handleChange} disabled />
                            {/* <input type="text" name="indexToMint" value={this.state.test}/> */}
                            </td>
                        </tr>

                        <tr>
                            <td>
                            Color (ex: 0xbf2a2a)
                            </td>
                            <td>
                            <input type="text" name="color" value={this.state.color} onChange={this.handleChange} />
                            {/* <input type="text" name="indexToMint" value={this.state.test}/> */}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <br></br>
                    <div style={{"margin": "0 auto", "width": "220px"}}>
                    <SketchPicker
                        color={this.state.color}
                        onChangeComplete={this.handleChangeColor}
                    />
                    </div>
                    <br></br>
                    <button onClick={this.mint}>Buy</button>
                    <button onClick={this.clear}>Clear</button>
                </div>
                )
            case PixelSelectedType.COLOR:
                return (
                <div>
                    <h1>Colorise a pixel you own</h1>
                    <table className="form">
                        <tbody>
                        <tr>
                            <td>
                            Id (ex: 1):
                            </td>
                            <td>
                            <input type="text" name="id" value={this.props.selectedId} onChange={this.handleChange} disabled />
                            {/* <input type="text" name="indexToMint" value={this.state.test}/> */}
                            </td>
                        </tr>

                        <tr>
                            <td>
                            Color (ex: 0xbf2a2a)
                            </td>
                            <td>
                            <input type="text" name="color" value={this.state.color} placeholder={'0x'+Number(this.props.selectedColor).toString(16)} onChange={this.handleChange} />
                            {/* <input type="text" name="indexToMint" value={this.state.test}/> */}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <br></br>
                    <div style={{"margin": "0 auto", "width": "220px"}}>
                    <SketchPicker
                        color={this.state.color}
                        onChangeComplete={this.handleChangeColor}
                    />
                    </div>
                    <br></br>
                    <button onClick={this.color}>Colorise</button>
                    <button onClick={this.clear}>Clear</button>
                </div>
                )
            case PixelSelectedType.OWNED:
                return (<p> You dont own this pixel </p>)
        }
        
    }
}

export default PixelEditor;