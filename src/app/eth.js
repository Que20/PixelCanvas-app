const PixelCanvasContract = require("../PixelCanvas.json")

class ETH {

    constructor() {
        this.web3 = null
        this.account = null
        this.contract = null
        this.delegate = null
    }
	
	init = (web3, delegate) => {
		this.web3 = web3
        this.delegate = delegate
	}

    log = (text) => {
        if (this.delegate != null) {
            this.delegate.prompt(text)
        } else {
            console.log(text)
        }
    }

    notifyState = (state) => {
        // States :
        // 1 => All good
        // 2 => Unable to retreive network data
        // 3 => Unable to get the smart contract
        // 4 => Unable to acces the metamask account
        if (this.delegate != null) {
            this.delegate.ethLoadState(state)
        } else {
            console.log(state)
        }
    }

	loadBlockchainData = async () => {
		const accounts = await this.web3.eth.getAccounts()
		this.account = accounts[0]
		const networkId = await this.web3.eth.net.getId()
		const networkData = PixelCanvasContract.networks[networkId]
		if(networkData) {
			const abi = PixelCanvasContract.abi
			const address = networkData.address
			this.contract = new this.web3.eth.Contract(abi, address)
            if(this.contract != null && this.account != null) {
                this.notifyState(1)
            } else {
                if(this.account === null) {
                    this.notifyState(4)
                }
                if(this.contract === null) {
                    this.notifyState(3)
                }
            }
		} else {
			this.notifyState(2)
		}
	}

	mint = (price, color, index, callback) => {
        console.log("COLOR "+color)
        console.log("INDEX "+index)
		var mintTxHash = null
		this.contract.methods.mint(Number(color), index+"").send({from: this.account, value: (price*10**18)}, (error, result) => {
			mintTxHash = result
            // TODO : handle error
            if (error === null) {
                this.log("Token successfully minted. Now waiting for miners validation. This could take a few minutes.")
            } else {
                this.log("Oops, something happend. No token were minted. Try again.")
            } 
		})
		this.contract.events.allEvents((error, event) => {
            console.log(event)
			if (event != null && mintTxHash != null) {
				if (event.transactionHash === mintTxHash && event.returnValues.to === this.account) {
                    this.log("Got mint validation!")
					callback(event.returnValues)
				}
			}
		})
	}

    colorise = (token_id, color, callback) => {
        var updateTxHash = null
        this.contract.methods.updateColor(color, token_id).send({from: this.account}, (error, result) => {
            updateTxHash = result
            this.log("Update color called.")
            callback(result)
        })
        this.contract.events.allEvents((error, event) => {
			if (event != null && updateTxHash != null) {
				if (event.transactionHash === updateTxHash) {
                    this.log("Got color validation!")
					callback(event.returnValues)
				}
			}
		})
    }

    getTokens = (callback) => {
        var owned = []
        this.getColoredEvents((coloredEvent) => {
            this.getIndexEvents((indexedEvent) => {
                this.contract.methods.balanceOf(this.account).call((err, res) => {
                    var i = 0
                    for (i = 0; i < res; i++) {
                        this.contract.methods.tokenOfOwnerByIndex(this.account, i).call((err, token) => {
                            let color = -1
                            for (const evt of coloredEvent) {
                                if (evt.returnValues.token_id === token) {
                                    color = evt.returnValues?.newColor ?? -1
                                }
                            }
                            const index = indexedEvent.find((element) => {
                                return element.returnValues.token_id === token
                            })?.returnValues?.index ?? -1
                            owned.push({token_id: token, color: color, index: index})
                            if (owned.length === parseInt(res)) {
                                callback(owned)
                            }
                        })
                    }
                })
            })
        })
    }

    allTokens = (callback) => {
        var tokens = []
        this.getColoredEvents((coloredEvent) => {
            this.getIndexEvents((indexedEvent) => {
                this.contract.methods.totalSupply().call((err, totalSupply) => {
                    var i = 0
                    for (i = 0; i < totalSupply; i++) {
                        this.contract.methods.tokenByIndex(i).call((err, token) => {
                            let color = -1
                            for (const evt of coloredEvent) {
                                if (evt.returnValues.token_id === token) {
                                    color = evt.returnValues?.newColor ?? -1
                                }
                            }
                            const index = indexedEvent.find((element) => {
                                return element.returnValues.token_id === token
                            })?.returnValues?.index ?? -1
                            tokens.push({token_id: token, color: color, index: index})
                            if (tokens.length === parseInt(totalSupply)) {
                                callback(tokens)
                            }
                        })
                    }
                })
            })
        })
    }

    getColoredEvents = (callback) => {
        if (this.contract == null) { return }
        this.contract.getPastEvents('Colored', {fromBlock: "earliest", toBlock: "latest"}, (err, events) => {
            callback(events)
        });
    }

    getIndexEvents = (callback) => {
        if (this.contract == null) { return }
        this.contract.getPastEvents('Indexed', {fromBlock: "earliest", toBlock: "latest"}, (err, events) => {
            callback(events)
        });
    }

    logEvents = (name) => {
        if (this.contract == null) { return }
        this.contract.getPastEvents(name, {fromBlock: "earliest", toBlock: "latest"}, (err, events) => {
            console.log(events)
        });
    }

    getSoldoutEvent = (callback) => {
        if (this.contract == null) { return }
        this.contract.getPastEvents('Soldout', {fromBlock: "earliest", toBlock: "latest"}, (err, events) => {
            const unix_timestamp = events[0]?.returnValues?.timestamp ?? 0
            if (unix_timestamp !== 0) {
                const date = new Date(unix_timestamp * 1000);
                this.log("Canvas soldout on "+date)
                const now = new Date();
                const delay = 72
                const limit = new Date((unix_timestamp*1000)+(delay*60*60*1000))
                if (now > limit) {
                    callback(true, true)
                } else {
                    const diff = this.dateDiff(now, limit)
                    const strLeft = diff.day+" days, "+diff.hour+" hours, "+diff.min+" min, "+diff.sec+" seconds"
                    this.log("Canvas soldout on "+date+". "+strLeft+" left to modify.")
                    callback(true, false)
                }
            } else {
                callback(false, false)
            }
        });
    }

    dateDiff = (date1, date2) => {
        var diff = {}
        var tmp = date2 - date1;
        tmp = Math.floor(tmp/1000)
        diff.sec = tmp % 60
        tmp = Math.floor((tmp-diff.sec)/60)
        diff.min = tmp % 60
        tmp = Math.floor((tmp-diff.min)/60)
        diff.hour = tmp % 24
        tmp = Math.floor((tmp-diff.hour)/24)
        diff.day = tmp
        return diff
    }
}
export default ETH