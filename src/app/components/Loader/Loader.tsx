import React from "react";
import "./Loader.css";
const Loader = () => {
  return (
    <div className="wrapper relative top-[-42px]">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="shadow"></div>
      <div className="shadow"></div>
      <div className="shadow"></div>
    </div>
  );
};

export default Loader;
