import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthenticationService } from '../services/authentication.service';
import { ROLES } from "src/app/shared/constants/constans";

export const authChildGuard: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return authGuard(route, state);
};

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  let authService = inject(AuthenticationService);
  let routerService = inject(Router)
  if (route.fragment) {
    const fragmentArr = route.fragment.split('&')
    if (fragmentArr.length == 6) {
      const auth = fragmentArr[0]
      const authArr = auth.split('=')

      const token = fragmentArr[1]
      const tokenArr = token.split('=')

      const winUserId = fragmentArr[2]
      const winUserIdArr = winUserId.split('=')

      const domain = fragmentArr[3]
      const domainArr = domain.split('=')

      const userId = fragmentArr[4]
      const userIdArr = userId.split('=')

      const sessionId = fragmentArr[5]
      const sessionIdArr = sessionId.split('=')
      if (authArr[0] == 'auth' && authArr[1] == 'true') {
        if (tokenArr[0] == 'TOKEN') {
          authService.registerSuccessfulLogin('', tokenArr[1], '', parseInt(userIdArr[1]))
          authService.afterLoginUserDetail(parseInt(userIdArr[1])).subscribe({
            next: (resp: any) => {
              let parsedJson = JSON.parse(resp);
              const assignedRoles = parsedJson?.data?.userDetails?.assignedUserRoles;
              if (!assignedRoles || assignedRoles.length === 0) {
                routerService.navigate(['/unauthorizedPage']);
              }
              else {
                const corporateTeam = assignedRoles.some((role: any) =>
                  role.roleName.includes(ROLES.CORPORATE_TEAM)
                );

                const fundflowIcsBssTeam = assignedRoles.some((role: any) =>
                  role.roleName.includes(ROLES.FUNDFLOW_USER)
                );

                if (corporateTeam) {
                  routerService.navigate(['/dashboard'])
                } else if (fundflowIcsBssTeam) {
                  routerService.navigate(['/dashboard'])
                }
                else {
                  routerService.navigate(['/dashboard'])
                }
              }
            },
            error: (error: any) => {
              routerService.navigate(['/unauthorizedPage']);
            }

          })
          return false;
        } else {
          routerService.navigate(['/login'])
          return false;
        }
      }
    }
  }

  if (!authService.isLoggedIn()) {
    routerService.navigate(['/login']);
    return false;
  }
  else {
    return true;
  }

};
