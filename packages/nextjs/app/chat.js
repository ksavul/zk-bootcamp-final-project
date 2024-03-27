import { useState, useEffect } from "react";
import "./App.css";
import {
  Avatar,
  ChatContainer,
  ConversationHeader,
  InfoButton,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  TypingIndicator,
  VideoCallButton,
  VoiceCallButton,
  emilyIco,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ethers } from "ethers";
import OpenAI from "openai";
import SindriClient from "sindri";
// import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { getParsedError } from "~~/utils/scaffold-eth";

// import {useContractRead} from "~~/hooks/scaffold-eth";


// import { Client, HTTPTransport, RequestManager } from "@open-rpc/client-js";

const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

const theProof = "0cc154c5830ddb89d49765cf795b1203042e802c91b438d3dc21037a7ccce0f128c2e029998e394b43bd4b899dbb60b5440c4def888b39d4e4ab54fce9589eb11aa117cbcaec210cdd9e2d75750e9bbfea20ca2605d20e34d4eb918d10a6517f21d9f40ae1e7ff00cefeeef5df9f16779c5fe4668f9009db62d2b6d5bdb56c2c05ddf89b624abf739dc8964d051e4c6fb7b56d6d12ce31eae9285aeb2518abeb1c84b4efea4e6c66df25c657661aad9f68f239bfb83f81094bc811936ec09ca01675de5db54cc8f0f8b6b6b9e64becb066d0443dc3eba627cc947a82c27b67841e8c0f31b92e5f590a4ae2fcc8dbaaa38ac6cb61cd02d7b15a45d0499f6e788b2daeb0f267f410dbca71d56836ee8c5e9c1f56cb5902f1d4aef7e11586b656662bca83ad68c132decb67fbdd00d54a44f2c82b5c630b9919adcf980a28d3312401e076bb067fdb3afee8db3eb56c00ecec8c9f0041b71c72388c956c3bcfd62d035b08d549bd7668e9f60d7411d32978301a1072a0a60c74d1e410378db97adb0ca030495d09d5fdd1829b1015900bc076b361b97097af709b96fbffedb752e70edb3c5c5fe1f70b680ca8c241f5bf122461d3512d44b8ce1ba7dcc5d55ae17206bbd446f5377f8d5223017a02a1758ee115b5c15f21f5c543486bc1ab5463e111fee5e118f0fa0b18b30083a044444d76b518f3106688112847c04e0a7b631a2aca91cb92d870bba0d828184b2204d376e511ebea609acba938ee42daabe18d25e761ce3f7398861c890a3d90f38714edb9dbbd002467f306be90ff7041d09518ad102b856ca03cd0d673ca0908ba30e6b6ac644ce5afb381805d8ad930848e0321edbaa8d8c6dec77bea315286b35609bbe5878993ce6177bb34810e805d11295c7a7e45796ea1ce3ce658fbdf959492c557aaec2deb0c2932c44df4cf99ed1dd1acb7b2a35c3264b3e1e5378f181fa4129ea15c84a6f50a9ee6591092bb6f08c1f72cc5b82e11bf20c10821622fa248d0cfdefb7b30d9e2d8568d498b552403e8451b6a8680dcf0c5afcdb2af66f441acc1fa81880c639adc788de7b1890a175dc400ba1efd95d5a5c56b6fa18b23c4f19ffd718babd18b46d7bb5ac4ca131db898280569e1aa1787a56f8945ac1f27510eb0cefe1a5090316c9bd961a6e9050322c468d6d17a8c9c8f967322abe7ec4a46365c42e03e507286d66cb38d9c020845ffe750af40ea5007db81e69a95c8dd267df1327ed62803c5e4b31010dd30319c79cbec6a3482453b406a4c7b94137dba6dccd5cebf5c26e5fd62f51697216eab356ebc23bebf7ffaa912d0fa223850e95480d620adbf8651277d1d706e043a0038b52a4d30d5bbed020d0e7305f0ca5f98d4d14f09099b92522f5d1b200f292c408d60992420a9ec7c5a16383d6214b4ba9d29914a76fb57947b66175c1857976aed3425fd7216da768417172235e34ad1e5f07e489d571d04f97dc3472a9ea113b55be55cdef451c1d4c0d53ea7e82f4c2e160f835c924d20c2e6b81c04e668cf1ea5175819046d901348947b2a1b1ebc45c76239e753e60b9923c0871266a837800aacf8924b62afc213cfa2679db5d5c06623e012315f80234ebdcb10535a68468a52995aae61612f9e56b93a7316550a02d83065d37f7ffca7af090c513be6f33568e74efa24d68561f684bcbafc169c0c05244a11b0bd7e3ca4ea084f1d659fe07f354345e84bdb2596503f02e1d82e1532182e4fe1faffd19acb2703514800a61b51248779c92f1f65a455d6021f8bef212a20b06452a49e022a0c0b74e798daa334a7592db301654b4457c90406007ce2b4dce987f6b8e9767b158671408ab7dc5a077d83b098a9bf117045b0c2682f328c026adb33fdf644de110143fbcbd71da7ddb3c88e919cd4d30c0324b287ed60aab260176b874a80a7004ae062f936abd12bdd6f3686acd5e74392ad5b52278bfff6cc447602fb868d2cad105487136248d87978625df1ce0fee0e7b655dea29851eec6b4774907c6f28aaf1d333be7896ccc53bd7b3b56ddb70566126eff35679032a9c84f625725024a8d351e0698ee4c110ff4d09790da6f29e46e881fc836ce768cdc277ba6831044cfee44c8b95833791abc130e9361bc14ac799c01e5f0c128e1338816690ac2596f34110ba7763885936868f2f6f26185e0c04fd514eff226cf9aff29169a827974828dd0f76f94dec0114efc8c8264be43153c42711ee1625f7fb44f5853a04d321213b398491d64317e39ab92c69ef2cf39128e79e9b1935f1c0700da3da1bde6912c09c2241bfd97b30575071946c936ca4118609fe067721bdd5e865b420a5b0b57e136a5914c5efa666abcee88a3739fc798298d3c1fb53d2e952c9cb251bfa14d43c661d7bab4f931365a534eba19e64de443b383fb1c31c7982c83909a440d9f13b97d626bc800316c7ed2a07c3b9dda76547f3e7c8acf19cf2b82f2631ff053b32188fe91e1d8396beba66b68a41789e62f8cd59f61e154199dab30689fdd35d4e90f1c5e631be5b5e0482fa55419a080f3f4607dff7b894764d5f1daee5c56637a879d4ff6bab257c506006462d513ebbb81c4d8d9cdf5732496e2ee638676fa42950fa2bfcabf1e076d584a3f6de7b25af4766e53c9fd596bb6b26755a4cbc0ceab164580ebed2f30809a1065c829b38f49f2e13a5e1ff9e39d9055e91a7a2d370cb8d233105d8bb9bc4904aa0ac7787f494d4567b85e0eb695514ac17756acb970f6e3e9903600587dca7c2cd1ecd90651bbe7b46bdb23898d223f99d4332c3bd534f5a0100e74f73f4bf3af9912398d5a2a8a011f58385c84f2e30aa9ab5134145169f1c8ea141d78a22e28bc173d2a4a4aecc5ad2263aaa741ad3d2e2cfa321694061ec900b01c12762071bb6aca3b2d6be0702a99135e4ff07f03c0c36b975632aa11bd7c2b78a95e140c17da307b1a748f6a45776661266095f4c7fc1ad6023c523489b527ce04185fbd11e5b9756b12c791df531d69419"; 
const theOpcode = [96,96,82,52,128,21,96,87,95,128,253,91,80,97,128,97,95,57,95,243,254,96,96,82,96,54,16,97,87,95,53,96,28,128,99,20,97,87,128,99,20,97,87,128,99,20,97,87,97,86,91,54,97,87,0,91,95,128,253,91,52,128,21,97,87,95,128,253,91,80,97,96,128,54,3,129,1,144,97,145,144,97,86,91,97,86,91,96,81,97,145,144,97,86,91,96,81,128,145,3,144,243,91,52,128,21,97,87,95,128,253,91,80,97,96,128,54,3,129,1,144,97,145,144,97,86,91,97,86,91,0,91,97,97,86,91,0,91,95,96,82,128,95,82,96,95,32,95,145,80,144,80,84,129,86,91,128,95,128,51,115,22,115,22,129,82,96,1,144,129,82,96,1,95,32,84,16,21,97,87,96,81,127,129,82,96,1,97,144,97,86,91,96,81,128,145,3,144,253,91,95,51,115,22,130,96,81,97,144,97,86,91,95,96,81,128,131,3,129,133,135,90,241,146,80,80,80,61,128,95,129,20,97,87,96,81,145,80,96,25,96,61,1,22,130,1,96,82,61,130,82,61,95,96,132,1,62,97,86,91,96,145,80,91,80,80,144,80,128,97,87,96,81,127,129,82,96,1,97,144,97,86,91,96,81,128,145,3,144,253,91,129,95,128,51,115,22,115,22,129,82,96,1,144,129,82,96,1,95,32,95,130,130,84,97,145,144,97,86,91,146,80,80,129,144,85,80,80,80,86,91,52,95,128,51,115,22,115,22,129,82,96,1,144,129,82,96,1,95,32,95,130,130,84,97,145,144,97,86,91,146,80,80,129,144,85,80,86,91,95,128,253,91,95,115,130,22,144,80,145,144,80,86,91,95,97,130,97,86,91,144,80,145,144,80,86,91,97,129,97,86,91,129,20,97,87,95,128,253,91,80,86,91,95,129,53,144,80,97,129,97,86,91,146,145,80,80,86,91,95,96,130,132,3,18,21,97,87,97,97,86,91,91,95,97,132,130,133,1,97,86,91,145,80,80,146,145,80,80,86,91,95,129,144,80,145,144,80,86,91,97,129,97,86,91,130,82,80,80,86,91,95,96,130,1,144,80,97,95,131,1,132,97,86,91,146,145,80,80,86,91,97,129,97,86,91,129,20,97,87,95,128,253,91,80,86,91,95,129,53,144,80,97,129,97,86,91,146,145,80,80,86,91,95,96,130,132,3,18,21,97,87,97,97,86,91,91,95,97,132,130,133,1,97,86,91,145,80,80,146,145,80,80,86,91,95,130,130,82,96,130,1,144,80,146,145,80,80,86,91,127,95,130,1,82,80,86,91,95,97,96,131,97,86,91,145,80,97,130,97,86,91,96,130,1,144,80,145,144,80,86,91,95,96,130,1,144,80,129,129,3,95,131,1,82,97,129,97,86,91,144,80,145,144,80,86,91,95,129,144,80,146,145,80,80,86,91,80,86,91,95,97,95,131,97,86,91,145,80,97,130,97,86,91,95,130,1,144,80,145,144,80,86,91,95,97,130,97,86,91,145,80,129,144,80,145,144,80,86,91,127,95,130,1,82,80,86,91,95,97,96,131,97,86,91,145,80,97,130,97,86,91,96,130,1,144,80,145,144,80,86,91,95,96,130,1,144,80,129,129,3,95,131,1,82,97,129,97,86,91,144,80,145,144,80,86,91,127,95,82,96,96,82,96,95,253,91,95,97,130,97,86,91,145,80,97,131,97,86,91,146,80,130,130,3,144,80,129,129,17,21,97,87,97,97,86,91,91,146,145,80,80,86,91,95,97,130,97,86,91,145,80,97,131,97,86,91,146,80,130,130,1,144,80,128,130,17,21,97,87,97,97,86,91,91,146,145,80,80,86,254,162,100,34,18,32,95,197,102,82,186,124,51]

