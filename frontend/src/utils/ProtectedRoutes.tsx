import { Navigate, Outlet } from "react-router-dom";
import SessionStorageService, { StorageKeys } from "../services/sessionStorageService";

const sessionStorageService = new SessionStorageService();

export const ProtectedRoutes = () => {

    const condition = sessionStorageService.getItem(StorageKeys.MATCH_ID);
    return condition ? <Outlet /> : <Navigate to="/" />;
}