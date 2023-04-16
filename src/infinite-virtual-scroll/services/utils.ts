import { SimpleChange } from '@angular/core';

export function inputPropChanged(prop: SimpleChange): boolean {
  return prop && prop.currentValue !== undefined;
}
