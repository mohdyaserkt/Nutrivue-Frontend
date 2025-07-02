import '../../dashboard.css'
import '../../animation.css'
function Header() {
  return (
    <header className="glass-nav">
      <div className="container">
        <nav>
          <div className="logo">
            <img src="/images/logo.png" alt="NutriVue AI" />
          </div>
          <div className="user-menu">
            <span className="user-name">John Doe</span>
            <div className="user-avatar">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header