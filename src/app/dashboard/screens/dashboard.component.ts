import { Component, ViewChild, AfterViewInit, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../auth/services/auth.service';
import { User } from '@angular/fire/auth';
import { ProfileFormComponent } from '../components/profile-form/profile-form.component';

interface UserProfile {
  id: string;
  name: string;
  mobileNo: string;
  address: string;
  skills: string[];
  hobbies: string;
  photoUrl?: string;
  photoFile?: File;
}

@Component({
  selector: 'app-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    CommonModule,
    MatIconModule,
    MatOptionModule,
    MatButtonModule,
    MatSelectModule,
  ],
})
export class DashboardComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'photo',
    'name',
    'mobileNo',
    'address',
    'skills',
    'hobbies',
  ];
  dataSource: MatTableDataSource<UserProfile>;
  availableSkills: string[] = [
    'Angular',
    'React',
    'Vue',
    'JavaScript',
    'TypeScript',
    'HTML/CSS',
    'Node.js',
    'Python',
    'Java',
    'C#',
  ];

  readonly dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  user!: User;

  constructor(private _authService: AuthService) {
    this._authService.user.subscribe((user) => {
      if (user) this.user = user;
    });
    const mockUsers: UserProfile[] = [
      {
        id: '1',
        name: 'John Doe',
        mobileNo: '9876543210',
        address: '123 Main St, New York',
        skills: ['Angular', 'TypeScript'],
        hobbies: 'Reading, Hiking',
        photoUrl:
          'https://imgs.search.brave.com/SItJevoCA4ls70puLX1S9R5GGmpNLVUj4nlYaNsFIac/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmV0/c3lzdGF0aWMuY29t/LzIzMTI1MjIyL3Iv/aWwvNmYzNmQ3LzI4/NzcxMTUyNTEvaWxf/NjAweDYwMC4yODc3/MTE1MjUxXzFtaWcu/anBn',
      },
      {
        id: '2',
        name: 'Jane Smith',
        mobileNo: '8765432109',
        address: '456 Oak Ave, Boston',
        skills: ['React', 'JavaScript'],
        hobbies: 'Photography',
        photoUrl:
          'https://imgs.search.brave.com/SItJevoCA4ls70puLX1S9R5GGmpNLVUj4nlYaNsFIac/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmV0/c3lzdGF0aWMuY29t/LzIzMTI1MjIyL3Iv/aWwvNmYzNmQ3LzI4/NzcxMTUyNTEvaWxf/NjAweDYwMC4yODc3/MTE1MjUxXzFtaWcu/anBn',
      },
      {
        id: '3',
        name: 'Robert Johnson',
        mobileNo: '7654321098',
        address: '789 Pine Rd, Chicago',
        skills: ['Node.js', 'Python'],
        hobbies: 'Gaming, Cooking',
        photoUrl:
          'https://imgs.search.brave.com/SItJevoCA4ls70puLX1S9R5GGmpNLVUj4nlYaNsFIac/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmV0/c3lzdGF0aWMuY29t/LzIzMTI1MjIyL3Iv/aWwvNmYzNmQ3LzI4/NzcxMTUyNTEvaWxf/NjAweDYwMC4yODc3/MTE1MjUxXzFtaWcu/anBn',
      },
    ];

    this.dataSource = new MatTableDataSource(mockUsers);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openProfileForm() {
    // Logic to open the profile form modal or navigate to the profile form page
    console.log('Open Profile Form');
    const dialogRef = this.dialog.open(ProfileFormComponent, {
      width: '90%',
      maxWidth: '30rem',
    });
  }

  async logout() {
    console.log('User logged out');
    await this._authService.logout();
  }
}
