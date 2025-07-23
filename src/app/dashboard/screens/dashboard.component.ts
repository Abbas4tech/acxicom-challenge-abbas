import { Component, ViewChild, AfterViewInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
    ReactiveFormsModule,
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
  selectedFile: File | null = null;
  dataSource: MatTableDataSource<UserProfile>;
  profileForm: FormGroup;
  showForm = false;
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder) {
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
    this.profileForm = this.createForm();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', Validators.required],
      skills: [[], Validators.required],
      hobbies: ['', Validators.required],
      photo: ['', Validators.required],
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.profileForm.patchValue({ photo: file });
      this.profileForm.get('photo')?.updateValueAndValidity();
    }
  }

  addUser() {
    if (this.profileForm.valid && this.selectedFile) {
      const newUser: UserProfile = {
        id: (this.dataSource.data.length + 1).toString(),
        ...this.profileForm.value,
        photoUrl: URL.createObjectURL(this.selectedFile),
        photoFile: this.selectedFile,
      };

      this.dataSource.data = [...this.dataSource.data, newUser];
      this.resetForm();
      this.showForm = false;
    }
  }

  resetForm() {
    this.profileForm.reset();
    this.profileForm.markAsUntouched();
    this.selectedFile = null;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  logout() {
    console.log('User logged out');
  }
}
