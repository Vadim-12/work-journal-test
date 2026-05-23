import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

function todayDateString(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

@ValidatorConstraint({ name: 'IsNotFutureDate', async: false })
export class IsNotFutureDateValidator implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string' || !value) {
      return true;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }
    return value <= todayDateString();
  }

  defaultMessage(): string {
    return 'Дата выполнения не может быть в будущем';
  }
}
