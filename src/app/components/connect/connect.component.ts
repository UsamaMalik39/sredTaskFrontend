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
  columnDefs: any = [
    { headerName: 'ID', field: 'id', flex: 1 },
    { headerName: 'Name', field: 'name', flex: 1 },
    { headerName: 'Link', field: 'link', flex: 1 },
    { headerName: 'Slug', field: 'slug', flex: 1 },
    { headerName: 'Included', field: 'included', flex: 1, editable: true },
  ];

  rowData: any[] = [];
  repoInfoColDefs: any = [
    { headerName: 'Repo Name', field: 'repoName', flex: 1 },
    { headerName: 'User ID', field: 'user_id', flex: 1 },
    { headerName: 'User', field: 'user', flex: 1 },
    { headerName: 'Total Commits', field: 'total_commits', flex: 1 },
    { headerName: 'Total Issues', field: 'total_issues', flex: 1 },
    {
      headerName: 'Total Pull Requests',
      field: 'total_pull_requests',
      flex: 1,
    },
  ];

  repoInfoRowData: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.checkIntegrationStatus();
  }

  checkIntegrationStatus(): void {
    this.authService.checkStatus().subscribe((response: any) => {
      this.isLoading = false;
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
    this.authService.fetchOrganizationsAndRepos().subscribe(
      (data: any) => {
        this.organizations = data.repos.map((repo: any) => ({
          id: repo.id,
          name: repo.name,
          link: repo.html_url,
          slug: repo.full_name,
          included: true,
        }));
        this.rowData = [...this.organizations];

        console.log('Fetched organizations and repos:', this.organizations);
      },
      (error:any) => {
        console.error('Error fetching organizations and repos:', error);
      }
    );
  }

  fetchIncludedReposInfo(): void {
    const includedRows = this.rowData.filter((row) => row.included);
    const repos = includedRows.map((row) => row.slug.split('/')[1]);
    const owner = includedRows[0].slug.split('/')[0];
    this.authService.fetchRepositoryInfo(owner, repos).subscribe(
      (data:any) => {
        this.repoInfoRowData = data.map((repo: any) => ({
          repoName: repo.repo_name, 
          user_id: repo.user_id, 
          user: repo.user, 
          total_commits: repo.total_commits, 
          total_issues: repo.total_issues, 
          total_pull_requests: repo.total_pull_requests 
        }));
      },
      (error:any) => {
        console.error('Error fetching repository info:', error);
      }
    );
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
