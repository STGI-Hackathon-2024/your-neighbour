import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Capture from "./pages/Capture.jsx";
import Home from "./pages/Home.jsx";
import { PhotoContext, DocumentContext } from "./utils/contexts.js";
import DocumentCapture from "./pages/DocumentCapture.jsx";
import MatchPhotoID from "./pages/match.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/capture",
		element: <Capture />,
	},
	{
		path: "/document",
		element: <DocumentCapture />,
	},
  {
    path: "/match",
    element: <MatchPhotoID />
  }
]);

function App() {
	const [photo, setPhoto] = useState(null);
	const [document, setDocument] = useState(null);

	return (
		<PhotoContext.Provider value={[photo, setPhoto]}>
			<DocumentContext.Provider value={[document, setDocument]}>
				<RouterProvider router={router} />
			</DocumentContext.Provider>
		</PhotoContext.Provider>
	);
}

export default App;
