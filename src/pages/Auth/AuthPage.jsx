// src/pages/Auth/AuthPage.jsx
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { auth } from "../../utils/firebase";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/slice/userSlice";
import { SubmitButton } from "../../components/PublicLayout/SubmitButton";
import "./auth.css";
import { axiosInstance } from "../../utils/axiosInstance";
import { GoogleButton } from "../../components/PrivateLayout/GoogleButton";
import axios from "axios";

export const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  // determine mode
  const mode = location.pathname === "/register" ? "signup" : "login";

  // local form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showMagicLink, setShowMagicLink] = useState(false);

  const toggleShowPassword = () => setShowPassword((p) => !p);

  // common post-auth logic
  const onAuthSuccess = async (firebaseUser) => {
    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || "",
    };

    try {
      console.log("inside");

      const token = await firebaseUser.getIdToken(true);
      console.log("in auth page token===", token);
      // 2) Send it explicitly on the first call
      const { data } = await axiosInstance.get("/users/me");
      dispatch(addUser(data));
    } catch (err) {
      console.warn("No DB record, falling back to Firebase data.", err);
      dispatch(addUser(userData));
    }

    toast.success(
      mode === "signup" ? "Signup successful!" : "Login successful!"
    );
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  const handleEmailPassword = async (e) => {
    e.preventDefault();
    try {
      let cred;
      if (mode === "login") {
        cred = await signInWithEmailAndPassword(auth, email, password);
      } else {
        cred = await createUserWithEmailAndPassword(auth, email, password);
      }
      console.log("cred===", cred);
      await onAuthSuccess(cred?.user, mode === "signup");
    } catch (err) {
      console.log(err);
      if (err.code === "auth/user-not-found") {
        toast.error("No user found with this email.");
      } else if (err.code === "auth/wrong-password") {
        toast.error("Incorrect password.");
      } else {
        toast.error(err.message);
      }
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    const actionCodeSettings = {
      url: window.location.origin + "/login", // after click they return here
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      toast.success("Magic link sent! Check your email.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <img src="https://…/logo.svg" alt="Your App" />
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <Link to="/login" className={mode === "login" ? "active" : ""}>
            Login
          </Link>
          <Link to="/register" className={mode === "signup" ? "active" : ""}>
            Sign Up
          </Link>
        </div>

        {/* Google */}
        <div className="social-login">
          <GoogleButton />
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        {/* Email / Password or Magic Link */}
        {!showMagicLink ? (
          <form className="auth-form" onSubmit={handleEmailPassword}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>{mode === "login" ? "Password" : "Create Password"}</label>
              <div className="input-with-icon">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                  onClick={toggleShowPassword}
                />
              </div>
            </div>

            <SubmitButton
              type="submit"
              text={mode === "login" ? "Sign In" : "Sign Up"}
            />
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleMagicLink}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <SubmitButton type="submit" text="Send Magic Link" />
          </form>
        )}

        <div className="magic-link-toggle">
          {mode === "login" && (
            <button onClick={() => setShowMagicLink((p) => !p)}>
              {showMagicLink ? "Use Password Instead" : "Use Magic Link"}
            </button>
          )}
        </div>

        <div className="auth-footer">
          {mode === "login" ? (
            <>
              Don’t have an account? <Link to="/register">Sign Up</Link>
            </>
          ) : (
            <>
              Already have an account? <Link to="/login">Login</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
