import React from "react";
import Home from "../Home";
import Navbar from "../Navbar";
import Left_panel from "../Left_panel";

export default function Webview() {
  return (
    <div>
      <section className=" bg-white sm:hidden block ">
        <Navbar />

        <div className="grid grid-cols-12 h-screen">
          <div className=" col-span-12 flex flex-col border-l-1 border-neutral-200 ">
            <Home />
          </div>
        </div>
      </section>
    </div>
  );
}
