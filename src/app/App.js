import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
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
            loadingInfo: {id: -1, label: "Loading app..."},
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

    render() {
        if(this.state.loadingInfo === null) {
            if (this.state.menuItem === "canvas") {
                return (
                    <div className="App">
                        <Header account={""+this.state.account} delegate={this}/>  
                        <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                        
                        {/* <p> {"\n"+this.state.message} </p> */}
                        
                        <div className="app-container">
                        {/* <table className="main">
                            <tbody>
                                <tr>
                                    <td>
                                        <Canvas tokenColorForIndex={this.tokenColorForIndex} selected={this.state.selectedIndex} handlePixelSelect={this.handlePixelSelect}/>
                                    </td>
                                    <td>
                                        <PixelEditor pixelSelectedType={this.state.editorViewType} selectedId={this.state.selectedId} selectedIndex={this.state.selectedIndex} selectedColor={this.state.selectedColor} delegate={this}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table> */}
                            <div className="main-view">
                                <div className="canvas-container"><div className="canvas-view">
                                    <Canvas allTokens={this.state.allTokens} selected={this.state.selectedIndex} handlePixelSelect={this.handlePixelSelect}/>
                                </div></div>
                                <div className="pixel-container"><div className="pixel-view">
                                    <PixelEditor pixelSelectedType={this.state.editorViewType} selectedId={this.state.selectedId} selectedIndex={this.state.selectedIndex} selectedColor={this.state.selectedColor} colorSelection={this.colorSelection} delegate={this}/>
                                </div></div>
                            </div>
                        </div>
                        <h6> Made with ❤️ <a href='https://maarek.io'>maarek.io</a></h6>
                    </div>
                )
            } else {
                return (
                    <div className="App">
                        <Header account={""+this.state.account} delegate={this}/>
                        <div className="app-container">
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
                        </div>
                        <p> {"\n"+this.state.message} </p>
                        <h6> Made with ❤️ <a href='https://maarek.io'>maarek.io</a></h6>
                    </div>
                )
            }
        } else {
            return (<Loading message={this.state.loadingInfo.label} />)
        }
    }

    menuItem = (item) => {
        this.setState({menuItem: item});
    }

    handlePixelSelect = (event) => {
        // let tkns = this.state.allTokens.filter((v, i, a) => { 
        //     return v.token_id != -1
        // })
        // this.setState({ allTokens: tkns })
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
                selectedIndex: index
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

    colorSelection = (index, color) => {
        // var current = this.state.allTokens
        // for(var i = 0; i < current.length; i++) {
        //     if(current[i].token_id == -1) {
        //         current[i].color = null
        //     }
        // }
        let current = this.state.allTokens.filter((v, i, a) => { 
            return v.token_id != -1
        })
        console.log(current)
        current.push({token_id: -1, color: color, index: index})
        //this.setState({ allTokens: current })
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

    // tokenColorForIndex = (i) => {
    //     let token = this.state.allTokens.find((element) => {
    //         return element.index === i+""
    //     })
    //     return token?.color ?? 0
    // }

    prompt = (type, message) => {
        const conf = {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        }
        if (type == "info") {
            toast.info(message, conf)
        }
        if (type == "success") {
            toast.success(message, conf)
        }
        if (type == "error") {
            toast.error(message, conf)
        }
    }

    unableToConnectNetwork = () => {
        this.prompt('error', 'Unable to connect to the correct network.')
    }
    unableToAddNetwork = () => {
        this.prompt('error', 'Unable to add the correct network to your metamask wallet')
    }
    loadSuccess = () => {
        this.setState({loadingInfo: null})
    }
    metamaskError = () => {
        this.prompt('error', 'Unable to connect to your wallet\nIs your metamask correctly set up?')
    }
    noMetamask = () => {
        this.setState({loadingInfo: {id: -1, label: "No metamask"}})
    }
    contractError = () => {
        this.prompt('error', 'Unable to retreive the smart contract')
    }

}

export default App;
