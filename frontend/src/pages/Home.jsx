import { Link } from "react-router-dom";

export default function Home() {
    return <div>
        <h1>Hello KYC!</h1>
        <Link to={"/capture"}>Go to photo capture</Link>
    </div>
}