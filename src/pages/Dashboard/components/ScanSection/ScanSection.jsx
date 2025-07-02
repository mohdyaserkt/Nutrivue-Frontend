import MealCard from "../MealCard/MealCard";
import "../../dashboard.css";
import "../../animation.css";

function ScanSection({ onOpenCamera, onFileUpload, items,uploadStatus }) {
  function summarizeMeals(foodLog) {
    const summary = {};

    foodLog.forEach((entry) => {
      const mealType = entry.meal_type;
      if (!summary[mealType]) {
        summary[mealType] = {
          totalCalories: 0,
          foodNames: new Set(),
        };
      }

      summary[mealType].totalCalories += entry.calories_consumed;
      summary[mealType].foodNames.add(entry.food_name);
    });

    // Format the result into an array
    return Object.entries(summary).map(([mealType, data]) => ({
      mealType,
      totalCalories: Math.round(data.totalCalories),
      foodItems: Array.from(data.foodNames).join(", "),
    }));
  }

  const mealSummaries = summarizeMeals(items);

  return (
    <section className="scan-section glass-card slide-up">
      <div className="section-header">
        <h3>Recent Meals</h3>
        <a href="#" className="view-all">
          View All
        </a>
      </div>

      <div className="meals-grid">
        {mealSummaries.map((meal, index) => (
          <MealCard key={index} {...meal} />
        ))}
      </div>

      <div className="scan-options">
        {/* Mobile - Camera Button */}
        <button onClick={onOpenCamera} className="scan-option mobile-only">
          <i className="fas fa-camera"></i>
          <span>{uploadStatus?"Image Analyzing...":"Scan Meal"}</span>
        </button>

        {/* Desktop - Upload Button */}
        <label htmlFor="file-input" className="scan-option desktop-only">
          <i className="fas fa-cloud-upload-alt"></i>
          <span>{uploadStatus?"Image Analyzing...":"Upload Image"}</span>
        </label>

        <input
          type="file"
          id="file-input"
          accept="image/*"
          style={{ display: "none" }}
          onChange={onFileUpload}
        />
      </div>
    </section>
  );
}

export default ScanSection;
