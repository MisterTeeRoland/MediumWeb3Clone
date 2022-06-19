import "./Rightbar.css";
import { Input } from "web3uikit";

const Rightbar = () => {
    const trends = [
        {
            text: "Real Performance Paradox",
        },
        {
            text: "The Email Scam That Nearly Worked On Me",
        },
        {
            text: "The forgotten benefits of “low tech” user interfaces",
        },
        {
            text: "Become a Web3 Developer with just simple JS...",
        },
    ];

    return (
        <>
            <div className="rightbarContent">
                <Input label="Search" name="Search" prefixIcon="search" />
                <div className="trends">
                    What are we reading Today
                    {trends.map((trend, index) => (
                        <div key={index} className="trend">
                            <div className="trendText">{trend.text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Rightbar;
