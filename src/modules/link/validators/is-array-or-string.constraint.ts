import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isArrayOrString', async: false })
export class IsArrayOrStringConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (typeof value === 'string' || Array.isArray(value)) {
      return true;
    }
    return false;
  }

  defaultMessage() {
    return 'Status should be either a string or an array of strings.';
  }
}
