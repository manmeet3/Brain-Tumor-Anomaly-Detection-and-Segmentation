import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TokenStorageService } from './services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private role: string;
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  constructor(private tokenStorageService: TokenStorageService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      console.log(this.tokenStorageService.getUser());
      const user = this.tokenStorageService.getUser();
      this.role = user.role;
      this.username = user.username;
      this.cd.markForCheck();
    }
    this.cd.markForCheck();
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
