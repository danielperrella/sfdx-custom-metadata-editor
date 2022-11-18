import * as vscode from "vscode";
import { AuthInfo, Connection, fs } from '@salesforce/core';
import { ConfigUtil } from './configUtil';
import { toCsv, toJson } from "./csvUtils";
import { MyQueryResult } from ".";
import { makeFileSync } from "./fsUtils";
import { generateXml } from "./xmlUtils";

export class PluginExtensionUtils {
  private projectPath!: string;
  private connection: Connection | undefined;
  private customMetadataOptionList: vscode.QuickPickItem[] = [];
  private selectedCmdt: string | undefined;
  private selectedFolder: string | undefined;
  private selectedFile: string | undefined;
  private uselessField: string[] = ['Id', 'MasterLabel', 'Language', 'NamespacePrefix', 'QualifiedApiName', 'SystemModstamp'];


  public constructor() {
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length === 1) {
      let root = vscode.workspace.workspaceFolders[0];
      this.projectPath = root.uri.fsPath;
    } else {
      vscode.window.showErrorMessage("Plugin Enabled Only in SFDX Folder");
    }
  }

  public async initializeConnection() {
    this.connection = await Connection.create({
      authInfo: await AuthInfo.create({
        username: await ConfigUtil.getUsername(this.projectPath)
      })
    });
  }

  public async populateCustomMetadataList() {
    const custMetList = await this.connection!.describeGlobal();
    custMetList.sobjects.forEach(element => {
      if (element.name.endsWith('__mdt')) {
        const option = {
          label: element.name
        };
        this.customMetadataOptionList.push(option);
      }
    });
    console.log('Custom Metadata Editor - READY TO FIRE');
  }

  public async chooseCmdt() {
    const choosenCmdt = await vscode.window.showQuickPick(this.customMetadataOptionList);
    if (choosenCmdt === undefined) {
      throw new Error("You Must Choose a Value");
    }
    this.selectedCmdt = choosenCmdt.label;
  }

  public async chooseFolder() {
    const folder = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      openLabel: 'Choose Output Folder'
    } as vscode.OpenDialogOptions);

    if (folder && folder.length === 1) {
      this.selectedFolder = folder[0].fsPath;
    }
    else {
      throw new Error("You Must Choose a Folder");
    }
  }

  public async chooseFile() {
    const file = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      openLabel: 'Choose File to Import'
    } as vscode.OpenDialogOptions);

    if (file) {
      this.selectedFile = file[0].fsPath;
    }
    else {
      throw new Error("You Must Choose a File");
    }
  }

  public async exportCmdt() {
    try {
      const describe = await this.connection?.describe(this.selectedCmdt!);
      let fieldToQuery: string[] = [];
      describe?.fields.forEach(element => {
        if (!this.uselessField.includes(element.name)) {
          if (element.type === 'reference') {
            fieldToQuery.push(element.relationshipName + '.DeveloperName');
          } else {
            fieldToQuery.push(element.name);
          }
        }
      });
      const query = `SELECT ${fieldToQuery.join(', ')} FROM ${this.selectedCmdt}`;
      console.log('exportCmdt - query:',query);
      const queryResult = await this.connection?.autoFetchQuery(query);
      if (queryResult?.done && queryResult.records.length !== 0) {
        let records: MyQueryResult[] = queryResult.records as unknown as MyQueryResult[];
        records.forEach(record => {
          delete record.attributes;
          Object.keys(record).forEach((key: keyof MyQueryResult) => {
            const stringkey: string = key as string;
            if (stringkey.endsWith('__r')) {
              const newkey = stringkey.slice(0, -1) + 'c';
              const devName = record[key].DeveloperName;
              delete record[key];
              record[newkey] = devName;
            }
            else if (record[key] === null) {
              record[key] = '';
            }
          });
        });
        const csvValue = toCsv(records);
        makeFileSync(`${this.selectedFolder}\\${this.selectedCmdt}.csv`, csvValue);
      }
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  public async importCmdt() {
    try {
      let json: MyQueryResult[] = await toJson(this.selectedFile!) as MyQueryResult[];
      const describe = await this.connection?.describe(this.selectedCmdt!);
  
      json.forEach(element => {
        const xml = generateXml(element, describe!);
        makeFileSync(`${this.projectPath}\\force-app\\main\\default\\customMetadata\\${this.selectedCmdt?.slice(0, -5)}.${element.DeveloperName}.md-meta.xml`, xml);
      });
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  // https://github.com/forcedotcom/cli/issues/1425
  // public async createCmdtFromCsv(): Promise<void> {
  //     const execution = new CliCommandExecutor(
  //         new SfdxCommandBuilder()
  //             .withArg('force:cmdt:record:insert')
  //             .withFlag('--filepath', this.selectedFile!)
  //             .withFlag('--typename', this.selectedCmdt!)
  //             .withFlag('--namecolumn', 'DeveloperName')
  //             .build(),
  //         { cwd: this.projectPath }
  //     ).execute();
  //     const cmdOutput = new CommandOutput();
  //     await cmdOutput.getCmdResult(execution);
  //     return Promise.resolve();
  // }
}