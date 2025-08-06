import "../../pages/Auth/auth.css";

export const SubmitButton = ({ type, text,loading  }) => {
  return (
     <button type={type} className="auth-submit pulse" disabled={loading}>
      {loading ? (
        <>
          <i className="fas fa-spinner fa-spin" style={{ marginRight: "8px" }}></i>
          Loading...
        </>
      ) : (
        text
      )}
    </button>
  );
};
