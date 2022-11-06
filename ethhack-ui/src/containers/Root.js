import React from 'react';

import api from '../api';
const { ethers } = require('ethers');

import ConnectWallet from '../components/ConnectWallet';
import * as PushAPI from '@pushprotocol/restapi';
//-----------------------------------------------------------------------------
let PK = "your-contract-address"; // channel private key
let Pkey = `0x${PK}`;
let signer = new ethers.Wallet(Pkey);
let contractABI = require("../../artifacts/contracts/FundMe.sol/FundMe.json");
let YOUR_CONTRACT_ADDRESS = "0x5Ba0Cff3EFC249F0E3c313f3c569BeA05738a600";

class Root extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      route: '',
      args: {},
      projects: [],
    };
    this.onConnectWallet = this.onConnectWallet.bind(this);
    this.onSignTheVote = this.onSignTheVote.bind(this);
    this.onSendToTheFund = this.onSendToTheFund.bind(this);
    console.log(PK)

  }

  //---------------------------------------------------------------------------
  getRouteFromLocation(route) {
    if (location.hash != this.state.route) {
      this.state.route = location.hash;

      if (this.state.route.startsWith('#')) {
        this.state.route = this.state.route.substr(1);
      }

      let args = this.state.route.split('!');
      this.state.route = args.shift();
      this.state.args = {};
      if (args.length) {
        args[0].split(/&|\//).forEach((arg) => {
          let data = arg.split('=');
          this.state.args[data[0]] = data[1];
        });
      }
    }
  }

  //---------------------------------------------------------------------------
  updateState() {
    this.setState(this.state);
  }

  //---------------------------------------------------------------------------
  splash_show() {
    log('splash_show');
    if ($('#splash').is(':visible')) {
      return;
    }
    $('html,body').css('cursor', 'wait');
    var splash = document.getElementById('splash');
    splash.style.opacity = 0;
    splash.style.display = 'block';
    setTimeout(() => {
      splash.style.opacity = 0.8;
    }, 1000);
  }

  //---------------------------------------------------------------------------
  splash_hide() {
    $('html,body').css('cursor', 'auto');
    var splash = document.getElementById('splash');
    splash.innerHTML = '';
    splash.style.display = 'none';
  }

  setProjectsJson(json) {
    let projects = json.map((o) => {
      return {
        name: o['What the title of your project?'],
        text: o['Description of your proejct'],
        addr: o["What's your wallet address?"],
      };
    });
    this.updateVotes(projects, api.get_votes());
    //this.setState({ projects: projects });
  }

  sendNotification = async() => {
    try {
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 3, // target
        identityType: 2, // direct payload
        notification: {
          title: `[SDK-TEST] notification TITLE:`,
          body: `[sdk-test] notification BODY`
        },
        payload: {
          title: `[sdk-test] payload title`,
          body: `sample msg body`,
          cta: '',
          img: ''
        },
        recipients: 'eip155:5:0x9d84E24717bA24B9823bc6540943c84B0F8282c4', // recipient address
        channel: 'eip155:5:0x9d84E24717bA24B9823bc6540943c84B0F8282c4', // your channel address
        env: 'staging'
      });
      
      // apiResponse?.status === 204, if sent successfully!
      console.log('API repsonse: ', apiResponse);
    } catch (err) {
      console.error('Error: ', err);
    }
  }

  voteProject(walletAddress) {
    //if (!this.state.wallet) {
    //  return;
    //}
    let votes = api.get_votes();
    let index = votes.indexOf(walletAddress);
    if (index != -1) {
      votes.splice(index, 1);
    } else {
      votes.push(walletAddress);
      votes = votes.slice(-5);
    }
    this.updateVotes(this.state.projects, votes);
    this.sendNotification();
  }

  updateVotes(projects, votes) {
    projects.map((p) => {
      if (votes.includes(p.addr)) {
        p.votedUp = true;
      } else {
        p.votedUp = false;
      }
    });

    let votes_new = [];
    votes.map((v) => {
      projects.map((p) => {
        if (v === p.addr) {
          votes_new.push(p.addr);
        }
      });
    });

    api.set_votes(votes_new);
    log(votes_new);

    let hearts = votes_new.map(() => '🤍').join('');
    hearts = '❤️'.repeat(5 - votes_new.length) + hearts;

    this.setState({ projects: projects });
    this.setState({
      votes: votes_new,
      hearts: hearts,
    });
  }

  //---------------------------------------------------------------------------
  async onSignTheVote() {
    let votes = this.state.votes;
    log(votes);

    const provider = new ethers.providers.Web3Provider(
      window.ethereum,
      'any'
    );
    //let signer =
    await provider.send('eth_requestAccounts', []);
    log(provider);

    const signer = ethers.getSigner();
    const signature = await signer.signMessage(message);
    log(signature);
    //provider.send("eth_requestAccounts", []);
    //:v
  }

  //---------------------------------------------------------------------------
  connectWalletProvider = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        // Wallet not installed
        alert("Get MetaMask!");
        return;
      }

      // Change network to rinkeby
      await ethereum.enable();
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{ chainId: `0x647426021` }],
        // I have used Rinkeby, so switching to network ID 4
      });
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x647426021` }],
        // I have used Rinkeby, so switching to network ID 4
      });
      console.log("Connected", accounts);
      localStorage.setItem("walletAddress", accounts[0]);
    } catch (error) {
      console.log("here")
      console.log(error);
    }
  };
  //---------------------------------------------------------------------------
  onSendToTheFund() {
    // this.connectWalletProvider();
    if (window.ethereum) {
      // Listeners
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        this.checkedWallet();
      });
    }
    this.fetchCurrentValue();
    log('onSendToTheFund');
  }
  //---------------------------------------------------------------------------
  getContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(
      YOUR_CONTRACT_ADDRESS,
      contractABI.abi,
      signer
    );
    return contract;
  };

  getContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(
      YOUR_CONTRACT_ADDRESS,
      contractABI.abi,
      signer
    );
    return contract;
  };

  fetchCurrentValue = async () => {
    let owner_ = await this.getContract().getOwner();
    console.log(owner_);
  };

  //---------------------------------------------------------------------------
  componentDidMount() {
    this.splash_hide();
    $(window).on('hashchange', () => {
      this.getRouteFromLocation();
      this.updateState();
    });
    this.getRouteFromLocation();
    this.updateState();

    const ms = Date.now();
    fetch('./responses.json?' + ms)
      .then((response) => response.json())
      .then((json) => this.setProjectsJson(json))
      .catch((error) => err(error));
  }

  handleChange(elm) {
    this.setState({
      address: elm.value,
    });
  }

  handleClick() {
    log(1);
  }

  renderProjects() {}

  renderLogin() {}

  onConnectWallet() {
    this.splash_show();
    ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        this.splash_hide();
        this.setState({ wallet: accounts[0] });
      });
  }

  render() {
    return (
      <div
        className={
          'body ' +
          this.state.lang +
          ' ' +
          (navigator.standalone ? ' standalone' : ' ')
        }
      >
        <div className="content">
          {/*this.state.wallet */}
          <div className="login">
            <div className="connect-wallet">
              {/*
              <button onClick={this.onConnectWallet}>Connect wallet</button>
              */}
              <a href="https://app.unlock-protocol.com/checkout?client_id=ethhack.org&redirect_uri=https%3A%2F%2Fethhack.org%2F">
                <button>Connect wallet</button>
              </a>

              <button onClick={this.onSignTheVote}>
                Sign the Vote
              </button>
              <button onClick={this.onSendToTheFund}>
                Send 0.001 ETH to the Fund
              </button>
            </div>
          </div>
          <div className="projects">
            <h1>{this.state.hearts}</h1>
            {this.state.projects.map((p) => (
              <div key={p.name}>
                <h1>{p.name}</h1>
                <b
                  onClick={() => this.voteProject(p.addr)}
                  className="clickable"
                >
                  {p.votedUp ? '❤️' : '🤍'}
                </b>
                <p>{p.text}</p>
                <a>{p.addr}</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Root;