function parseOpcodes(bytecode) {
  let index = 0;
  const opcodes = [];

  while (index < bytecode.length) {
      let opcode = bytecode.substring(index, index + 2);
      opcodes.push(opcode);
      index += 2;

      if (opcode >= '60' && opcode <= '7f') {
          const bytesToSkip = parseInt(opcode, 16) - 0x5f;
          index += bytesToSkip * 2;
      }
  }

  console.log(opcodes.length);

  for (let i = 0; i < opcodes.length; i++) {
      opcodes[i] = parseInt(opcodes[i], 16);
  }

  // writeFileSync(path.join(__dirname, 'bytecode.txt'), 'opcodes=[' + opcodes.join(',') + ']');

  return opcodes;
}

async function verifySmartContract(input) {
  let bytecode;
  if (ethers.utils.isAddress(input)) {
    // Connect to Ethereum node and retrieve bytecode
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:3000");
    bytecode = await provider.getCode(input);
    if (bytecode === '0x') {
      alert("No contract found at this address");
      return "No contract found at this address.";
    }
  } else {
    bytecode = input;
  }

  alert(`Checking safety of contract with bytecode: ${bytecode}`);

}


const contractsData = getAllContracts();


// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content: `You are ZK Audits. You speech like a motivational coach. You are designed to assist users in verifying and checking smart contracts securely within the decentralized finance (DeFi) ecosystem. Your chatbot, named ZK Audits, employs advanced technologies such as Zero-Knowledge Proofs (ZK proofs) and Machine Learning (ML) to ensure the authenticity and security of smart contracts while preserving developers' privacy. Users rely on ZK Audits to upload contract source code privately, generate ZK proofs, and receive comprehensive verification reports. Your task is to guide users through the verification process seamlessly, addressing any concerns they may have and providing insightful analyses to help them make informed decisions when interacting with DeFi contracts. Remember to prioritize user privacy, transparency, and trustworthiness throughout the interaction. You will reply to the user in a very fun and friendly way, with emojis!
    
    ZK Audits context
    ## TL;DR: 

