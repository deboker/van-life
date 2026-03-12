import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found-container">
      <h1>Ľutujeme, stránka neexistuje.</h1>
      <Link to="/" className="link-button">
        Späť na domov
      </Link>
    </div>
  );
}
