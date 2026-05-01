import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private mockUsers: User[] = [
    { id: 1, name: 'أحمد محمد', avatar: 'assets/avatars/avatar1.png' },
    { id: 2, name: 'سارة خالد', avatar: 'assets/avatars/avatar2.png' },
    { id: 3, name: 'عمر عبدالله', avatar: 'assets/avatars/avatar3.png' },
    { id: 4, name: 'فاطمة علي', avatar: 'assets/avatars/avatar4.png' },
    { id: 5, name: 'محمد النجار', avatar: 'assets/avatars/avatar2.png' }, // reusing avatars
    { id: 6, name: 'نورة سالم', avatar: 'assets/avatars/avatar1.png' },
    { id: 7, name: 'خالد يوسف', avatar: 'assets/avatars/avatar3.png' },
    { id: 8, name: 'ليلى حمد', avatar: 'assets/avatars/avatar4.png' }
  ];

  searchUsers(query: string): Observable<User[]> {
    if (!query || query.trim() === '') {
      return of(this.mockUsers);
    }
    
    const lowerQuery = query.toLowerCase().trim();
    const filtered = this.mockUsers.filter(u => u.name.toLowerCase().includes(lowerQuery));
    
    return of(filtered);
  }

  getUsersByIds(ids: number[]): Observable<User[]> {
    return of(this.mockUsers.filter(u => ids.includes(u.id)));
  }
}
