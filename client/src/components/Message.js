import React from "react";

const Message = ({ msg, bgColor, height, mt, width }) => {
  let myStyles = {
    
    padding: "0.5rem",
    marginBottom: "1rem",
    textAlign: "center",
    backgroundColor: bgColor,
    color: "#fff",
    fontWeight: "bold",
    width: width || "100%",
    height: height || "4rem",
    marginTop: mt || "1rem"
  };
  return (
    <div style={myStyles}>
      {/* <p>{msg}</p> */}
      <p dangerouslySetInnerHTML={{ __html: msg }}></p>
    </div>
  );
};

export default Message;
