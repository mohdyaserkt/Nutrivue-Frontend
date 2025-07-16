import React, { useEffect, useState } from "react";
// import './Modal.css'; // Optional: your styles if separated

import "../../dashboard.css";
import "../../animation.css";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../../utils/axiosInstance";
import { useSelector } from "react-redux";
const DailyLogModal = ({ isVisible, onClose, selectedDate }) => {
  const userDetails = useSelector((state) => state?.user?.user);
  const targetCalorie = userDetails?.target_calories || 0.0;
  const [data, setdata] = useState(null);
  function getCaloriePercentage(consumedCalories, targetCalories) {
    if (targetCalories === 0) return "0.0"; // Avoid division by zero
    return ((consumedCalories / targetCalories) * 100).toFixed(1);
  }

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/food/log/daily/${selectedDate}`
      );
      setdata(data);
      console.log(data);
    } catch (error) {
      toast.error(error.message ?? "Failed to fetch calorie data.");
    }
  };
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
    { icon: "fas fa-egg", color: { color: "#f5e677" } },
  ];

  // Function to get a random icon from the list
  const getRandomIcon = () => {
    const randomIndex = Math.floor(Math.random() * foodIcons.length);
    return foodIcons[randomIndex];
  };
  return (
    <>
      {/* Modal */}
      {isVisible && data && (
        <div className="modal" id="food-log-modal" style={{ display: "flex" }}>
          <div className="modal-content">
            <div className="modal-header">
              <div className="header-content">
                <div
                  className="icon-circle pulse"
                  style={{
                    background:
                      "linear-gradient(135deg, #FF9A8B 0%, #FF6B95 100%)",
                  }}
                >
                  <i className="fas fa-utensils"></i>
                </div>
                <div>
                  <h3>Daily Nutrition</h3>
                  <p className="modal-date">
                    <i className="far fa-calendar-alt"></i> June 10, 2025
                  </p>
                </div>
              </div>
              <button className="close-modal" onClick={onClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              {/* Summary Cards */}
              <div className="summary-cards">
                {/* Repeatable card */}
                {[
                  {
                    icon: "fa-fire",
                    value: data?.summary?.total_calories.toFixed(1),
                    label: "Calories",
                    progress: `${getCaloriePercentage(
                      data?.summary.total_calories,
                      targetCalorie
                    )}%`,
                    footer: `${getCaloriePercentage(
                      data?.summary.total_calories,
                      targetCalorie
                    )}% of goal`,
                    color: "#FF6B95",
                    colorDark: "#e84393",
                    rgb: "255, 107, 149",
                  },
                  {
                    icon: "fa-dumbbell",
                    value: `${data?.summary?.total_protein?.toFixed(1)}g`,
                    label: "Protein",
                    progress: `${getCaloriePercentage(
                      data?.summary.total_protein,
                      macroTargets?.protein
                    )}%`,
                    footer: `${getCaloriePercentage(
                      data?.summary.total_protein,
                      macroTargets?.protein
                    )}% of goal`,
                    color: "#667eea",
                    colorDark: "#5a67d8",
                    rgb: "102, 126, 234",
                  },
                  {
                    icon: "fa-bread-slice",
                    value: `${data?.summary?.total_carbs?.toFixed(1)}g`,
                    label: "Carbs",
                    progress: `${getCaloriePercentage(
                      data?.summary.total_carbs,
                      macroTargets?.carbs
                    )}%`,
                    footer: `${getCaloriePercentage(
                      data?.summary.total_carbs,
                      macroTargets?.carbs
                    )}% of goal`,
                    color: "#FFAA00",
                    colorDark: "#ff9500",
                    rgb: "255, 170, 0",
                  },
                  {
                    icon: "fa-oil-can",
                    value: `${data?.summary?.total_fats?.toFixed(1)}g`,
                    label: "Fats",
                    progress: `${getCaloriePercentage(
                      data?.summary.total_fats,
                      macroTargets?.fat
                    )}%`,
                    footer: `${getCaloriePercentage(
                      data?.summary.total_fats,
                      macroTargets?.fat
                    )}% of goal`,
                    color: "#f5576c",
                    colorDark: "#eb3b5a",
                    rgb: "245, 87, 108",
                  },
                ].map((card, index) => (
                  <div
                    key={index}
                    className="summary-card glow"
                    style={{
                      "--card-color": card.color,
                      "--card-color-dark": card.colorDark,
                      "--card-color-rgb": card.rgb,
                    }}
                  >
                    <div className="card-icon">
                      <i className={`fas ${card.icon}`}></i>
                    </div>
                    <div className="card-content">
                      <div className="card-value">{card.value}</div>
                      <div className="card-label">{card.label}</div>
                      <div
                        className="card-progress"
                        style={{ "--progress": card.progress }}
                      ></div>
                    </div>
                    <div className="card-footer">{card.footer}</div>
                  </div>
                ))}
              </div>

              {/* Logged Items */}
              <div className="food-items-section">
                <h4 className="section-title">
                  <span className="title-icon">
                    <i className="fas fa-clipboard-list"></i>
                  </span>
                  <span>Logged Items</span>
                  <span className="item-count">{data?.items?.length}</span>
                </h4>

                <div className="food-items-list">
                  {data?.items?.map((item, index) => {
                    const { icon, color } = getRandomIcon();
                    const loggedAt = new Date(item?.logged_at);
                    const formattedTime = loggedAt.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    });

                    return (
                      <div className="food-item-card breakfast">
                        <div className="food-item-badge">
                          <i className={icon}></i>
                        </div>
                        <div className="food-item-content">
                          <div className="food-item-header">
                            <h5 className="food-name">{item?.food_name}</h5>
                            <div className="food-calories" style={color}>
                              <i className="fas fa-bolt"></i>{" "}
                              {item?.calories_consumed.toFixed(1)} kcal
                            </div>
                          </div>
                          <div className="food-item-meta">
                            <span className="meta-item">
                              <i
                                className="fas fa-weight-hanging"
                                style={color}
                              ></i>{" "}
                              {item?.weight_grams}g
                            </span>
                            <span className="meta-item">
                              <i className="far fa-clock" style={color}></i>{" "}
                              {formattedTime}
                            </span>
                          </div>
                          <div className="food-item-nutrients">
                            <div className="nutrient-badge">
                              <span className="nutrient-icon protein">
                                <i
                                  className="fas fa-dumbbell"
                                  style={color}
                                ></i>
                              </span>
                              <span className="nutrient-value">
                                {item?.protein_g.toFixed(1)}g
                              </span>
                            </div>
                            <div className="nutrient-badge">
                              <span className="nutrient-icon carbs">
                                <i
                                  className="fas fa-bread-slice"
                                  style={color}
                                ></i>
                              </span>
                              <span className="nutrient-value">
                                {item?.carbs_g.toFixed(1)}g
                              </span>
                            </div>
                            <div className="nutrient-badge">
                              <span className="nutrient-icon fats">
                                <i className="fas fa-oil-can" style={color}></i>
                              </span>
                              <span className="nutrient-value">
                                {item?.fats_g.toFixed(1)}g
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cta-button pulse" onClick={onClose}>
                <i className="fas fa-plus-circle"></i> Add Food Item
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DailyLogModal;
