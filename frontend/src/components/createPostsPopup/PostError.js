import React from "react";

export default function PostError({ error, seterror }) {
  return (
    <div className="postError">
      <div>{error}</div>
      <button
        className="blue_btn"
        onClick={() => {
          seterror("");
        }}
      >
        Try again
      </button>
    </div>
  );
}
