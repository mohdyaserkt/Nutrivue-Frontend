import { useState } from "react";
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth } from "../../utils/firebase";
import toast from "react-hot-toast";
import { SubmitButton } from "../PublicLayout/SubmitButton";

export const PasswordlessEmailForm = ({ title = "Continue with Email" }) => {
  const [email, setEmail] = useState("");
  const redirectUrl = import.meta.env.VITE_FIREBASE_EMAIL_LINK_REDIRECT;
  const handleMagicLinkLogin = async (e) => {
    e.preventDefault();
    try {
      const actionCodeSettings = {
        url: redirectUrl,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem("emailForSignIn", email);
      toast.success("Magic link sent to your email.");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <>
      <h2 style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>
        {title}
      </h2>

      <form className="auth-form" onSubmit={handleMagicLinkLogin}>
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

        <SubmitButton type={`submit`} text={`Send Magic Link`} />
      </form>
    </>
  );
};
