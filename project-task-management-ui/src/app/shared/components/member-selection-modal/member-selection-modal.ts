import { Component, OnInit, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CustomButton } from '../custom-button/custom-button';
import { User } from '../../../core/models/user';
import { UserService } from '../../../core/services/user.service';

export interface MemberSelectionData {
  selectedUserIds: number[];
}

@Component({
  selector: 'app-member-selection-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzIconModule,
    NzCheckboxModule,
    NzListModule,
    NzSpinModule,
    CustomButton
  ],
  templateUrl: './member-selection-modal.html',
  styleUrl: './member-selection-modal.css'
})
export class MemberSelectionModal implements OnInit, OnDestroy {
  searchQuery = '';
  users: User[] = [];
  isLoading = false;
  
  // Set to keep track of selected user IDs efficiently
  selectedUserIds = new Set<number>();
  
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) private data: MemberSelectionData,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    if (data && data.selectedUserIds) {
      data.selectedUserIds.forEach(id => this.selectedUserIds.add(id));
    }
  }

  ngOnInit(): void {
    // Setup debounce search
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(query => {
        this.isLoading = true;
        this.cdr.detectChanges();
        return this.userService.searchUsers(query);
      })
    ).subscribe({
      next: (results) => {
        this.users = results;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error searching users', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

    // Initial load
    this.searchSubject.next('');
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  toggleSelection(userId: number): void {
    if (this.selectedUserIds.has(userId)) {
      this.selectedUserIds.delete(userId);
    } else {
      this.selectedUserIds.add(userId);
    }
    this.cdr.detectChanges();
  }

  isSelected(userId: number): boolean {
    return this.selectedUserIds.has(userId);
  }

  cancel(): void {
    this.modalRef.destroy(null);
  }

  confirm(): void {
    // Get the actual User objects for the selected IDs
    const selectedUsers = this.users.filter(u => this.selectedUserIds.has(u.id));
    
    // We should also handle users that might not be in the current search results
    // For a complete implementation, we'd fetch them or pass the full user objects in data
    // For now, returning the selected IDs is safest to let the parent handle it
    this.modalRef.destroy(Array.from(this.selectedUserIds));
  }
}
