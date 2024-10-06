import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setUserName,
  setRoles,
  setRole,
  setAccessibleModules,
  setCurrentAccessibleModules,
  clearUserName,
  clearRoles,
} from "../redux/userslice";
import { authRoute } from "../routes/api_routes";

function ValidateAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    // eslint-disable-next-line consistent-return
    const validateUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No authentication token found!");
      try {
        const { data } = await axios.get(authRoute, {
          headers: { Authorization: `Token ${token}` },
        });

        const { name, designation_info, accessible_modules } = data;

        dispatch(setUserName(name));
        dispatch(setRoles(designation_info));
        dispatch(setRole(designation_info[0]));
        dispatch(setAccessibleModules(accessible_modules));

        dispatch(setCurrentAccessibleModules());
      } catch (error) {
        console.error("Failed to validate user:", error);

        dispatch(clearUserName());
        dispatch(clearRoles());
      }
    };

    validateUser();
  }, [dispatch]);
}

export default ValidateAuth;
