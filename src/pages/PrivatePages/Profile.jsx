import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { axiosInstance } from "../../utils/axiosInstance";
import { updateUser } from "../../redux/slice/userSlice";
import toast from "react-hot-toast";
import "./Profile.css"; // make sure this points to your styles.css
import { useLogout } from "../../hooks/useLogout";

const genders = ["male", "female", "other"];
const activityLvls = ["sedentary", "light", "moderate", "active", "extra"];
const goals = ["lose", "maintain", "gain", "custom"];

export const Profile = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector((s) => s.user.user) || {};
  const [user, setUser] = useState(userDetails);
  const [editMode, setEdit] = useState(false);
  const { handleLogout } = useLogout();
  console.log("user===", user);
  const handleChange = (field, value) => {
    console.log("value===", value);
    setUser((u) => ({ ...u, [field]: value }));
  };
  const onLogoutClick = async () => {
    try {
      await handleLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const handleSave = async () => {
    try {
      const payload = { ...user };
      if (payload.goal === "custom") {
        delete payload.target_calories;
      } else {
        delete payload.customCalorie;
      }
      const { data } = await axiosInstance.post("/users/save-user", payload);
      dispatch(updateUser(data));
      setUser(data);
      toast.success("Profile updated successfully!");
      setEdit(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  const cancelEdit = () => {
    setUser(userDetails);
    setEdit(false);
  };

  return (
    <div className="dashboard-container">
      <main>
        {/* Profile Header */}
        <section className="profile-header glass-card">
          <div className="avatar-container">
            <div className="avatar-wrapper pulse">
              <img
                src="https://i.pravatar.cc/120"
                alt="Profile"
                className="profile-avatar"
              />
              <button className="edit-avatar-btn">
                <i className="fas fa-camera"></i>
              </button>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{user.name}</h1>
              <p className="profile-email">{user.email}</p>
            </div>
          </div>
          <div className="profile-stats">
            <Stat
              icon="fa-bullseye"
              value={user.target_calories}
              label="Daily Target"
            />
            <Stat
              icon="fa-weight-hanging"
              value={user.weight_kg}
              label="Weight (kg)"
            />
            <Stat
              icon="fa-ruler-vertical"
              value={user.height_cm}
              label="Height (cm)"
            />
          </div>
        </section>

        {/* Personal Info */}
        <ProfileSection title="Personal Information" icon="fa-user">
          <Field
            label="Email"
            icon="fa-envelope"
            value={user.email}
            editable={false}
          />
          <Field
            label="Full Name"
            icon="fa-signature"
            value={user.name}
            editable={editMode}
            onChange={(v) => handleChange("name", v)}
          />
          <Field
            label="Age"
            icon="fa-birthday-cake"
            value={user.age}
            editable={editMode}
            type="number"
            onChange={(v) => handleChange("age", v)}
          />
          <Field
            label="Gender"
            icon="fa-venus-mars"
            value={user.gender}
            editable={editMode}
            as="select"
            options={genders}
            onChange={(v) => handleChange("gender", v)}
          />
        </ProfileSection>

        {/* Health Metrics */}
        <ProfileSection title="Health Metrics" icon="fa-heartbeat">
          <Field
            label="Weight (kg)"
            icon="fa-weight"
            value={user.weight_kg}
            editable={editMode}
            type="number"
            onChange={(v) => handleChange("weight_kg", v)}
          />
          <Field
            label="Height (cm)"
            icon="fa-ruler-combined"
            value={user.height_cm}
            editable={editMode}
            type="number"
            onChange={(v) => handleChange("height_cm", v)}
          />
        </ProfileSection>

        {/* Preferences */}
        <ProfileSection title="Preferences" icon="fa-sliders-h">
          <Field
            label="Activity Level"
            icon="fa-running"
            value={user.activity_level}
            editable={editMode}
            as="select"
            options={activityLvls}
            onChange={(v) => handleChange("activity_level", v)}
          />
          <Field
            label="Fitness Goal"
            icon="fa-bullseye"
            value={user.goal}
            editable={editMode}
            as="select"
            options={goals}
            onChange={(v) => handleChange("goal", v)}
          />
          {user.goal === "custom" ? (
            <Field
              label="Target Calories"
              icon="fa-fire"
              value={user.customCalorie}
              // only editable if *both* global editMode *and* goal==="custom"
              editable={editMode && user.goal === "custom"}
              type="number"
              onChange={(v) => handleChange("customCalorie", v)}
            />
          ) : (
            <Field
              label="Daily Target"
              icon="fa-fire"
              value={user.target_calories}
              // always non-editable unless goal changes to custom
              editable={false}
            />
          )}
        </ProfileSection>

        {/* Account Settings */}
        <ProfileSection title="Account Settings" icon="fa-user-cog">
          <div className="profile-field toggle-field">
            <label>
              <i className="fas fa-power-off" /> Account Status
            </label>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked={!user.disabled} />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="profile-actions">
            <button className="secondary-button">
              <i className="fas fa-lock" /> Change Password
            </button>
            <button className="secondary-button">
              <i className="fas fa-sign-out-alt" onClick={onLogoutClick} />{" "}
              Logout
            </button>
          </div>
        </ProfileSection>

        {/* Edit / Save Buttons */}
        <div
          className="profile-actions"
          style={{ justifyContent: "flex-end", marginTop: 20 }}
        >
          {editMode ? (
            <>
              <button className="secondary-button" onClick={cancelEdit}>
                <i className="fas fa-times" /> Cancel
              </button>
              <button className="secondary-button" onClick={handleSave}>
                <i className="fas fa-check" /> Save
              </button>
            </>
          ) : (
            <button className="secondary-button" onClick={() => setEdit(true)}>
              <i className="fas fa-edit" /> Edit Profile
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

const Stat = ({ icon, value, label }) => (
  <div className="stat-card">
    <div className="stat-icon">
      <i className={`fas ${icon}`} />
    </div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const ProfileSection = ({ title, icon, children }) => (
  <section className="profile-section glass-card">
    <div className="section-header">
      <div className="icon-circle">
        <i className={`fas ${icon}`} />
      </div>
      <h2>{title}</h2>
    </div>
    <div className="profile-grid">{children}</div>
  </section>
);

const Field = ({
  label,
  icon,
  value,
  editable,
  type = "text",
  as = "input",
  options = [],
  onChange, // parent setter
}) => {
  return (
    <div className={`profile-field ${editable ? "editable" : ""}`}>
      <label>
        <i className={`fas ${icon}`} /> {label}
      </label>

      {!editable ? (
        <div className="static-value">{value}</div>
      ) : as === "select" ? (
        <select
          className="edit-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="edit-input"
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
};
