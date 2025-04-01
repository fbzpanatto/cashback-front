import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Action } from "../../../interfaces/interfaces";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatCheckbox } from "@angular/material/checkbox";
import { FetchActionService } from "../../../services/fetch-action.service";

@Component({
  selector: 'app-action',
  imports: [
    FormsModule,
    MatButton,
    MatIcon,
    ReactiveFormsModule,
    MatCheckbox
  ],
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss', '../../../styles/input.scss', '../../../styles/form.scss']
})
export class ActionComponent implements OnInit {

  #original?: Action[]

  #fb = inject(FormBuilder);
  #fetchAction = inject(FetchActionService)

  #data?: Action[]

  form: FormGroup = this.#fb.group({})

  async ngOnInit() {
    this.data = await this.#fetchAction.getActions() as Action[]

    for(let item of this.data) {
      this.form?.addControl(String(item.day), new FormControl<number>(item.active))
    }

    this.#original = this.data
  }

  async onSubmit() {
    const diff = this.getDiff()
    await this.#fetchAction.putAction({ data: this.getDiff() })

    for(let item of diff) {
      this.form.get(String(item.day))?.patchValue(item.active)
      this.#original = this.#original?.map(el => {
        return el.day === item.day ? { ...el, active: item.active } : el
      })
    }

    this.form?.markAsPristine()
  }

  getDiff(): Action[] {
    if (!this.form || !this.data) { return [] }

    const formValue = this.form.value as Record<string, boolean>;
    const changesMap = new Map<string, number>(
      Object.entries(formValue).map(([key, value]) => [key, value ? 1 : 0])
    )

    return this.data.reduce((acc: Action[], item: Action) => {
      const newValue = changesMap.get(String(item.day));

      if (newValue !== undefined && newValue !== (item.active ? 1 : 0)) {
        acc.push({ ...item, active: newValue === 1 ? 1: 0 });
      }
      return acc;
    }, []);
  }

  resetValues() {
    this.form?.markAsPristine()
    if(!this.#original) { return }
    for(let item of this.#original) {
      this.form.get(String(item.day))?.patchValue(item.active)
    }
  }

  get data(){ return this.#data }
  set data(value){ this.#data = value }

  get formIsValid() { return this.form?.valid }
  get formIsPristine() { return this.form?.pristine }
}
