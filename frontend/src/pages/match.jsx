import React, { useContext, useState } from "react";
import { DocumentContext, PhotoContext } from "../utils/contexts.js";
import { Link, Navigate } from "react-router-dom";
import Header from "../component/Header.jsx";

const MatchPhotoID = () => {
	const [photo, setPhoto] = useContext(PhotoContext);
	const [document, setDocument] = useContext(DocumentContext);
	const [validity, setValidity] = useState(false);
	const [loading, setLoading] = useState(false);
	const [tested, setTested] = useState(false);

	if (photo == null || document == null) {
		return <Navigate to="/capture" replace={true} />;
	}

	const photoUrl = URL.createObjectURL(photo);
	const documentUrl = URL.createObjectURL(document);

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
				setTested(true);
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
		<>
			<Header />
			<main>
				<h1>Match Photo & ID</h1>

				<form onSubmit={handleSubmit} style={{ width: "100%" }}>
					<div style={{ display: "flex", width: "100%", justifyContent: "space-evenly" }}>
						<div style={{ marginTop: "20px" }}>
							<p>Photo Preview:</p>
							<img className="user-image" src={photoUrl} alt="Preview" width="300" />
						</div>
						<div style={{ marginTop: "20px" }}>
							<p>ID Card Preview:</p>
							<img className="user-image" src={documentUrl} alt="Preview" width="300" />
						</div>
					</div>

					<div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
						{loading ? (
							<div className="loader"></div>
						) : validity ? (
							<div>
								<h3>Photo and ID Card Matched Successfully!</h3>
							</div>
						) : tested ? (
							<div>
								<h3>Photo did not match!</h3>
							</div>
						) : (
							<button type="submit">Check Image</button>
						)}
					</div>
				</form>
			</main>
		</>
	);
};

export default MatchPhotoID;
