import "../../dashboard.css";
import "../../animation.css";
import { useState, useEffect } from "react";

function FoodAnalysisModal({ foodData, onClose, onAddToLog }) {
  const total_calories = foodData?.items?.reduce(
    (accu, curr) => accu + curr.calories_per_gram,
    0
  );

  const [consumedGrams, setConsumedGrams] = useState({});
  const [activeMeal, setActiveMeal] = useState("breakfast");

  const mealOptions = [
    { type: "breakfast", icon: "fas fa-sun", label: "Breakfast" },
    { type: "lunch", icon: "fas fa-utensils", label: "Lunch" },
    { type: "dinner", icon: "fas fa-moon", label: "Dinner" },
    { type: "snack", icon: "fas fa-cookie", label: "Snack" },
  ];

  const handleSelect = (meal) => {
    setActiveMeal(meal);
  };

  // ✅ Initialize consumedGrams with default 100g values on first render
  useEffect(() => {
    if (foodData?.items) {
      const defaultGrams = {};
      foodData.items.forEach((item) => {
        defaultGrams[item.name] = 100;
      });
      setConsumedGrams(defaultGrams);
    }
  }, [foodData]);

  // ✅ Handle input change with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    const num = parseInt(value, 10);

    if (isNaN(num) || num < 1) {
      // Optional: You can show an error or prevent invalid input
      return;
    }

    setConsumedGrams((prev) => ({
      ...prev,
      [name]: num,
    }));
  };

  return (
    <div id="food-analysis-modal" className="modal active">
      <div className="modal-content glass-card">
        <div className="modal-header">
          <div className="header-content">
            <div className="icon-wrapper">
              <i className="fas fa-utensils"></i>
            </div>
            <h3>Meal Analysis</h3>
          </div>
          <button className="close-modal" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="meal-type-selector">
          {mealOptions.map((option) => (
            <div
              key={option.type}
              className={`meal-option ${
                activeMeal === option.type ? "active" : ""
              }`}
              data-meal={option.type}
              onClick={() => handleSelect(option.type)}
            >
              <i className={option.icon}></i>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
        <div
          className="modal-body"
          style={{ overflow: "scroll", maxHeight: "55vh" }}
        >
          {/* <div className="nutrition-summary">
            <div className="summary-card">
              <div className="summary-icon">
                <i className="fas fa-fire"></i>
              </div>
              <div className="summary-text">
                <span className="label">Total Estimated per 100g</span>
                <span className="value">{total_calories * 100} kcal</span>
              </div>
            </div>
          </div> */}

          <div className="detected-items">
            {foodData.items.map((item, index) => (
              <div key={index} className="food-item">
                <div className="food-details">
                  <div className="food-header">
                    <h3 className="food-name">{item.name}</h3>
                    <div className="food-meta">
                      <span className="calorie-badge">
                        <i className="fas fa-fire"></i>
                        {item.calories_per_gram} kcal/g
                      </span>
                    </div>
                  </div>

                  <div className="nutrient-pills">
                    <div className="pill protein">
                      <div className="pill-icon">
                        <i className="fas fa-dumbbell"></i>
                      </div>
                      <div className="pill-content">
                        <span className="pill-value">
                          {item.nutrients.protein_g}g
                        </span>
                        <span className="pill-label">Protein</span>
                      </div>
                    </div>

                    <div className="pill carbs">
                      <div className="pill-icon">
                        <i className="fas fa-wheat-awn"></i>
                      </div>
                      <div className="pill-content">
                        <span className="pill-value">
                          {item.nutrients.carbohydrates_g}g
                        </span>
                        <span className="pill-label">Carbs</span>
                      </div>
                    </div>

                    <div className="pill fats">
                      <div className="pill-icon">
                        <i className="fas fa-oil-can"></i>
                      </div>
                      <div className="pill-content">
                        <span className="pill-value">
                          {item.nutrients.fats_g}g
                        </span>
                        <span className="pill-label">Fats</span>
                      </div>
                    </div>
                  </div>

                  <div className="weight-control">
                    <label className="weight-label">Adjust Portion</label>
                    <div className="input-group">
                      <input
                        name={item.name}
                        onChange={handleChange}
                        type="number"
                        value={consumedGrams[item.name] || 100}
                        min="1"
                        className="weight-input"
                      />
                      <span className="unit">g</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="nutrition-tips">
            <div className="tips-header">
              <i className="fas fa-lightbulb"></i>
              <h4>Nutrition Tips</h4>
            </div>
            <p>{foodData.healthy_alternatives}</p>
          </div>
        </div>

        <div className="modal-footer">
          <button
            id="add-to-log"
            className="cta-button pulse"
            onClick={() => onAddToLog(consumedGrams, activeMeal)} // Pass state to parent
          >
            <i className="fas fa-plus-circle"></i> Add to Daily Log
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodAnalysisModal;
