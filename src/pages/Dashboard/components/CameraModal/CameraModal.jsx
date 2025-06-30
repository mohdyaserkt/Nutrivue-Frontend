import { useEffect, useRef } from 'react'
import '../../dashboard.css'
import '../../animation.css'

function CameraModal({ onClose, onCapture }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      videoRef.current.srcObject = stream
    } catch (error) {
      console.error("Camera error: ", error)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const handleCapture = () => {
    stopCamera()
    onCapture()
  }

  return (
    <div className="modal active">
      <div className="modal-content glass-card">
        <div className="modal-header">
          <h3>Scan Your Meal</h3>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="camera-preview">
            <video id="camera-view" ref={videoRef} autoPlay playsInline></video>
            <button id="capture-btn" className="cta-button pulse" onClick={handleCapture}>
              <i className="fas fa-camera"></i> Capture
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CameraModal