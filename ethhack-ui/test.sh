#!/bin/bash
#
curl --request POST \
     --url https://eth-sepolia.alchemyapi.io/v2/demo \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
     "id": 1,
     "jsonrpc": "2.0",
     "method": "eth_getLogs",
     "params": [
          {
               "address": [
                    "0x19072f42D9424c54E2258bB89E0dD8f20341810e"
               ],
               "fromBlock": "0x0",
               "toBlock": "latest"
          }
     ]
}
'
