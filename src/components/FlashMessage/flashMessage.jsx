import React, { useState } from "react";
import {
  faCircleCheck,
  faXmark,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.css";

function FlashMessage({ rules, message, onClick }) {
  return (
    <>
      {rules === "success" ? (
        <div className="flash-message flash-message-content-success">
          <div className="flash-message-content">
            <FontAwesomeIcon icon={faCircleCheck} />
            <p>{message}</p>
          </div>
          <div className="flash-message-close">
            <FontAwesomeIcon icon={faXmark} onClick={onClick} />
          </div>
        </div>
      ) : (
        <div className="flash-message flash-message-content-errors">
          <div className="flash-message-content">
            <FontAwesomeIcon icon={faCircleExclamation} />
            <p>{message}</p>
          </div>
          <div className="flash-message-close">
            <FontAwesomeIcon icon={faXmark} onClick={onClick} />
          </div>
        </div>
      )}
    </>
  );
}

export default FlashMessage;
