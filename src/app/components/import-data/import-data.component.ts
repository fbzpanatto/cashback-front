import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatButton, MatFabButton } from "@angular/material/button";
import { Router } from "@angular/router";
import { FetchService } from "../../services/fetch.service";
import { Register } from "../../interfaces/interfaces";
import { MatIcon } from "@angular/material/icon";

  @Component({
  selector: 'app-import-data',
  standalone: true,
  imports: [CommonModule, MatButton, MatFabButton, MatIcon],
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss', '../../styles/table.scss']
})
export class ImportDataComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;
  tableData: Register[] = [];

  #defaultCashBack?: number
  #defaultExpiration?: number

  #router = inject(Router);
  #fetch = inject(FetchService)

  ngOnInit(): void {
    this.defaultCashBack = this.#defaultCashBack ?? 0.05
    this.defaultExpiration = this.#defaultExpiration ?? 60
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.readFile(file);
    }
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const content = e.target.result as string;
      this.processFileContent(content);
    };
    reader.readAsText(file);
  }

  processFileContent(content: string) {
    this.tableData = content
      .split('\n')
      .filter(row => row.trim() !== '')
      .reduce((acc: Register[], prev) => {
        const el = prev.split(';')
        acc.push({
          id: el[0].trim(),
          name: el[1].trim(),
          tel: el[2].trim(),
          date: el[3].trim(),
          value: el[4].trim(),
          cashback: this.defaultCashBack,
          expiration: this.defaultExpiration
        })
        return acc
      }, [])
  }

  async importData() {
    const dataToPost = this.formatData(this.tableData)
    await this.#fetch.post(dataToPost)
    await this.#router.navigate(['/home'])
  }

  formatData(data: Register[]) {
    return this.setExpirationDate(data)
  }

  setExpirationDate(data: Register[]) {
    return data.map(item => {
      const dateParts = item.date.split('/'); // Assuming format is "DD/MM/YYYY"
      const fullDate = new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`);

      if (item.expiration) {
        fullDate.setDate(fullDate.getDate() + Number(item.expiration)); // Add expiration days
      }

      const expiration = `${fullDate.getDate().toString().padStart(2, '0')}/${(fullDate.getMonth() + 1).toString().padStart(2, '0')}/${fullDate.getFullYear()}`;

      return { ...item, expiration };
    });
  }

  get defaultExpiration() { return this.#defaultExpiration }
  set defaultExpiration(value: number | undefined) { this.#defaultExpiration = value }

  get defaultCashBack() { return this.#defaultCashBack }
  set defaultCashBack(value: number | undefined) { this.#defaultCashBack = value }
}
