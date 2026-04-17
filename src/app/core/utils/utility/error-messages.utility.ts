export enum ControlErrors {
  required = 'Campo requerido',
  pattern = 'Formato inválido',
  max = 'Valor máximo de',
  min = 'Valor mínimo de',
}

export function getControlErrorMessage(control: any): string {
  const error = control?.errors;

  let errorMessage = '';

  if (error?.required) {
    errorMessage = ControlErrors.required;
  }

  if (error?.max) {
    errorMessage = ControlErrors.max + ' ' + error?.max?.max;
  }

  if (error?.min) {
    errorMessage = ControlErrors.min + ' ' + error?.min?.min;
  }

  if (error?.pattern) {
    errorMessage = ControlErrors.pattern;
  }

  return errorMessage;
}
