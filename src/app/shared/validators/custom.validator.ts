import { ValidatorFn, FormControl } from '@angular/forms';

export class CustomValidators {

  static number(params: any = {}): ValidatorFn {
    return (control: FormControl): {[key: string]: boolean} => {

      const val: number = control.value;

      if (isNaN(val)) {
        return { number: true };
      }

      if (!isNaN(params.min) && val < params.min) {
        return { number: true };
      }

      if (!isNaN(params.max) && val > params.max) {
        return { number: true };
      }

      return null;
    };
  }
}
