import { useEffect, useState } from "react";
import "./NewStory.css";
import {
    useMoralisFile,
    useMoralis,
    useWeb3ExecuteFunction,
} from "react-moralis";

const NewStory = () => {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    const { saveFile } = useMoralisFile();
    const { Moralis, account, enableWeb3 } = useMoralis();
    const contractProcessor = useWeb3ExecuteFunction();

    const mint = async (account, uri) => {
        let options = {
            contractAddress: "0xB14D9ca3A325F44375C259ACeD1dA74A4c1c5861",
            functionName: "safeMint",
            abi: [
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "to",
                            type: "address",
                        },
                        { internalType: "string", name: "uri", type: "string" },
                    ],
                    name: "safeMint",
                    outputs: [],
                    stateMutability: "payable",
                    type: "function",
                },
            ],
            params: {
                to: account,
                uri,
            },
            msgValue: Moralis.Units.ETH(1),
        };

        await contractProcessor.fetch({
            params: options,
            onSuccess: () => {
                alert("Successful Mint");
                setText("");
                setTitle("");
            },
            onError: (error) => {
                alert(error.message);
            },
        });
    };

    const uploadFile = async (event) => {
        event.preventDefault();
        const textArray = text.split();
        const metadata = {
            title,
            text: textArray,
        };

        try {
            const result = await saveFile(
                "myblog.json",
                { base64: btoa(JSON.stringify(metadata)) },
                {
                    type: "base64",
                    saveIPFS: true,
                }
            );
            const nftResult = await uploadNFTMetadata(result.ipfs());
            await mint(account, nftResult.ipfs());
        } catch (error) {
            alert(error.message);
        }
    };

    const uploadNFTMetadata = async (url) => {
        const metadataNFT = {
            image: "https://ipfs.io/ipfs/QmWEsG4ayh75BMk2H1CowAdALPjsi3fD7CSZ6qxNM1yNnz/image/moralis.png",
            description: title,
            externalUrl: url,
        };
        const resultNFT = await saveFile(
            "metadata.json",
            { base64: btoa(JSON.stringify(metadataNFT)) },
            {
                type: "base64",
                saveIPFS: true,
            }
        );
        return resultNFT;
    };

    useEffect(() => {
        const initWeb3 = async () => {
            const web3 = await Moralis.enableWeb3();
        };
        initWeb3();
    }, []);

    return (
        <>
            <div>
                <form onSubmit={uploadFile} className="writeForm">
                    <div className="writeFormGroup">
                        <input
                            className="writeInput"
                            placeholder="Title"
                            type="text"
                            autoFocus={true}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="writeFormGroup">
                        <textarea
                            className="writeInput writeText"
                            placeholder="Tell your story..."
                            type="text"
                            autoFocus={true}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                    <button className="writeSubmit" type="submit">
                        Publish
                    </button>
                </form>
            </div>
        </>
    );
};

export default NewStory;
