import { CanActivateFn } from "@angular/router";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";

export const AuthGuardARTDV: CanActivateFn = () => {
    const authService = inject(AuthService);

    if(authService.isLoggedIn()) {
        return true;
    } else {
        authService.logout();
        return false;
    }
}