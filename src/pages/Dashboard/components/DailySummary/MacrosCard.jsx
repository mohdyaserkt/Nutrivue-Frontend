import '../../dashboard.css'
import '../../animation.css'

function MacrosCard({ type, value, target, icon }) {
  const percentage = Math.min(100, Math.floor((value / target) * 100))
  
  return (
    <div className={`macro-card ${type}`}>
      <div className="macro-icon">
        <i className={icon}></i>
      </div>
      <div className="macro-details">
        <span className="macro-name">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
        <span className="macro-value">{value}<span className="unit">g</span></span>
        <div className="macro-progress">
          <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    </div>
  )
}

export default MacrosCard