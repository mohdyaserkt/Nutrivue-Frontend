import { useState } from "react";
import "./CompleteProfileModal.css";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../../redux/slice/userSlice";
import { axiosInstance } from "../../../../utils/axiosInstance";

const CompleteProfileModal = ({ isOpen, onClose }) => {
  const [selectedGoal, setSelectedGoal] = useState("");
  const dispatch = useDispatch();
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get("name")?.trim();
    const age = formData.get("age");
    const gender = formData.get("gender");
    const weight = formData.get("weight_kg");
    const height = formData.get("height_cm");
    const activity = formData.get("activity_level");
    const goal = formData.get("goal");
    const customCalorie = formData.get("customCalorie");

    if (!name) return toast.error("Full Name is required");
    if (!age || age < 12 || age > 120)
      return toast.error("Valid Age is required (12–120)");
    if (!gender) return toast.error("Gender is required");
    if (!weight || weight < 30 || weight > 300)
      return toast.error("Valid Weight is required (30–300 kg)");
    if (!height || height < 100 || height > 250)
      return toast.error("Valid Height is required (100–250 cm)");
    if (!activity) return toast.error("Activity Level is required");
    if (!goal) return toast.error("Fitness Goal is required");
    if (goal === "custom" && (!customCalorie || customCalorie < 500)) {
      return toast.error("Custom Calorie must be a valid number (min 500)");
    }

    const profileData = Object.fromEntries(formData.entries());

    try {
      const { data } = await axiosInstance.post(
        "/users/save-user",
        profileData
      );
      console.log("response==", data);
      toast.success("updated successful");

      dispatch(updateUser(data));
    } catch (error) {
      toast.error(error.message || error);
      return;
    }

    toast.success("Profile submitted successfully!");
    onClose();
  };

  return (
    <>
      <div className={`modal-overlay ${isOpen ? "active" : ""}`}>
        <div className="modal-container">
          <div className="modal-header">
            <h2>Complete Your Profile</h2>
            <p>Help us personalize your experience</p>
          </div>

          <form
            id="profileForm"
            className="modal-body"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Basic Inputs */}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  placeholder="Your age"
                  min="12"
                  max="120"
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input type="radio" name="gender" value="male" />
                    <span className="radio-custom"></span>
                    Male
                  </label>
                  <label className="radio-option">
                    <input type="radio" name="gender" value="female" />
                    <span className="radio-custom"></span>
                    Female
                  </label>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <div className="input-with-icon">
                  <input
                    type="number"
                    id="weight"
                    name="weight_kg"
                    placeholder="e.g. 68.5"
                    min="30"
                    max="300"
                  />
                  <i className="fas fa-weight"></i>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="height">Height (cm)</label>
                <div className="input-with-icon">
                  <input
                    type="number"
                    id="height"
                    name="height_cm"
                    placeholder="e.g. 175"
                    min="100"
                    max="250"
                  />
                  <i className="fas fa-ruler-vertical"></i>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="activity">Activity Level</label>
              <select id="activity" name="activity_level" defaultValue="">
                <option value="" disabled>
                  Select your activity level
                </option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="extra">Extra Active</option>
              </select>
            </div>

            {/* Goal Selection */}
            <div className="form-group">
              <label>Fitness Goal</label>
              <div className="goal-cards">
                {["lose", "maintain", "gain", "custom"].map((goalKey) => {
                  const goalInfo = {
                    lose: {
                      icon: "fas fa-weight",
                      label: "Lose Weight",
                      desc: "Burn fat and reduce body weight",
                    },
                    maintain: {
                      icon: "fas fa-balance-scale",
                      label: "Maintain",
                      desc: "Keep your current weight",
                    },
                    gain: {
                      icon: "fas fa-dumbbell",
                      label: "Gain Muscle",
                      desc: "Build strength and muscle mass",
                    },
                    custom: {
                      icon: "fas fa-pen",
                      label: "Custom Goal",
                      desc: "Specify custom calorie target",
                    },
                  }[goalKey];

                  return (
                    <label key={goalKey} className="goal-card">
                      <input
                        type="radio"
                        name="goal"
                        value={goalKey}
                        onChange={() => setSelectedGoal(goalKey)}
                      />
                      <div className="card-content">
                        <i className={goalInfo.icon}></i>
                        <h3>{goalInfo.label}</h3>
                        <p>{goalInfo.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Show Custom Calorie if "custom" selected */}
            {selectedGoal === "custom" && (
              <div className="form-group">
                <label htmlFor="customCalorie">Custom Calorie Target</label>
                <input
                  type="number"
                  name="customCalorie"
                  id="customCalorie"
                  placeholder="Enter calorie target"
                  min="500"
                />
              </div>
            )}

            <div className="modal-footer">
              <button type="submit" className="submit-btn">
                Complete Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CompleteProfileModal;
