import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule, NzInputModule, NzIconModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  @Output() searchChange = new EventEmitter<string>();

  searchText = '';

  onSearchChange(): void {
    this.searchChange.emit(this.searchText);
  }
}

