import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import '../../dashboard.css'
import '../../animation.css'
import { axiosInstance } from '../../../../utils/axiosInstance'


function DailyLog({logNotifier, OpenDailyLogModal,setSelectedDate}) {
  const userDetails = useSelector((state) => state?.user?.user)
  const targetCalorie = userDetails?.target_calories || 0.0
  const [currentDate, setCurrentDate] = useState(new Date())
  const [filteredLogs, setFilteredLogs] = useState({})

  const selectedMonth = currentDate.getMonth() + 1
  const selectedYear = currentDate.getFullYear()

  useEffect(() => {
    fetchFilteredLogs()
  }, [selectedMonth, selectedYear,logNotifier])

  const fetchFilteredLogs = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/food/log/monthly/${selectedYear}/${selectedMonth}`
      )
      setFilteredLogs(data?.daily_summaries || {})
      console.log('Fetched all logs:', data)
    } catch (error) {
      console.error('Error fetching filtered logs:', error)
    }
  }

  const getCaloriesForDay = (day) => {
    const paddedMonth = selectedMonth.toString().padStart(2, '0')
    const paddedDay = day.toString().padStart(2, '0')
    const key = `${selectedYear}-${paddedMonth}-${paddedDay}`
    return filteredLogs[key]?.total_calories || 0
  }

  const generateCalendar = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate()
    const firstDay = new Date(selectedYear, selectedMonth - 1, 1).getDay()

    const days = []

    // Empty slots
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="day empty"></div>)
    }

    // Real day entries
    for (let i = 1; i <= daysInMonth; i++) {
      const calories = getCaloriesForDay(i)
      const percentage = targetCalorie > 0 ? Math.min(100, Math.floor((calories / targetCalorie) * 100)) : 0

      const isActive = i === new Date().getDate() &&
        selectedMonth === new Date().getMonth() + 1 &&
        selectedYear === new Date().getFullYear()

      days.push(
        <div
          key={`day-${i}`}
          className={`day ${isActive ? 'active' : ''}`}
          onClick={() =>{
            setSelectedDate(`${selectedYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`)
            OpenDailyLogModal()
            }
          }
        >
          <span>{i}</span>
          <span className="day-calories">{calories} kcal</span>
          <div className="day-progress" style={{ width: `${percentage}%` }}></div>
        </div>
      )
    }

    return days
  }

  const handleMonthChange = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1))
    setCurrentDate(newDate)
  }

  const closeModal=()=>{
 setVisible(false)
  }
  return (
    <section className="daily-log glass-card slide-up">
      <div className="section-header">
        <h3>Daily Log</h3>
        <div className="log-nav">
          <button className="nav-arrow" onClick={() => handleMonthChange('prev')}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="current-month">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button className="nav-arrow" onClick={() => handleMonthChange('next')}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div className="calendar">
        <div className="weekdays">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        <div className="days">
          {generateCalendar()}
        </div>
      </div>
      
    </section>
  )
}

export default DailyLog
