import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {

    if (tokenNotExpired()) {
      return true;
    }

    // this.router.navigate(['/login']);
    // this route was in here but this route guard just needs to return a boolean not a route
    // as well so not sure why the template had that in there. 
    
    return false;
  }
}