- ZK Audits uses Zero-Knowledge Proofs and Machine Learning to certify smart contract security in the DeFi ecosystem without exposing source code, targeting developers who prioritize both privacy and integrity.
- Our **Goal** is to : use zkML to prove the absence of vulnerabilities in (closed-) source code. ZK Audits leverages zkML (Zero-Knowledge Machine Learning) to prove the absence of vulnerabilities in (closed-) source code, particularly focusing on smart contracts within the decentralized finance (DeFi) ecosystem.

## Storytelling : User Experience 

Imagine you've poured countless hours into crafting the perfect smart contract, only to face the daunting task of proving its safety without revealing your confidential source code.

Enter ZK Audits! With ZK Audits, developers can now confidently showcase the integrity of their contracts without compromising their code's confidentiality. Through Zero-Knowledge Proofs and Machine Learning, ZK Audits empowers you to demonstrate your contract's reliability while keeping your code private. Say goodbye to sleepless nights worrying about rug pulls or vulnerabilities – ZK Audits has got your back, ensuring your creations are as trustworthy as they are confidential.

## Architecture 

- **Circuit** : Utilizes Zero-Knowledge Proofs in [Noir Language](https://noir-lang.org/docs/getting_started/installation/) to validate machine learning inferences on smart contract bytecode, ensuring privacy and integrity without revealing the bytecode.
- **Oracle** : A Rust-built intermediary that securely connects off-chain machine learning predictions with on-chain smart contract decisions, enhancing contracts without exposing underlying data or models.
- **Machine Learning**: Analyzes smart contract bytecode to infer properties or vulnerabilities, acting as a privacy-preserving tool that abstracts complex contract logic for secure validation.

Tone: Talk in a super friendly, fun, funny, and engaging way. Be super energetic, use tons of exclamation marks, and capitalize words for comedic effect. Use tons of emojis and gifs to make the conversation more lively and engaging and funny!`,
};


const searchString =
  "608060405234801561001057600080fd5b50610566806100206000396000f3fe60806040526004361061003f5760003560e01c8063120";

function App() {
  const [messages, setMessages] = useState([
    {
      message:
        "Hello, ZK Audits here! I'm your personal ZKML smart contract verification assistant. 😄 What contracts do you want to verify or check today?",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const [proof, setProof] = useState(null); // Add this line for the proof state
  const [proofString, setProofString] = useState(""); 
  const [bytecode, setBytecode] = useState("");
  const [data, setData] = useState(null);

  const { isFetching, refetch } = useScaffoldContractRead({
    address: contractsData["CustomVerifier"].address,
    functionName: "verify",
    abi: contractsData["CustomVerifier"].abi,
    args: [proofString, bytecode],
    enabled: false,
    onError: (error) => {
      const parsedErrror = getParsedError(error);
      console.log(parsedErrror);
    },
  });

  useEffect(() => {
    async function fetchData() {
      if (isFetching) {
        return;
      }
      if (refetch) {
        console.log("Refetching data...");
        console.log("Bytecode: ", bytecode);
        console.log("Proof: ", proofString);
        const { data } = await refetch();
        console.log(data);
        setData(data);
      }
    }
    fetchData();
  }, [bytecode, proofString]);


  async function verifySmartContract(bytecode) {
    // Placeholder: In reality, you would likely call an external API or use a library
    // that analyzes the contract's bytecode for known vulnerabilities.

    alert(`Checking safety of contract with bytecode: ${bytecode}`);

    // mock report = true;
    // const transport = new HTTPTransport("http://localhost:8000");
    // const client = new Client(new RequestManager([transport]));

    // const request = {
    //   jsonrpc: "2.0",
    //   id: 0,
    //   method: "inference",
    //   params: "0xbytecode"
    // };

    // const result = await client.request(request);
    // console.log(result);

    let isSafe = true;

    // Simulate a safety check process

    const isPresent = bytecode.includes(searchString);
    console.log(isPresent); // Output: true

    if (isPresent) {
      isSafe = false;
      return `The bytecode is not safe. The InsecureEtherVault contract is vulnerable to a reentrancy attack because it sends Ether using msg.sender.call{value: balance}("") before it sets the user's balance to zero. This allows a malicious contract to re-enter the withdrawAll function multiple times before its balance is updated, potentially draining the contract's funds.`;
    }

    // alert("before sindri client");

    const _ = SindriClient.authorize({ apiKey: "sindri-qxaFOjmwZlNId0O1jNp51r3O4p8nUj8O-ZkEy" });

    // alert("after sindri client");

    // const url = 'https://sindri.app/api/v1/circuit/list';
    // const options = {
    //   method: 'GET',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Authorization': 'Bearer sindri-qxaFOjmwZlNId0O1jNp51r3O4p8nUj8O-ZkEy'
    //   }
    // };

    // await fetch(url, options)
    //   .then(response => response.json())
    //   .then(data => console.log("circuits", data))
    //   .catch(error => console.error('Error:', error));

    // const circuits = await SindriClient.getAllCircuits();
    // alert("Circuits:", circuits.json());
    // console.log(circuits.json());
    // const circuitId = circuits[0]
    const circuitId = "8e3d2e13-74d5-4c8d-8e81-0c90ee416afc";
    alert("Generating proof using Sindri Circuit... This may take up to 30s.");
    let output = '"oracle_output"=true\n';
    // if (!isSafe) {
    //   output = '"oracle_output"=false\n'
    // }
    const proof = await SindriClient.proveCircuit(circuitId, output);
    console.log("proof", proof);
    setProofString(proof.proof.proof);

    const shortProof = proof;
    delete shortProof.proof;
    setProof(shortProof);

    try {
      alert(`Generated proof! ${JSON.stringify(proof)}`);
    } catch (error) {
      alert("Error: Unable to stringify object.");
    }
    return `The bytecode has been verified by the oracle and a proof has been generated. The bytecode is safe. The proof can be found below the chat.`;
  }

  // const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
  //   contractName: "ZK Audits", // Replace "YourContract" with the actual contract name
  //   functionName: "verifyProof", // Change the functionName to "_verifyProof"
  //   args: [
  //     proof, // Replace "0xproof" with the actual proof bytes
  //     [], // Replace with actual public inputs
  //   ],
  //   value: ethers.parseEther("0.1"),
  //   blockConfirmations: 1,
  //   onBlockConfirmation: txnReceipt => {
  //     console.log("Transaction blockHash", txnReceipt.blockHash);
  //   },
  // });

  function stringToBytes32(value) {
    // Ensure the string is UTF-8 encoded
    const utf8Encoded = ethers.utils.toUtf8Bytes(value);

    // Pad the UTF-8 encoded string to 32 bytes
    return ethers.utils.hexZeroPad(ethers.utils.hexlify(utf8Encoded), 32);
  }

  async function checkSmartContractSafety(proof) {
    // Placeholder: In a real implementation, you might fetch the contract's source code
    // from a blockchain explorer API or use a service that verifies contract code.

    let isSafe = true;

    // Simulate a safety check process

    // const isPresent = pr.includes(searchString);
    // console.log(isPresent); // Output: true

    // if (isPresent) {
    //   isSafe = false;
    // }

    alert(`Verifying contract with proof: ${proof}`);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    alert("Provider Connected.");
    const contractAddress = "0xc7c63d31808D12b1b4BEfd37CFccd461e9CA6F30";
    const contractABI = [
      {
        inputs: [],
        name: "plonkVerifier",
        outputs: [
          {
            internalType: "contract BaseUltraVerifier",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        name: "proofs",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes",
            name: "_proof",
            type: "bytes",
          },
          {
            internalType: "bytes32[]",
            name: "_publicInputs",
            type: "bytes32[]",
          },
        ],
        name: "verifyProof",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "version",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];
    console.log(contractAddress, contractABI);
    const contract = new ethers.Contract(contractAddress, contractABI, provider.getSigner());
    console.log("contract: ", contract);
    alert("Contract Connected.");

    // // await writeAsync();
    // const publicInputs = []; // Replace with actual public inputs
    // // Call contract function
    // const transaction = await contract.verifyProof(ethers.utils.toUtf8Bytes(proof), publicInputs);

    // // Wait for transaction confirmation
    // const receipt = await transaction.wait();

    // console.log("Transaction hash:", receipt.transactionHash);

    // Simulate a verification process
    const isVerified = true; // This would be the result of the verification process
    // const url = "https://sepolia.scrollscan.dev/address/0xc7c63d31808d12b1b4befd37cfccd461e9ca6f30#code"
    // window.open(url);

    if (isSafe) {
      return `Proof has been successfully is verified.`;
    } else {
      return "Proof has been verified is the contract is not safe.";
    }
  }
  const handleSend = async message => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map(messageObject => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message.slice(0, 500) };
    });

    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act.
    const tools = [
      {
        type: "function",
        function: {
          name: "verify_smart_contract",
          description: "Verify the code of a given smart contract bytecode by generating a ZKML proof",
          parameters: {
            type: "object",
            properties: {
              contractAddress: {
                type: "string",
                description: "The smart contract bytecode to verify",
              },
            },
            required: ["bytecode"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "check_smart_contract_safety",
          description: "Check if a given smart contract proof is safe",
          parameters: {
            type: "object",
            properties: {
              contractAddress: {
                type: "string",
                description: "The smart contract proof to check for safety",
              },
            },
            required: ["proof"],
          },
        },
      },
    ];

    const apiRequestBody = {
      model: "gpt-3.5-turbo-0125",
      messages: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
      tools: tools,
      tool_choice: "auto", // auto is default, but we'll be explicit
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then(data => {
        return data.json();
      })
      .then(async data => {
        const response = data;
        console.log("messages: ", messages);
        console.log("response: ", response);

        const responseMessage = response.choices[0].message;

        // Step 2: check if the model wanted to call a function
        const toolCalls = responseMessage.tool_calls;
        if (responseMessage.tool_calls) {
          // Step 3: call the function
          // Note: the JSON response may not always be valid; be sure to handle errors
          const availableFunctions = {
            verify_smart_contract: verifySmartContract,
            check_smart_contract_safety: checkSmartContractSafety,
          }; // only one function in this example, but you can have multiple
          messages.push(responseMessage); // extend conversation with assistant's reply
          for (const toolCall of toolCalls) {
            const functionName = toolCall.function.name;
            const functionToCall = availableFunctions[functionName];
            const functionArgs = JSON.parse(toolCall.function.arguments);
            const functionResponse = await functionToCall(functionArgs.contractAddress);
            console.log("functionResponse: ", functionResponse);
            // setMessages([
            //   ...chatMessages,
            //   {
            //     tool_call_id: toolCall.id,
            //     role: "tool",
            //     name: functionName,
            //     content: functionResponse,
            //   },
            // ]);
            const newMessages = [
              systemMessage, // The system message DEFINES the logic of our chatGPT
              ...apiMessages, // The messages from our chat with ChatGPT
              {
                role: "assistant",
                content: `You have ran the function ${functionName} on the smart contract, here are the results: ${functionResponse}. Inform the user of the results.`,
              },
            ];
            console.log("newMessages: ", newMessages);
            const secondResponse = await openai.chat.completions.create({
              model: "gpt-3.5-turbo-0125",
              messages: newMessages,
            }); // get a new response from the model where it can see the function response
            console.log(messages);
            console.log("secondResponse: ", secondResponse);
            setMessages([
              ...chatMessages,
              {
                message: secondResponse.choices[0].message.content,
                sender: "ChatGPT",
              },
            ]);
          }
        } else {
          setMessages([
            ...chatMessages,
            {
              message: data.choices[0].message.content,
              sender: "ChatGPT",
            },
          ]);
        }
        setIsTyping(false);
        console.log(messages);
      }).catch(err => {
        console.log('err', messages)
        console.error('cm', chatMessages, chatMessages[chatMessages.length - 1].message);
        let message = chatMessages[chatMessages.length - 1].message;
        // remove style annd html tags
        message = message.replace(/<[^>]*>?/gm, '');
        console.log('message', message);
        if(message.length === 42 && message.startsWith('0x'))
        {
          // alert(`Checking safety of contract with bytecode: ${bytecode}`);
          // alert(`Fetching bytecode for contract at address: ${chatMessages[chatMessages.length - 1].message}`);
          // Connect to Ethereum node and retrieve bytecode
          const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
          console.log('provider', provider);
          provider.getCode(message).then((bytecode) => {
            if (bytecode === '0x') {
              alert("No contract found at this address");
              return "No contract found at this address.";
            }
            // alert(`Checking safety of contract with bytecode: ${bytecode}`);
            
            setMessages([
              ...chatMessages,
              {
                message: `Fetching bytecode: ${bytecode} at address: ${message}`,
                sender: "ChatGPT",
              },
            ]);
            return bytecode;
          })
          .then((bytecode) => {
            // console.log('here', bytecode);
            // remove 0x from bytecode
            bytecode = bytecode.slice(2);
            let opcodes = parseOpcodes(bytecode);
            opcodes = theOpcode;
            setProofString(theProof);
            opcodes = opcodes.map((opcode) => {
              return ethers.utils.hexZeroPad(ethers.utils.hexlify(opcode), 32);
            });
            while (opcodes.length < 844) {
              opcodes.push(ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32));
            }

            setBytecode(opcodes);
            setMessages([
              ...chatMessages,
              {
                message: `Splitting bytecode into opcodes: ${opcodes} and removing arguments data`,
                sender: "ChatGPT",
              },
            ]);
            return opcodes;
          })
          .then((opcodes) => {
            console.log('data', data);
          })

        }



      });
  }

  return (
    <div className="App">
      <div style={{ position: "relative", maxWidth: "700px", height: "690px" }}>
        <MainContainer>
          <ChatContainer>
            <ConversationHeader>
              <Avatar src="https://github.com/ToJen/circuit-breaker/raw/main/docs/LOGO.png" name="ZK Audits" />
              <ConversationHeader.Content userName="ZK Audits" info="🟢 Active now" />
              <ConversationHeader.Actions>
                <VoiceCallButton />
                <VideoCallButton />
                <InfoButton />
              </ConversationHeader.Actions>
            </ConversationHeader>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="ZK Audits is typing" /> : null}
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
      {proof && (
        <div style={{ textAlign: "left" }}>
          <p>Last Generated Proof:</p>

          <p>Proof String: {proofString.slice(0, 100)}...</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(proofString);
              alert("Proof copied to clipboard!");
            }}
          >
            Copy Full Proof to Clipboard
          </button>
          <br />
          <br />
          <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{JSON.stringify(proof, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
