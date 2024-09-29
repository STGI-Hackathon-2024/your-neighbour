import { Link } from "react-router-dom";

export default function Header() {
	return (
		<header>
			<Link to={"/"}>
				<h3>User KYC Verification Platform</h3>
			</Link>
		</header>
	);
}
