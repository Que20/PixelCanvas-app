import { classPrivateMethod } from '@babel/types';
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
            showPicker: false
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
        this.setState({ color: color.hex.replace('#', '0x') })
        this.props.colorSelection(this.props.selectedIndex, color)
    }

    showPicker = () => {
        let value = !this.state.showPicker
        this.setState({
            showPicker: value,
        })
    }

    render() {
        switch (this.props.pixelSelectedType) {
            case PixelSelectedType.NONE:
                return (<p> Select a pixel first </p>)
            case PixelSelectedType.MINT:
                return (
                <div>
                    <h1>Buy this pixel</h1>
                    {/* <table className="form">
                        <tbody>
                        <tr>
                            <td>
                            Index (where in the grid - from 0 to 63)
                            </td>
                            <td>
                            <input type="text" name="index" value={this.props.selectedIndex} onChange={this.handleChange} disabled />
                            <input type="text" name="indexToMint" value={this.state.test}/>
                            </td>
                        </tr>

                        <tr>
                            <td>
                            Color (ex: 0xbf2a2a)
                            </td>
                            <td>
                            <input type="text" name="color" value={this.state.color} onChange={this.handleChange} />
                            <input type="text" name="indexToMint" value={this.state.test}/>
                            </td>
                        </tr>
                        </tbody>
                    </table> */}
                    <br></br>
                    <div>
                    {this.state.showPicker ? (<SketchPicker color={this.state.color} onChangeComplete={this.handleChangeColor}/>) : null}
                    <br></br>
                    {this.defaultPalette()}
                    <br></br>
                    <button className="mint-cta" onClick={this.mint}>Buy</button>
                    </div>
                </div>
                )
            case PixelSelectedType.COLOR:
                return (
                <div>
                    <h2>Hey, this pixel is yours!</h2>
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
                    {/* <button onClick={this.color}>Colorise</button> */}
                    {/* <button onClick={this.clear}>Clear</button> */}
                    <button className="mint-cta" onClick={this.color}>Done</button>
                </div>
                )
            case PixelSelectedType.OWNED:
                return (<p> You dont own this pixel </p>)
            default:
                return (<p> No selection </p>)
        }
        
    }

    defaultPalette = () => {
        const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#fffffc']
        return (
            <table>
                <tbody>
                    <tr>
                        <td><div className="suggested-color" style={{'backgroundColor': colors[0]}} data-space={0} onClick={this.defaultColorSelection}> </div></td>
                        <td><div className="suggested-color" style={{'backgroundColor': colors[1]}} data-space={1} onClick={this.defaultColorSelection}> </div></td>
                        <td><div className="suggested-color" style={{'backgroundColor': colors[2]}} data-space={2} onClick={this.defaultColorSelection}> </div></td>
                        <td><div className="suggested-color" style={{'backgroundColor': colors[3]}} data-space={3} onClick={this.defaultColorSelection}> </div></td>
                    </tr>
                    <tr>
                        <td><div className="suggested-color" style={{'backgroundColor': colors[4]}} data-space={4} onClick={this.defaultColorSelection}> </div></td>
                        <td><div className="suggested-color" style={{'backgroundColor': colors[5]}} data-space={5} onClick={this.defaultColorSelection}> </div></td>
                        <td><div className="suggested-color" style={{'backgroundColor': colors[6]}} data-space={6} onClick={this.defaultColorSelection}> </div></td>
                        <td><div className="suggested-color" style={{'backgroundColor': colors[7]}} data-space={7} onClick={this.defaultColorSelection}> </div></td>
                        <td><div className="suggested-color add" style={{'backgroundColor': this.state.color.replace('0x', '#')}} onClick={this.showPicker}>+</div></td>
                    </tr>   
                </tbody>
            </table>
        )
    }

    defaultColorSelection = (event) => {
        const index = event.target.dataset.space
        const colors = ['0xffadad', '0xffd6a5', '0xfdffb6', '0xcaffbf', '0x9bf6ff', '0xa0c4ff', '0xbdb2ff', '0xfffffc']
        this.setState({ color: colors[index] });
        console.log('kkk')
        this.props.colorSelection(this.props.selectedIndex, colors[index])
    }
}

export default PixelEditor;