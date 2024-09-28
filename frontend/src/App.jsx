import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WebcamFeed from './webcam.jsx'


function App() {
  const [currentStep, setCurrentStep] = useState(0)

  function updateStep(newStep) { 
    setCurrentStep(newStep);
  }

  return (
    <>
      {currentStep >= 0 && <WebcamFeed updateStep={updateStep} />}

    </>
  )
}

export default App
