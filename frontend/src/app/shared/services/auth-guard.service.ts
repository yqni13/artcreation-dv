import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";
import { BaseRoute } from "../../api/routes/base.route.enum";

export const AuthGuardARTDV: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if(authService.isLoggedIn()) {
        return true;
    } else {
        router.navigate([BaseRoute.LOGIN]);
        return false;
    }
}