import {
  Component,
  ViewChild,
  AfterViewInit,
  inject,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../auth/services/auth.service';
import { User } from '@angular/fire/auth';
import { ProfileFormComponent } from '../components/profile-form/profile-form.component';
import { ProfileFormResponse, UserProfile } from '../lib/types';
import { ProfileDataService } from '../services/profile-data.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
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
    MatProgressSpinnerModule,
  ],
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'photo',
    'name',
    'mobileNo',
    'address',
    'skills',
    'hobbies',
  ];
  dataSource: MatTableDataSource<UserProfile> =
    new MatTableDataSource<UserProfile>([]);
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

  private destroy$ = new Subject<void>();
  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  user!: User;
  loading = true;

  constructor(
    private _authService: AuthService,
    private _profileService: ProfileDataService,
    private cdr: ChangeDetectorRef
  ) {
    this._authService.user.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.user = user;

        // ✅ Defer loading profile until after initial change detection
        setTimeout(() => this.loadUserProfile());
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'skills':
          return item.skills.join(', ');
        default:
          return (item as any)[property];
      }
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserProfile() {
    this.loading = true;
    if (!this.user?.uid) {
      this.dataSource.data = [];
      this.loading = false;
      this.cdr.detectChanges(); // Safe to notify Angular
      return;
    }

    this._profileService
      .getProfileUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profiles: UserProfile[]) => {
          if (profiles && profiles.length) {
            this.dataSource.data = profiles.map((profile: any) => ({
              id: profile.id,
              name: profile.name,
              mobileNo: profile.mobileNo,
              address: profile.address,
              skills: profile.skills,
              hobbies: profile.hobbies,
              photoUrl: profile.photoUrl,
              lastUpdated: profile.lastUpdated,
            }));
          } else {
            this.dataSource.data = [];
          }

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Failed to load profile', error);
          this.snackBar.open('Failed to load profile data', 'Close', {
            duration: 3000,
          });
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openProfileForm() {
    const currentProfile = this.dataSource.data[0] || null;

    const dialogRef = this.dialog.open(ProfileFormComponent, {
      width: '90%',
      maxWidth: '30rem',
      data: {
        profile: currentProfile,
        skills: this.availableSkills,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: ProfileFormResponse) => {
        if (result) {
          this.loading = true;
          this._profileService
            .createProfileUser(result)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.snackBar.open('Profile saved successfully!', 'Close', {
                  duration: 3000,
                });
                this.loadUserProfile();
              },
              error: (error) => {
                console.error('Error saving profile', error);
                this.snackBar.open('Failed to save profile', 'Close', {
                  duration: 3000,
                });
                this.loading = false;
                this.cdr.detectChanges();
              },
            });
        }
      });
  }

  async logout() {
    await this._authService.logout();
  }
}
