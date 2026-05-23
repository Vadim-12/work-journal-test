import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

interface DateRangeObject {
  dateFrom?: string;
  dateTo?: string;
}

@ValidatorConstraint({ name: 'DateRange', async: false })
export class DateRangeValidator implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments): boolean {
    const { dateFrom, dateTo } = args.object as DateRangeObject;
    if (!dateFrom || !dateTo) {
      return true;
    }
    return dateFrom <= dateTo;
  }

  defaultMessage(): string {
    return 'dateFrom не может быть позже dateTo';
  }
}
