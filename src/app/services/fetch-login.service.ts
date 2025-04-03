import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from "rxjs";
import { Credentials, ErrorI, SuccessPostI } from "../interfaces/interfaces";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FetchLoginService {

  #http = inject(HttpClient)

  async saveData(body: Partial<Credentials>): Promise<void> {

    const response = await firstValueFrom(
      this.#http.post<SuccessPostI | ErrorI>(`${environment.API_URL}${environment.LOGIN}`, body)
    )

    if((response as ErrorI).error) {
      return console.error('errorHandler', response)
    }
  }
}
