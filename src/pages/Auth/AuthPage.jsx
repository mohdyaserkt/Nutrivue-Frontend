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

export const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
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
      const token = await firebaseUser.getIdToken(true);

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

    navigate("/dashboard");
  };

  const handleEmailPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    if (!email || !email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      let cred;
      if (mode === "login") {
        cred = await signInWithEmailAndPassword(auth, email, password);
      } else {
        cred = await createUserWithEmailAndPassword(auth, email, password);
      }

      await onAuthSuccess(cred?.user, mode === "signup");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        toast.error("No user found with this email.");
      } else if (err.code === "auth/wrong-password") {
        toast.error("Incorrect password.");
      } else {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const actionCodeSettings = {
      url: window.location.origin + "/login", // after click they return here
      handleCodeInApp: true,
    };

    setLoading(true);
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      toast.success("Magic link sent! Check your email.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <img
            src="https://res.cloudinary.com/daz1e04fq/image/upload/v1749749899/Nutrivue/kzrizpn0q65was9yxz4o.svg"
            alt="Your App"
          />
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

              <label className="input-with-icon">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </label>
            </div>

            <div className="form-group">
              <label>{mode === "login" ? "Password" : "Create Password"}</label>

              <label
                className="input-with-icon"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  placeholder={"Enter your password"}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <span
                  onClick={(e) => {
                    e.stopPropagation(); //  Prevent the label from hijacking this click
                    toggleShowPassword();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye" : "fa-eye-slash"
                    }`}
                    style={{ width: "fit-content" }}
                  />
                </span>
              </label>
            </div>
            {/* ✅ Confirm Password (only for signup) */}
            {mode === "signup" && (
              <div className="form-group">
                <label>Confirm Password</label>
                <label className="input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    placeholder="Re-enter your password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </label>
              </div>
            )}
            <SubmitButton
              type="submit"
              text={mode === "login" ? "Sign In" : "Sign Up"}
              loading={loading}
            />
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleMagicLink}>
            <div className="form-group">
              <label>Email Address</label>

              <label className="input-with-icon">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </label>
            </div>
            <SubmitButton
              type="submit"
              text="Send Magic Link"
              loading={loading}
            />
          </form>
        )}
        <div class="magic-link">
          {mode === "login" && (
            <p>
              {showMagicLink ? "Prefer Password ?" : "Prefer a magic link?"}{" "}
              <a
                style={{ cursor: "pointer" }}
                onClick={() => setShowMagicLink((p) => !p)}
                id="show-magic-link"
              >
                {showMagicLink
                  ? "Use Password Instead"
                  : "Email me a login link"}
              </a>
            </p>
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
