import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/slice/userSlice";
import { GoogleButton } from "../../components/PrivateLayout/GoogleButton";
import "./auth.css";
import { SubmitButton } from "../../components/PublicLayout/SubmitButton";
export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    weight_kg: "",
    height_cm: "",
    activity_level: "",
    goal: "",
    customCalorie: "",
  });

  const dispatch = useDispatch();
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      console.log("userCredential=", userCredential);
      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/save-user`,
        {
          name: form.name,
          email: form.email,
          age: form.age,
          gender: form.gender,
          weight_kg: form.weight_kg,
          height_cm: form.height_cm,
          activity_level: form.activity_level,
          goal: form.goal,
          ...(form.goal === "custom" && { customCalorie: form.customCalorie }),
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("data====", data);
      localStorage.setItem("accessToken", idToken);
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || "",
      };

      dispatch(addUser(userData));
      navigate("/dashboard");

      toast("Signup successful!");
    } catch (err) {
      console.log(err);
      toast(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="bg-blur-1"></div>
      <div className="bg-blur-2"></div>
      <div className="glass-card auth-card">
        <div className="auth-logo">
          <img
            src="https://res.cloudinary.com/daz1e04fq/image/upload/v1750063589/Nutrivue/u37dajzrvjsrh8o17tku.svg"
            alt="NutriVue AI"
          />
        </div>

        <div className="auth-tabs">
          <a onClick={() => navigate("/login")}>Login</a>
          <a className="active">Sign Up</a>
        </div>

        <div className="social-login">
          <GoogleButton />
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-with-icon">
              <i className="fas fa-user"></i>
              <input
                name="name"
                type="text"
                placeholder="Enter your full name"
                required
                value={form.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <i className="fas fa-envelope"></i>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Create Password</label>
            <div className="input-with-icon">
              <i className="fas fa-lock"></i>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                required
                value={form.password}
                onChange={handleChange}
              />
              <i
                className={`fas ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } toggle-password`}
                onClick={toggleShowPassword}
                style={{ cursor: "pointer" }}
              ></i>
            </div>
          </div>

          <div className="form-group">
            <label>Age</label>
            <div className="input-with-icon">
              <i className="fas fa-hourglass-half"></i>
              <input
                name="age"
                type="number"
                placeholder="Enter your age"
                required
                value={form.age}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Gender</label>
            <div className="input-with-icon">
              <i className="fas fa-venus-mars"></i>
              <select
                name="gender"
                required
                value={form.gender}
                onChange={handleChange}
                style={{ paddingLeft: "45px" }}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Weight (kg)</label>
            <div className="input-with-icon">
              <i className="fas fa-weight"></i>
              <input
                name="weight_kg"
                type="number"
                placeholder="e.g. 70"
                required
                value={form.weight_kg}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Height (cm)</label>
            <div className="input-with-icon">
              <i className="fas fa-ruler-vertical"></i>
              <input
                name="height_cm"
                type="number"
                placeholder="e.g. 170"
                required
                value={form.height_cm}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Activity Level</label>
            <div className="input-with-icon">
              <i className="fas fa-running"></i>
              <select
                name="activity_level"
                required
                value={form.activity_level}
                onChange={handleChange}
                style={{ paddingLeft: "45px" }}
              >
                <option value="">Select Activity Level</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="extra">Extra</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Goal</label>
            <div className="input-with-icon">
              <i className="fas fa-bullseye"></i>
              <select
                name="goal"
                required
                value={form.goal}
                onChange={handleChange}
                style={{ paddingLeft: "45px" }}
              >
                <option value="">Select Goal</option>
                <option value="lose">Lose</option>
                <option value="maintain">Maintain</option>
                <option value="gain">Gain</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          {form.goal === "custom" && (
            <div className="form-group">
              <label>Custom Calorie</label>
              <div className="input-with-icon">
                <i className="fas fa-fire"></i>
                <input
                  name="customCalorie"
                  type="number"
                  placeholder="e.g. 2500"
                  required
                  value={form.customCalorie}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div className="form-group terms">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>
            </label>
          </div>

          <SubmitButton type={`submit`} text={`Signup`} />
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <a onClick={() => navigate("/login")}>Login</a>
        </div>
      </div>
    </div>
  );
};
