import { hot } from "react-hot-loader/root";
import React from "react";
import "./css/App.css";
import "./css/Style.css";
import Header from "./components/Header";
import MenuButton from "./components/MenuButton";
import Main from "./components/Main";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
const App = () => {
  const [headerOpen, setHeaderState] = useState(false);

  function toggleHeader(e) {
    console.log(e.target);
    if (headerOpen === false) {
      return setHeaderState(true);
    }
    if (headerOpen === true) {
      return setHeaderState(false);
    }
  }

  return (
    <>
      <div className="container-fluid bg-secondary">
        <MenuButton headerOpen={headerOpen} toggleHeader={toggleHeader} />

        <div className="row h-100">
          <Header headerOpen={headerOpen} toggleHeader={toggleHeader} />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/home" element={<Main />} />
            <Route path="/upload" element={<Main />} />
          </Routes>
        </div>
      </div>
      {/* <div>Hello World</div> */}
    </>
  );
};

export default hot(App);
