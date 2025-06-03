import * as vscode from "vscode";
import { Connection, clusterApiUrl } from "@solana/web3.js";
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "sol-check" is now active!');
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const disposable = vscode.commands.registerCommand(
    "sol-check.lookupSignature",
    async () => {
      const signature = await vscode.window.showInputBox({
        prompt: "Enter Solana Transaction Signature",
        placeHolder: "Eg: 5YyUjzZzj7c....",
      });

      if (!signature) {
        vscode.window.showErrorMessage("No signature provided.");
        return;
      }

      try {
        const tx = await connection.getTransaction(signature, {
          maxSupportedTransactionVersion: 0,
        });

        if (!tx) {
          vscode.window.showErrorMessage("Transaction not found.");
          return;
        }

        const panel = vscode.window.createWebviewPanel(
          "solanaExplorer",
          "Solana Signature Details",
          vscode.ViewColumn.One,
          { enableScripts: true }
        );

        panel.webview.html = getWebviewContent(signature, tx);
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to fetch transaction: ${error}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
function getWebviewContent(signature: string, tx: any): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Solana Transaction</title>
      <style>
        body {
          font-family: monospace;
          background-color: #1e1e1e;
          color: #d4d4d4;
          padding: 20px;
        }
        pre {
          background-color: #2d2d2d;
          padding: 15px;
          overflow-x: auto;
          border-radius: 8px;
        }
      </style>
    </head>
    <body>
      <h2>Transaction Signature</h2>
      <p><code>${signature}</code></p>
      <h2>Transaction Details</h2>
      <pre>${JSON.stringify(tx, null, 2)}</pre>
    </body>
    </html>
  `;
}
