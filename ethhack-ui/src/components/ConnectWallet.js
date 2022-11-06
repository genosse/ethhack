//import React from 'react'
import React, { useState } from 'react';

import api from '../api'
const { ethers } = require("ethers");

require('./ConnectWallet.less');
//import "babel-polyfill";

//-----------------------------------------------------------------------------
export default class ConnectWallet extends React.Component {

  constructor(props) {
    super(props);
    let wallet = api.get_wallet();
    this.state = {};
    this.onConnectWallet = this.onConnectWallet.bind(this);
  }

  componentDidMount() {
  }

  onConnectWallet = () => {
    //const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    //// Prompt user for account connections
    //provider.send("eth_requestAccounts", []);
    //const signer = provider.getSigner();
    //console.log("Account:", await signer.getAddress());
    //await window.ethereum.enable();
    //const provider = new ethers.providers.Web3Provider(window.ethereum);
    //const signer = provider.getSigner();
    //log(signer);
    //let provider;
    //window.ethereum.enable().then(
      //provider = new ethers.providers.Web3Provider(window.ethereum),
      //error    => log(error),
    //);
    //this.props.I//
    ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
      this.setState({ wallet: accounts[0] });
    });
    //log(1);
    //ethereum.request({ method: 'eth_requestAccounts' })

  }


  render() { return (

    <div className="connect-wallet">

      <img src="images/face_green.png" />

      <button onClick={this.onConnectWallet}>Connect wallet</button>

    </div>

  ) }

}

