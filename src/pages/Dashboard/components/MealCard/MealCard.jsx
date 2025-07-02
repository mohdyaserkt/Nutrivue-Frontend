import "../../dashboard.css";
import "../../animation.css";

function MealCard({ mealType, totalCalories, foodItems }) {
  const mealTypeIconsTime = {
    breakfast: { icon: "fas fa-coffee", time: "Breakfast" },
    lunch: { icon: "fas fa-utensils", time: "Lunch" },
    dinner: { icon: "fas fa-pizza-slice", time: "Dinner" },
    snack: { icon: "fas fa-apple-alt", time: "Snack" },
  };
  return (
    <div className="meal-card">
      <div className={`meal-icon ${mealType}`}>
        <i className={mealTypeIconsTime[mealType].icon}></i>
      </div>
      <div className="meal-info">
        <div className="meal-time">{mealTypeIconsTime[mealType].time}</div>
        <div className="meal-calories">{totalCalories+" "+"kcal"}</div>
        <div className="meal-items" >{foodItems}</div>
      </div>
    </div>
  );
}

export default MealCard;
