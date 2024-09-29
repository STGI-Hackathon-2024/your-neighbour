import React, { useRef, useEffect, useState, useContext } from "react";
import { PhotoContext } from "../utils/contexts.js";
import { Link } from "react-router-dom";
import Header from "../component/Header.jsx";

const Capture = () => {
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const [stream, setStream] = useState(null);
	const [imageCaptured, setImageCaptured] = useState(false); // State to toggle between video and image
	const [photo, setPhoto] = useContext(PhotoContext);
	const [validity, setValidity] = useState(photo !== null);
	const [loading, setLoading] = useState(false);

	// Function to start the webcam stream
	const startWebcam = async () => {
		try {
			const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
			setStream(videoStream); // Save the stream in the state
			if (videoRef.current) {
				videoRef.current.srcObject = videoStream; // Assign the stream to the video element
			}
		} catch (error) {
			console.error("Error accessing the webcam: ", error);
		}
	};

	// Function to stop the webcam stream
	const stopWebcam = () => {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			setStream(null); // Clear the stream state
		}
	};

	// Function to capture an image from the video feed
	const captureImage = () => {
		console.log("yoyo");
		if (canvasRef.current && videoRef.current) {
			const context = canvasRef.current.getContext("2d");
			context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
			setImageCaptured(true); // Switch to show the captured image
			stopWebcam(); // Stop the webcam feed after capturing
			sendImage();
		}
	};

	const sendImage = () => {
		if (canvasRef.current) {
			console.log("yoyoyoyo");
			canvasRef.current.toBlob((blob) => {
				const formData = new FormData();
				formData.append("file", blob, "image.jpg"); // Append the Blob to FormData

				// Sending the image via fetch
				const context = canvasRef.current.getContext("2d");
				setLoading(true);
				fetch("http://swift.local:8000/spoofing", {
					method: "POST",
					body: formData,
				})
					.then((response) => response.json())
					.then((data) => {
						console.log("Image uploaded successfully:", data);
						context.lineWidth = 10;
						context.strokeStyle = data.validity ? "green" : "red";
						data.faces?.forEach((face) => {
							context.strokeRect(face.x, face.y, face.w, face.h);
						});
						if (data.validity) {
							setValidity(true);
							setPhoto(blob);
						} else {
							setValidity(false);
							setPhoto(null);
						}
						setLoading(false);
					})
					.catch((error) => {
						console.error("Error uploading the image:", error);
						setValidity(false);
						setPhoto(null);
						setLoading(false);
					});
			}, "image/jpg");
		}
	};

	// Function to resume the webcam stream
	const resumeWebcam = () => {
		setImageCaptured(false); // Reset the captured image state
		startWebcam(); // Restart the webcam stream
	};

	useEffect(() => {
		if (!imageCaptured) {
			startWebcam(); // Start the webcam on component mount if no image is captured
		}

		// Clean up the stream when the component unmounts
		return () => {
			stopWebcam();
		};
	}, [imageCaptured]); // Restart webcam only when imageCaptured state changes

	return (
		<>
			<Header />
			<main>
				<h1>Webcam Capture</h1>
				<video className="user-image" ref={videoRef} autoPlay width="640" height="480" style={{ display: imageCaptured ? "none" : "block" }} />
				<canvas className="user-image" ref={canvasRef} width="640" height="480" style={{ display: imageCaptured ? "block" : "none" }} />
				<div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
					{!loading ? (
						<>
							{!imageCaptured ? (
								// Show the "Capture Image" button when the video is active
								<button onClick={captureImage}>Capture Image</button>
							) : (
								// Show the "Resume Webcam" button after an image is captured
								<>{validity ? <Link to={"/document"}>Upload Document</Link> : <button onClick={resumeWebcam}>Retry</button>}</>
							)}
						</>
					) : (
						<div className="loader"></div>
					)}
				</div>
			</main>
		</>
	);
};

export default Capture;
