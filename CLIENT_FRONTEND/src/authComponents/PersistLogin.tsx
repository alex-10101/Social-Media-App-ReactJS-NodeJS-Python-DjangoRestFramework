import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { removeCredentials, setCredentials } from "../features/auth/authSlice";
import { apiSlice } from "../app/api/apiSlice";
import {
  useCheckUserIsAuthenticatedMutation,
  useLogoutUserMutation,
} from "../features/auth/authApiSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Loading from "../components/Loading";

/**
 *
 * @returns Component to persist login state after page refresh. Component is used in App.tsx
 */
function PersistLogin() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const [checkUserIsAuthenticated] = useCheckUserIsAuthenticatedMutation();
  const [logout] = useLogoutUserMutation();

  // check when the component mounts if the user is authenticated.
  // If yes, dispatch an action to set the user in the global state.
  // If no, log user out and clear all previous state.
  useEffect(() => {
    async function verifyUserIsAuthenticated() {
      try {
        const data = await checkUserIsAuthenticated().unwrap();
        if (data && data.user) {
          dispatch(setCredentials({ ...data }));
        } else {
          await logout().unwrap();
          dispatch(removeCredentials());
          dispatch(apiSlice.util.resetApiState());
        }
      } catch {
        await logout().unwrap();
        dispatch(removeCredentials());
        dispatch(apiSlice.util.resetApiState());
      } finally {
        setIsLoading(false);
      }
    }

    if (!currentUser) {
      verifyUserIsAuthenticated();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  return <Outlet />;
}

export default PersistLogin;
