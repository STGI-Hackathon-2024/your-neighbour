import React, { useContext, useState } from "react";
import { DocumentContext, PhotoContext } from "../utils/contexts.js";
import { Link } from "react-router-dom";

const MatchPhotoID = () => {
	const [photo, setPhoto] = useContext(PhotoContext);
	const [document, setDocument] = useContext(DocumentContext);
	const photoUrl = URL.createObjectURL(photo);
	const documentUrl = URL.createObjectURL(document);
	const [validity, setValidity] = useState(false);
	const [loading, setLoading] = useState(false);

	// Function to send the image via fetch
	const handleSubmit = async (event) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append("photo", photo, "photo.jpg"); // Append the file to FormData
		formData.append("document", document, "document.jpg");

		setLoading(true);

		try {
			const response = await fetch("http://swift.local:8000/matchdocument/", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				const result = await response.json();
				console.log("Image uploaded successfully:", result);
				if (result) {
					setValidity(true);
				} else {
					setValidity(false);
				}
			} else {
				console.error("Upload failed:", response.statusText);
				setValidity(false);
			}
			setLoading(false);
		} catch (error) {
			console.error("Error uploading the image:", error);
			alert("An error occurred while uploading the image.");
			setLoading(false);
			setValidity(false);
		}
	};

	return (
		<div>
			<h1>Match Photo & ID</h1>

			<form onSubmit={handleSubmit}>
				<div style={{ marginTop: "20px" }}>
					<p>Photo Preview:</p>
					<img src={photoUrl} alt="Preview" width="300" />
				</div>
				<div style={{ marginTop: "20px" }}>
					<p>Photo Preview:</p>
					<img src={documentUrl} alt="Preview" width="300" />
				</div>

				<div style={{ marginTop: "20px" }}>
					{loading ? (
						<button>loading</button>
					) : validity ? (
						<Link to={"/match"}>Verify ID and Photo</Link>
					) : (
						<button type="submit">Check Image</button>
					)}
				</div>
			</form>
		</div>
	);
};

export default MatchPhotoID;
