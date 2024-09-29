import { Link } from "react-router-dom";
import Header from "../component/Header.jsx";

export default function Home() {
	return (
		<>
			<Header />
			<main>
				<h1>User KYC Verification Platform</h1>
				<p style={{textAlign: "justify"}}>
					We have designed a comprehensive KYC (Know Your Customer) verification platform that ensures user authenticity through advanced image verification.
					The platform captures a live image of the user, verifies it against a provided ID document, and checks a second image against a database
					for potential matches.
				</p>
				<Link to={"/capture"}>Go to photo capture</Link>
                <Link to={"/search"}>Go to image search</Link>
			</main>
		</>
	);
}
