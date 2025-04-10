import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../services/loading.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [ CommonModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {

  #condition?: boolean = false;

  public loadingService = inject(LoadingService);

  constructor() {
    effect(() => {
      this.condition = this.loadingService.loadingSignal();
    });
  }

  cancelRequest() {
    this.loadingService.cancelRequest();
  }

  get condition() { return this.#condition }

  set condition(value: boolean | undefined) { this.#condition = value }

}
