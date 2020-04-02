import React, { useState } from "react";
import axios from "./axioscopy";

export function useAuthSubmit(url, values) {
    const [error, setError] = useState();

    const handleSubmit = async () => {
        const { data } = await axios.post(url, values);
        try {
            if (!data.passwordMatch) {
                setError(true);
            } else {
                location.replace("/");
            }
        } catch (err) {
            console.log("err post /login: ", err.message);
        }
    };

    return [error, handleSubmit];
}
