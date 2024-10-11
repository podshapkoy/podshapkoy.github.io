import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit, OnDestroy {
  currentTime: string = '';
  private intervalId: any;

  constructor() { }

  ngOnInit(): void {
    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  updateTime(): void {
    const now: Date = new Date();
    this.currentTime = now.toLocaleTimeString() + ' ' + now.toLocaleDateString();
  }
}
