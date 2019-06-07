import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-bar',
  templateUrl: './loadingBar.component.html',
  styleUrls: ['./loadingBar.component.css']
})

export class LoadingBarComponent {
  @Input() value: number;
  @Input() message: string;

  constructor() {
  }
}

