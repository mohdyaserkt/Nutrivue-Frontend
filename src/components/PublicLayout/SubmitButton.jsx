import "../../pages/Auth/auth.css";

export const SubmitButton = ({ type, text }) => {
  return (
    <button type={type} className="auth-submit pulse">
      {text}
    </button>
  );
};
