import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const matSnackBar = inject(MatSnackBar);
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    return true;
  }

  const snackBarRef = matSnackBar.open('You must be logged in to view this page!', 'Ok', { duration: 3000 });

  // snackBarRef.onAction().subscribe(() => {
  //   router.navigate(['/login']);
  // });
  
  setTimeout(() => {
    router.navigate(['/login']);
  }, 3000);
  return false;
};
