import { useState, useEffect } from "react";
import "./HomeAuth.css";
import BlogCard from "../components/BlogCard";
import axios from "axios";
import { useMoralisWeb3Api } from "react-moralis";

const HomeAuth = () => {
    const [blogs, setBlogs] = useState(null);
    const [blogsContent, setBlogsContent] = useState();
    const Web3API = useMoralisWeb3Api();

    const fetchAllNFTs = async () => {
        const options = {
            chain: "mumbai",
            address: "0xB14D9ca3A325F44375C259ACeD1dA74A4c1c5861",
        };

        const polygonNFTs = await Web3API.token.getNFTOwners(options);
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
            const promises = limit5.map(async (blog) => {
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
            await Promise.all(promises);
        }

        setBlogsContent(contentBlog);
    };

    useEffect(() => {
        if (blogs && !blogsContent) {
            fetchBlogsContent();
        }
    }, [blogs, blogsContent]);

    useEffect(() => {
        if (!blogs) {
            fetchAllNFTs();
        }
    }, [blogs]);

    return (
        <div className="homeAuth_container">
            <div className="homeAuth_header">Recommended Blogs</div>
            <div className="homeAuth_blogs">
                {blogsContent &&
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
                    })}
            </div>
        </div>
    );
};

export default HomeAuth;
