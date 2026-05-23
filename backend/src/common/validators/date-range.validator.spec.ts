import { DateRangeValidator } from './date-range.validator';

describe('DateRangeValidator', () => {
  const validator = new DateRangeValidator();

  it('пропускает пустой диапазон', () => {
    expect(validator.validate(undefined, { object: {} } as never)).toBe(true);
  });

  it('пропускает корректный диапазон', () => {
    expect(
      validator.validate(undefined, {
        object: { dateFrom: '2026-05-01', dateTo: '2026-05-31' },
      } as never),
    ).toBe(true);
  });

  it('отклоняет dateFrom позже dateTo', () => {
    expect(
      validator.validate(undefined, {
        object: { dateFrom: '2026-05-31', dateTo: '2026-05-01' },
      } as never),
    ).toBe(false);
  });
});
