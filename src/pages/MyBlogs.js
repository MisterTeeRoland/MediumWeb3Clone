import { useEffect, useState } from "react";
import "./MyBlogs.css";
import BlogCard from "../components/BlogCard";
import axios from "axios";
import { Button } from "web3uikit";
import { useNavigate } from "react-router-dom";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";

const MyBlogs = () => {
    const [blogs, setBlogs] = useState();
    const [blogsContent, setBlogsContent] = useState();
    const navigate = useNavigate();
    const Web3API = useMoralisWeb3Api();
    const { isInitialized, isAuthenticated, account } = useMoralis();

    const fetchAllNFTs = async () => {
        const options = {
            chain: "mumbai",
            address: account,
            token_address: "0xB14D9ca3A325F44375C259ACeD1dA74A4c1c5861",
        };

        const polygonNFTs = await Web3API.account.getNFTsForContract(options);
        const tokenUri = polygonNFTs?.result?.map((data) => {
            const { metadata, owner_of } = data;
            if (metadata) {
                const metadataObj = JSON.parse(metadata);
                const { externalUrl } = metadataObj;
                return { externalUrl, owner_of };
            } else {
                return undefined;
            }
        });

        setBlogs(tokenUri);
    };

    const fetchBlogsContent = async () => {
        const limit5 = blogs?.slice(0, 5);
        let contentBlog = [];
        if (limit5) {
            limit5.map(async (blog) => {
                if (blog) {
                    const { externalUrl, owner_of } = blog;
                    const response = await axios.get(externalUrl);
                    const text = response.data.text.toString();
                    const title = response.data.title;
                    contentBlog.push({
                        title,
                        text,
                        owner_of,
                        externalUrl,
                    });
                }
            });
        }

        setBlogsContent(contentBlog);
    };

    useEffect(() => {
        if (blogs && !blogsContent) {
            fetchBlogsContent();
        }
    }, [blogs, blogsContent]);

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            fetchAllNFTs();
        }
    }, [blogs]);

    const clickHandler = () => {
        navigate("/newStory");
    };

    return (
        <>
            <div>
                <div className="myBlogsHeader">My Blogs</div>
                {blogsContent && blogsContent.length > 0 ? (
                    blogsContent.map((blog, index) => {
                        const { title, text, owner_of, externalUrl } = blog;
                        return (
                            <BlogCard
                                key={index}
                                title={title}
                                text={text}
                                owner_of={owner_of}
                                externalUrl={externalUrl}
                            />
                        );
                    })
                ) : (
                    <div
                        style={{
                            fontSize: "30px",
                            width: "100%",
                            marginLeft: "40%",
                        }}
                    >
                        <p>No blogs yet.</p>
                        <Button text="Create one" onClick={clickHandler} />
                    </div>
                )}
            </div>
        </>
    );
};

export default MyBlogs;
