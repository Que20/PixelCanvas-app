import React, { Component } from 'react';
import './App.css';

import Canvas from './canvas/Canvas'
import PixelEditor from './pixelEditor/PixelEditor'
import Loading from './loading/Loading'
import Header from './header/Header'

import ETH from './eth'
import Web3 from 'web3';

const PixelSelectedType = {
    MINT: "mint",
    COLOR: "color",
    NONE: "none",
    OWNED: "owned"
}

class App extends Component {
    constructor(props) {
		super(props)
		this.state = {
            account: null,
            eth: null,
            allTokens: [],
            balance: [],
            message: "",
            editorViewType: PixelSelectedType.NONE,
            loadEthState: {id: -1, label: "Loading app..."},
            selectedIndex: "",
            selectedId: "",
            selectedColor: "",
            menuItem: "canvas",
            locked: false
        }
	}

    async componentDidMount() {
		let myEth = new ETH()
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable()
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
		}
		await myEth.init(window.web3, this)
		await myEth.loadBlockchainData()
		this.setState({ account: myEth.account })
		this.setState({ eth: myEth})

        myEth.getTokens((balance) => {
            this.setState({ balance: balance })
        })
        myEth.allTokens((tokens) => {
            this.setState({ allTokens: tokens })
        })
        myEth.getSoldoutEvent(this.soldoutHandler)
	}

    soldoutHandler = (soldout, locked) => {
        if (soldout) {
            this.setState({ locked: locked })
            setTimeout(function() {
                this.state.eth.getSoldoutEvent(this.soldoutHandler)
            }.bind(this), 100)
        }
    }

    prompt = (message) => {
        this.setState({ message: message})
    }

    ethLoadState = (loadState) => {
        let states = {
            1: "All good",
            2: "Unable to retreive network data",
            3: "Unable to get the smart contract",
            4: "Unable to acces the metamask account"
        }
        this.setState({ loadEthState: {id: loadState, label: states[loadState]} })
    }

    render() {
        if(this.state.loadEthState.id === 1) {
            if (this.state.menuItem === "canvas") {
                return (
                    <div className="App">
                        <Header account={""+this.state.account} delegate={this}/>  
                        <p> {"\n"+this.state.message} </p>
                        <table className="main">
                            <tbody>
                                <tr>
                                    <td>
                                        <Canvas tokenColorForIndex={this.tokenColorForIndex} handlePixelSelect={this.handlePixelSelect}/>
                                    </td>
                                    <td>
                                        <PixelEditor pixelSelectedType={this.state.editorViewType} selectedId={this.state.selectedId} selectedIndex={this.state.selectedIndex} selectedColor={this.state.selectedColor} delegate={this}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )
            } else {
                return (
                    <div className="App">
                        <Header account={""+this.state.account} delegate={this}/>
                        <h3>You own {this.state.balance.length} pixel</h3>
                        <table className="form">
                            <tbody>
                            <tr>
                                <td>id</td>
                                <td>index (in the grid)</td>
                                <td>color</td>
                            </tr>
                            {this.state.balance.map((token) => {
                                return (
                                    <tr key={token.token_id}>
                                    <td>{token.token_id}</td>
                                    <td>{token.index}</td>
                                    <td style={{'backgroundColor': '#'+Number(token.color).toString(16), 'width': '30px'}}></td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>   
                        <p> {"\n"+this.state.message} </p>
                    </div>
                )
            }
        } else {
            return (<Loading message={this.state.loadEthState.label} />)
        }
    }

    menuItem = (item) => {
        this.setState({menuItem: item});
    }

    handlePixelSelect = (event) => {
        if (this.state.locked) { return }
        this.setState({message: ""})
        const index = event.target.dataset.space
        const ownedByMe = this.state.balance.find((element) => {
            return element.index === index
        })
        if (ownedByMe) {
            this.setState({
                selectedColor: ownedByMe.color,
                editorViewType: PixelSelectedType.COLOR,
                selectedId: ownedByMe.token_id,
                selectedIndex: ""
            })
        } else {
            const ownedByAnyone = this.state.allTokens.find((element) => {
                return element.index === index
            })
            if (!ownedByAnyone) {
                this.setState({
                    selectedColor: "",
                    selectedIndex: index,
                    selectedId: "",
                    editorViewType: PixelSelectedType.MINT
                })
            } else {
                this.setState({editorViewType: PixelSelectedType.OWNED})
            }
        }
    }

    mint = (index, color) => {
        if (index === "" || color === "") { return }
        this.state.eth.mint(0.01, color, index, (values) => {
            this.state.eth.getTokens((balance) => {
                this.setState({ balance: balance })
                this.state.eth.allTokens((tokens) => {
                    this.setState({ allTokens: tokens })
                })
            })
        })
    }

    colorise = (id, color) => {
        if (id === "" || color === "") { return }
        this.state.eth.colorise(id, color, (done) => {
            this.state.eth.getTokens((balance) => {
                this.setState({ balance: balance })
                this.state.eth.allTokens((tokens) => {
                    this.setState({ allTokens: tokens })
                })
            })
        })
    }

    tokenColorForIndex = (i) => {
        let token = this.state.allTokens.find((element) => {
            return element.index === i
        })
        return token?.color ?? 0
    }
}

export default App;
