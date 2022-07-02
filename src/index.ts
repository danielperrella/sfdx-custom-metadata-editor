export interface MyQueryResult {
  attributes?: Attributes;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  DeveloperName: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Label: string;
  values: XmlValue[];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  constructor(Label: string) {
    this.Label = Label;
    this.values = [];
  }
}

export class XmlValue {
  field: string;
  value: object;
  constructor(fieldname: string, fieldtype: string, fieldvalue: string) {
    // console.log('fieldname',fieldname);
    // console.log('fieldvalue',fieldvalue,' type: ',typeof fieldvalue);
    // console.log('fieldtype',fieldtype);
    // console.log('---------------');
    this.value = setValue(fieldtype, fieldvalue);
    this.field = fieldname;
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