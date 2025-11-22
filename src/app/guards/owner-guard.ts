import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class OwnerGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const authData = this.authService.getAuthData();
    const requestedUserId = route.paramMap.get('id');

    if (authData?.user?.id === requestedUserId) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
