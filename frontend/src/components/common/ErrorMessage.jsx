import React from "react";

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="p-4 text-center text-red-700 bg-red-100 border border-red-400 rounded">
      <p>Error: {message}</p>
    </div>
  );
};

export default ErrorMessage;
