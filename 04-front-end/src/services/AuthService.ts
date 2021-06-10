import api from "../api/api";
import { saveAuthToken, saveRefreshToken } from '../api/api';
import EventRegister from '../api/EventRegister';

export interface IRegistrationResult {
    success: boolean;
    message?: string;
}

export default class AuthService {
    public static attemptAdministratorLogin(username: string, password: string) {
        api("post", "/auth/administrator/login", "administrator", {
            username: username,
            password: password,
        }, false)
        .then(res => {
            if (res.status === "ok") {
                const authToken = res.data?.authToken ?? "";
                const refreshToken = res.data?.refreshToken ?? "";

                saveAuthToken("administrator", authToken);
                saveRefreshToken("administrator", refreshToken);

                EventRegister.emit("AUTH_EVENT", "administrator_login");                
            } else {
                EventRegister.emit("AUTH_EVENT", "administrator_login_failed", res.data);
            }
        })
        .catch(err => {
            EventRegister.emit("AUTH_EVENT", ["administrator_login_failed", err]);
        });
    }
}