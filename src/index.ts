/* eslint-disable @typescript-eslint/naming-convention */
export interface MyQueryResult {
  attributes?: Attributes;
  DeveloperName: string;
  Label: string;
  [key: string]: any | MyQueryResult;
}

export interface Attributes {
  type: string;
  url: string;
}

export interface Command {
  readonly command: string;
  readonly description?: string;
  readonly args: string[];
  readonly logName?: string;

  toString(): string;
  toCommand(): string;
}


export class XmlObject {
  Label: string;
  values: XmlValue[];
  constructor(Label: string) {
    this.Label = Label;
    this.values = [];
  }
}

export class XmlValue {
  field: string;
  value: object;
  constructor(fieldname: string, fieldtype: string, fieldvalue: string) {
    this.field = fieldname;
    this.value = setValue(fieldtype, fieldvalue);
  }
}

function setValue(fieldtype: string, fieldvalue: string) {
  const valueFilled = {
    "@": {
      'xsi:type': fieldtype,
    },
    "#": fieldvalue,
  };
  const valueNulled = {
    "@": {
      'xsi:nil': 'true',
    },
    "#": "",
  };
  if (fieldvalue !== '') {
    return valueFilled;
  }
  return valueNulled;
}