import MacrosCard from "./MacrosCard";
import "../../dashboard.css";
import "../../animation.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../../utils/axiosInstance";

function DailySummary({calorieData}) {
  
  const userDetails = useSelector((state) => state?.user?.user);
  const targetCalorie = userDetails?.target_calories || 0.0;
  

  function calculateInversePercentage(targetCalories, consumedCalories) {
    if (targetCalories === 0) return 0; // Avoid division by zero
    let percentage =
      ((targetCalories - consumedCalories) / targetCalories) * 100;
    return Math.max(0, Math.min(percentage, 100)) * 4.82; // Clamp between 0 and 100
  }

  function estimateMacros(
    targetCalories,
    ratios = { protein: 0.2, carbs: 0.5, fat: 0.3 }
  ) {
    const { protein, carbs, fat } = ratios;

    return {
      protein: Math.round((targetCalories * protein) / 4), // grams
      carbs: Math.round((targetCalories * carbs) / 4), // grams
      fat: Math.round((targetCalories * fat) / 9), // grams
    };
  }
  const macroTargets = estimateMacros(targetCalorie);


  return (
    <section className="daily-summary glass-card slide-up">
      <div className="summary-header">
        <div className="header-content">
          <h2>
            <span className="icon-circle">
              <i className="fas fa-chart-line"></i>
            </span>
            Today's Nutrition
          </h2>
          <div className="date-badge">
            <i className="far fa-calendar"></i>
            <span>
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="summary-grid">
        {/* Calorie Ring */}
        <div className="calorie-ring">
          <div className="ring-container">
            <svg className="progress-ring" width="140" height="140">
              <circle
                className="progress-ring-bg"
                stroke="#F0F0F0"
                strokeWidth="10"
                fill="transparent"
                r="77"
                cx="70"
                cy="70"
              />
              <circle
                className="progress-ring-fill"
                stroke="url(#calorie-gradient)"
                strokeWidth="10"
                strokeDasharray="482"
                strokeDashoffset={calculateInversePercentage(
                  targetCalorie,
                  calorieData?.total_calories
                )}
                fill="transparent"
                r="77"
                cx="70"
                cy="70"
              />
            </svg>
            <svg width="0" height="0">
              <defs>
                <linearGradient
                  id="calorie-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FF9A8B" />
                  <stop offset="100%" stopColor="#FF6B95" />
                </linearGradient>
              </defs>
            </svg>
            <div className="ring-content">
              <div className="calories-display">
                <span className="consumed">
                  {calorieData?.total_calories || 0.0}
                </span>
                <span className="total">/ {targetCalorie || 0.0}</span>
              </div>
              <div className="calorie-label">
                <i className="fas fa-fire"></i>
                <span>CALORIES</span>
              </div>
            </div>
          </div>
        </div>

        {/* Macros Breakdown */}
        <div className="macros-grid">
          <MacrosCard
            type="protein"
            value={calorieData?.total_protein?.toFixed(2) || 0.000}
            target={macroTargets.protein}
            icon="fas fa-dumbbell"
          />
          <MacrosCard
            type="carbs"
            value={calorieData?.total_carbs?.toFixed(2) || 0.000}
            target={macroTargets.carbs}
            icon="fas fa-wheat-awn"
          />
          <MacrosCard
            type="fats"
            value={calorieData?.total_fats?.toFixed(2)|| 0.000}
            target={macroTargets.fat}
            icon="fas fa-oil-can"
          />
        </div>
      </div>
    </section>
  );
}

export default DailySummary;
