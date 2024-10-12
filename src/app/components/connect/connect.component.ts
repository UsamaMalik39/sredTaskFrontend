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
  githubToken: string = '';
  organizations: any[] = []; 
  columnDefs:any = [
    { headerName: 'ID', field: 'id' , flex:1 },
    { headerName: 'Name', field: 'name' , flex:1},
    { headerName: 'Link', field: 'link', flex:1 },
    { headerName: 'Slug', field: 'slug' , flex:1},
    {
      headerName: 'Included',
      field: 'checkmark',
      flex: 1,
      cellRenderer: (params: any) => {
          return `<input type="checkbox" ${params.value ? 'checked' : ''} />`;
      },
      editable: true,
      onCellValueChanged: (params: any) => {
          params.data.checkmark = params.newValue; 
      }
  }
];

	rowData:any[] = [];

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
        this.githubToken = response.githubToken; 
        localStorage.setItem('githubToken', this.githubToken); 
        this.fetchOrganizationsAndRepos();
      }
    });
  }

  fetchOrganizationsAndRepos(): void {
    this.authService.fetchOrganizationsAndRepos().subscribe((data: any) => {
      this.organizations = data.repos.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        link: repo.html_url, 
        slug: repo.full_name, 
        checkmark: false 
      }));
      this.rowData=[...this.organizations];

      console.log('Fetched organizations and repos:', this.organizations);
    }, (error) => {
      console.error('Error fetching organizations and repos:', error);
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
      localStorage.removeItem('githubToken'); 
    });
  }
}
