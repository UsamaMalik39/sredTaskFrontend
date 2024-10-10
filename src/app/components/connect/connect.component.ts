import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css'],
})
export class ConnectComponent implements OnInit {
  isAuthenticated = false;
  connectedDate: string = '';
  githubUsername: string = '';
  isLoading: boolean = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.checkIntegrationStatus();
  }

  checkIntegrationStatus(): void {
    this.authService.checkStatus().subscribe((response: any) => {
      this.isLoading= false;
      if (response.connected) {
        this.isAuthenticated = true;
        this.connectedDate = response.integrationDate;
        this.githubUsername = response.user.username;
      }
    });
  }

  connectToGitHub(): void {
    this.authService.connectGitHub();
  }

  removeIntegration(): void {
    this.authService.removeIntegration().subscribe(() => {
      this.isAuthenticated = false;
      this.connectedDate = '';
      this.githubUsername = '';
    });
  }
}
