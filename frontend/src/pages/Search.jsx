import React, { useContext, useState } from "react";
import { DocumentContext, PhotoContext } from "../utils/contexts.js";
import { Link, Navigate } from "react-router-dom";
import Header from "../component/Header.jsx";

const Search = () => {
	const [file, setFile] = useState(null); // State to store the uploaded file
	const [previewUrl, setPreviewUrl] = useState(null); // State to store image preview URL
	const [validity, setValidity] = useState(false);
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState([]);
	const [ai, setAi] = useState(false);

	// Handle file input change
	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];
		if (selectedFile) {
			setValidity(false);
			setFile(selectedFile);
			setPreviewUrl(URL.createObjectURL(selectedFile)); // Create a preview URL for the selected image
		}
	};

	// Function to send the image via fetch
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!file) {
			alert("Please upload an image file.");
			return;
		}

		const formData = new FormData();
		formData.append("photo", file); // Append the file to FormData

		setLoading(true);

		try {
			const response = await fetch("http://swift.local:8000/search/", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				const result = await response.json();
				console.log("Image uploaded successfully:", result);
                setAi(result.ai)
                console.log(result)
                setResults(result.results.map(r => r[0].substring(1)))
				setValidity(true)
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
				<h1>Upload Image for Searching</h1>

				<form onSubmit={handleSubmit}>
					<div>
						<label>
							Select an image to upload:
							<br />
							<input type="file" accept="image/*" onChange={handleFileChange} />
						</label>
					</div>

					{/* Show image preview if a file is selected */}
					{previewUrl && (
						<div style={{ marginTop: "20px" }}>
							<p>Image Preview:</p>
							<img className="user-image" src={previewUrl} alt="Preview" width="300" />
						</div>
					)}

					<div style={{ marginTop: "20px", display: "flex", alignItems: "center", flexDirection: "column" }}>
						{loading ? (
							<div className="loader"></div>
						) : validity ? (
							<>
								{ai ? <h3>Image is potentially AI Generated!</h3> : <h3>Image is authentic!</h3>}

								<div style={{marginTop: "20px", display: "flex", flexDirection :"row", flexWrap: "wrap", justifyContent: "center", gap: 16}}>
									{results.map((image) => (
										<img className="user-image" src={"http://swift.local:8000" + image} alt="Preview" width="300" />
									))}
								</div>
							</>
						) : (
							<button type="submit">Check Image</button>
						)}
					</div>
				</form>
			</main>
		</>
	);
};

export default Search;
