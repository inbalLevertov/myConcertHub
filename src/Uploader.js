import React from "react";
// import axios from "./axioscopy";

export function Uploader({
    handleClick,
    handleChange,
    handleClose,
    url,
    first,
    last
}) {
    return (
        <div>
            <div id="uploader-container">
                <form id="uploader-form">
                    <img
                        className="ppBig"
                        src={url || "/default.jpg"}
                        alt={`${first} ${last}`}
                    />
                    <input
                        onChange={handleChange}
                        id="fileUploader"
                        type="file"
                        name="file"
                        accept="image/*"
                    />
                    <button id="submitUploader" onClick={handleClick}>
                        submit
                    </button>
                    <button id="closeUploader" onClick={handleClose}>
                        close
                    </button>
                </form>
            </div>
        </div>
    );
}
