import numeral from 'numeral';

export function formatMetric(
  value: any,
  numeralFormat: string,
  prefix: string = '',
  suffix: string = '',
) {
  if (value !== undefined && !isNaN(value)) {
    return `${prefix}${numeral(value).format(numeralFormat)}${suffix}`;
  }
  return '-';
}
