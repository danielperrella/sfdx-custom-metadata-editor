/* eslint-disable @typescript-eslint/naming-convention */
import { IOptions } from "js2xmlparser";
import { DescribeSObjectResult } from "jsforce/describe-result";
import { MyQueryResult, XmlObject, XmlValue } from ".";
var js2xmlparser = require("js2xmlparser");

const uselessField: string[] = ['Id', 'MasterLabel', 'Language', 'NamespacePrefix', 'QualifiedApiName', 'Label', 'DeveloperName', 'SystemModstamp'];

const options: IOptions = {
  format: { doubleQuotes: true },
  declaration: { encoding: 'UTF-8' }
};

export function generateXml(csvJsonValue: MyQueryResult, describeSobject: DescribeSObjectResult) {
  let xml: XmlObject = new XmlObject(csvJsonValue['Label']);
  // console.log('xml: ',xml);
  describeSobject.fields.forEach(element => {
    if (!uselessField.includes(element.name)) {
      xml.values.push(new XmlValue(element.name, element.soapType === "tns:ID" ? "xsd:string" : element.soapType, csvJsonValue[element.name]));
    }
  });
  return js2xmlparser.parse("CustomMetadata", fromXmlObjectToObj(xml), options);
}

function fromXmlObjectToObj(xmlObject: XmlObject): any {
  var obj = {
    "@": {
      'xmlns': "http://soap.sforce.com/2006/04/metadata",
      'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
      'xmlns:xsd': "http://www.w3.org/2001/XMLSchema"
    },
    label: xmlObject.Label,
    protected: "false",

    values: xmlObject.values
  };
  return obj;
}