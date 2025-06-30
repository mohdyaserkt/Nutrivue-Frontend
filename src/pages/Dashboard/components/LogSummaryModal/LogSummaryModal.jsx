import "../../dashboard.css";
import "../../animation.css";
function LogSummaryModal({ onClose, foodItems }) {
  const summary = foodItems.reduce(
    (acc, item) => {
      acc.meal_type = item.meal_type; // they’re all the same, so just assign from any item
      acc.total_calories += item.calories_consumed;
      acc.total_fats += item.fats_g;
      acc.total_protein += item.protein_g;
      acc.total_carbs += item.carbs_g;
      return acc;
    },
    {
      meal_type: "",
      total_calories: 0,
      total_fats: 0,
      total_protein: 0,
      total_carbs: 0,
    }
  );

  console.log(summary);

  // Array of Font Awesome icon class names
 const foodIcons = [
  { icon: "fas fa-leaf", color: { color: "#94d82d" } },
  { icon: "fas fa-apple-alt", color: { color: "#ff6b6b" } },
  { icon: "fas fa-seedling", color: { color: "#51cf66" } },
  { icon: "fas fa-spa", color: { color: "#94d82d" } },
  { icon: "fas fa-carrot", color: { color: "#ffa94d" } },
  { icon: "fas fa-pepper-hot", color: { color: "#fa5252" } },
  { icon: "fas fa-drumstick-bite", color: { color: "#fab005" } },
  { icon: "fas fa-fish", color: { color: "#339af0" } },
  { icon: "fas fa-egg", color: { color: "#f5e677" } }
];


  // Function to get a random icon from the list
  const getRandomIcon = () => {
    const randomIndex = Math.floor(Math.random() * foodIcons.length);
    return foodIcons[randomIndex];
  };

  return (
    <div id="log-summary-modal" className="modal active">
      <div className="modal-content glass-card">
        <div className="modal-header">
          <div className="header-content">
            <div className="icon-wrapper">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>Meal Added Successfully</h3>
          </div>
          <button className="close-modal" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="meal-type-badge">
            <i className="fas fa-utensils"></i>
            <span>Dinner</span>
            <div className="summary-icon">
              <i className="fas fa-clock"></i>
              <span>Just now</span>
            </div>
          </div>

          <div className="food-items-list">
            <div className="section-title">
              <i className="fas fa-carrot"></i>
              <h4>Food Items</h4>
            </div>

            {foodItems.map((item, index) => {
              const {icon,color} = getRandomIcon();
              return (
                <div className="food-item" key={item.id || index}>
                  <div className="food-icon" style={color}>
                    <i className={icon}></i>
                  </div>
                  <div className="food-info">
                    <span className="food-name">{item.food_name}</span>
                    <span className="food-weight">
                      <i className="fas fa-weight"></i> {item.weight_grams}g
                    </span>
                  </div>
                  <div className="food-calories">
                    <i className="fas fa-fire"></i> {item.calories_consumed.toFixed(1)}{" "}
                    kcal
                  </div>
                </div>
              );
            })}

            
          </div>

          <div className="nutrition-summary-container">
            <div className="section-title">
              <i className="fas fa-chart-pie"></i>
              <h4>Nutrition Summary</h4>
            </div>

            <div className="nutrition-summary">
              <div className="macro-circles">
                <div className="macro-circle protein">
                  <div
                    className="circle-progress"
                    style={{ "--progress": 0.5 }}
                  >
                    <div className="circle-icon">
                      <i className="fas fa-dumbbell"></i>
                    </div>
                    <span>{summary.total_protein}g</span>
                  </div>
                  <label>Protein</label>
                </div>
                <div className="macro-circle carbs">
                  <div
                    className="circle-progress"
                    style={{ "--progress": 0.7 }}
                  >
                    <div className="circle-icon">
                      <i className="fas fa-bread-slice"></i>
                    </div>
                    <span>{summary.total_carbs}g</span>
                  </div>
                  <label>Carbs</label>
                </div>
                <div className="macro-circle fats">
                  <div
                    className="circle-progress"
                    style={{ "--progress": 0.4 }}
                  >
                    <div className="circle-icon">
                      <i className="fas fa-oil-can"></i>
                    </div>
                    <span>{summary.total_fats}g</span>
                  </div>
                  <label>Fats</label>
                </div>
              </div>

              <div className="total-calories">
                <div className="calories-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                <div className="calories-value">{summary.total_calories}</div>
                <div className="calories-label">Total Calories</div>
                <div className="calories-comparison">
                  <i className="fas fa-utensil-spoon"></i> About 1 small salad
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="secondary-button">
            <i className="fas fa-book-open"></i> View Full Log
          </button>
          <button className="cta-button pulse" onClick={onClose}>
            <i className="fas fa-check"></i> Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogSummaryModal;
