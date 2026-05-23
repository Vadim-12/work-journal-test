import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsNotFutureDate', async: false })
export class IsNotFutureDateValidator implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string' || !value) {
      return true;
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return false;
    }
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date <= today;
  }

  defaultMessage(): string {
    return 'Дата выполнения не может быть в будущем';
  }
}
