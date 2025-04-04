import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from "./components/top-bar/top-bar.component";
import { AuthService } from "./services/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopBarComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  #auth = inject(AuthService)

  ngOnInit(): void {
    if (!this.#auth.validToken) {
      this.#auth.isAuthenticated = false;
      this.#auth.isAuthSubject.next(this.#auth.isAuthenticated);
    }
  }

  get isAuthenticated() { return this.#auth.isAuthAsObservable$ }
}
