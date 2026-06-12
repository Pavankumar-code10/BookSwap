import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  booksSwapped: number = 0;
  activeReaders: number = 0;
  treesSaved: number = 0;

  protected readonly Math = Math;

  ngOnInit() {
    this.animateValue(0, 10000, 2000, (val) => this.booksSwapped = val);
    this.animateValue(0, 50000, 2500, (val) => this.activeReaders = val);
    this.animateValue(0, 2500, 2000, (val) => this.treesSaved = val);
  }

  animateValue(start: number, end: number, duration: number, callback: (val: number) => void) {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      callback(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
}
