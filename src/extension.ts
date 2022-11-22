import * as vscode from 'vscode';
import { PluginExtensionUtils } from './vscodeFunction';

export async function activate(context: vscode.ExtensionContext) {

  try {
    console.log('Custom Metadata Editor Activated');

    // ---- Initialization START ---- //
    let utils = new PluginExtensionUtils();
    await utils.initializeConnection();
    await utils.populateCustomMetadataList();
    // ---- Initialization END ---- //


    // ---- Import START ---- //
    context.subscriptions.push(
      vscode.commands.registerCommand('sfdx-custom-metadata-editor.import', async () => {
        utils.chooseCmdt()
          .then(() => utils.chooseFile())
          .then(() => vscode.window.withProgress({
            cancellable: true,
            location: vscode.ProgressLocation.Notification,
            title: 'Building Files...',
          }, async () => {
            await utils.importCmdt();
          }));
      })
    );
    // ---- Import END ---- //

    // ---- Export START ---- //
    context.subscriptions.push(
      vscode.commands.registerCommand('sfdx-custom-metadata-editor.export', async () => {
        utils.chooseCmdt()
          .then(() => utils.chooseFolder())
          .then(() => vscode.window.withProgress({
            cancellable: true,
            location: vscode.ProgressLocation.Notification,
            title: 'Building Csv...',
          }, async () => {
            await utils.exportCmdt();
          }));
      })
    );
    // ---- Export END ---- //

    // ---- Refresh START ---- //
    context.subscriptions.push(
      vscode.commands.registerCommand('sfdx-custom-metadata-editor.refresh', async () => {
        vscode.window.withProgress({
          cancellable: true,
          location: vscode.ProgressLocation.Notification,
          title: 'Refreshing Custom Metadata Definitions...',
        }, async () => {
          utils = new PluginExtensionUtils();
          await utils.initializeConnection();
          await utils.populateCustomMetadataList();
        });
      })
    );
    // ---- Refresh END ---- //

  } catch (error) {
    console.log('Custom Metadata Editor ERROR: ', error);
  }

}

export function deactivate() {
  console.log('Custom Metadata Editor Deactivated');
}
