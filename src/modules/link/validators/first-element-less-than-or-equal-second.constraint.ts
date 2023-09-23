import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'arrayElementsLessThanOrEqual', async: false })
export class FirstElementLessThanOrEqualSecondConstraint
  implements ValidatorConstraintInterface
{
  validate(array: number[]): boolean {
    return array[0] <= array[1];
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const { value } = validationArguments;
    return `First value ${value[0]} must be less then or equal second ${value[1]}`;
  }
}
