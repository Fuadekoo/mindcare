"use client";
import PayChart from "./paychart";
import PatientType from "./patientType";
import Card from "./card";
import React from "react";
import Graph from "./graph";
import Data from "./data";

function Page() {
  return (
    <div className="overflow-y-auto p-4">
      <Card />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
        <div className="md:col-span-3 h-100 bg-white/100 shadow-md rounded-xl">
          <Graph />
        </div>
        <div className="md:col-span-1 h-100 shadow-md rounded-xl">
          <PayChart />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
        <div className="md:col-span-3 h-100 shadow-md rounded-xl">
          <PatientType />
        </div>
        <div className="md:col-span-1 h-100 shadow-md rounded-xl">
          <Data />
        </div>
      </div>
    </div>
  );
}

export default Page;
