import { useEffect, useState } from "react";
import "./Blog.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Url } from "../config/constants";

const Blog = () => {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    const { url } = useParams();

    const fetchBlogContent = async () => {
        const response = await axios.get(`${Url}/${url}`);
        setTitle(response.data.title);
        const text = response.data.text.toString();
        setText(text);
    };

    useEffect(() => {
        if (!title || !text) {
            fetchBlogContent();
        }
    }, []);

    return (
        <div className="singleBlog">
            <div className="singleBlogWrapper">
                <div className="singleBlogContent">
                    <h1 className="singleBlogTitle">{title}</h1>
                    <p className="singleBlogText">{text}</p>
                </div>
            </div>
        </div>
    );
};

export default Blog;
