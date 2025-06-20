import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/slice/userSlice";
import { PasswordlessEmailForm } from "../../components/PrivateLayout/PasswordlessEmailForm";
import { axiosInstance } from "../../utils/axiosInstance";
import { GoogleButton } from "../../components/PrivateLayout/GoogleButton";
import { SubmitButton } from "../../components/PublicLayout/SubmitButton";
export const Login = () => {
   const [showMagicLink, setShowMagicLink] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();
      console.log("firebaseuser===", firebaseUser);
      console.log("idToken==", idToken);
      localStorage.setItem("accessToken", idToken);
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
      };
      try {
        const response = await axiosInstance.get("/users/me", {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response.data, "==response.data");

        dispatch(addUser(response?.data));
      } catch (error) {
        if (error.response.status === 404) {
          dispatch(addUser(userData));
        }
        console.error("Fetch user failed:", error);
        console.error("status", error.response.status);
        toast.error("Failed to fetch user data.");
        return;
      }

      navigate("/dashboard");
      toast.success("Login successful!");
    } catch (err) {
      console.log("err", err);
      if (err.code === "auth/wrong-password") {
        toast.error("Incorrect password.");
      } else if (err.code === "auth/user-not-found") {
        toast.error("No user found with this email.");
      } else {
        toast.error(err.message);
      }
    }
  };

  return (
   <div className="auth-container">
      <div className="bg-blur-1"></div>
      <div className="bg-blur-2"></div>
      <div className="glass-card auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <img
            src="https://res.cloudinary.com/daz1e04fq/image/upload/v1750063589/Nutrivue/u37dajzrvjsrh8o17tku.svg"
            alt="NutriVue AI"
          />
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <a className="active">Login</a>
          <a onClick={() => navigate("/register")}>Sign Up</a>
        </div>

        {/* Google login */}
        <div className="social-login">
          <GoogleButton />
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        {!showMagicLink ? (
          <>
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <i className="fas fa-envelope"></i>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <i className="fas fa-eye toggle-password"></i>
                </div>
              </div>

             <SubmitButton  type={`submit`} text={`SignIn`}/>
            </form>

            {/* Magic link toggle */}
            <div className="magic-link">
              <p>
                Prefer passwordless?{" "}
                <a onClick={() => setShowMagicLink(true)}>Login with Magic Link</a>
              </p>
            </div>
          </>
        ) : (
          <>
            <PasswordlessEmailForm title="Login with Magic Link" />

            <div className="magic-link">
              <p>
                Go back to{" "}
                <a onClick={() => setShowMagicLink(false)}>Email & Password Login</a>
              </p>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="auth-footer">
          Don't have an account?{" "}
          <a onClick={() => navigate("/register")}>Sign Up</a>
        </div>
      </div>
    </div>
  );
};
