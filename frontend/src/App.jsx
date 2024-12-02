import React, { useState, useEffect } from "react";

async function getResponse(params) {
  const apiUrl = `http://localhost:5000/`;
  const response = await fetch(apiUrl);
  console.log(response);
}
function App() {
  try {
    getResponse();
  } catch (e) {
    console.log(e);
  }
  return <h1>Hello</h1>;
}

export default App;
