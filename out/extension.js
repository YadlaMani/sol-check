"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const web3_js_1 = require("@solana/web3.js");
function activate(context) {
    console.log('Congratulations, your extension "sol-check" is now active!');
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
    const disposable = vscode.commands.registerCommand("sol-check.lookupSignature", async () => {
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
            const panel = vscode.window.createWebviewPanel("solanaExplorer", "Solana Signature Details", vscode.ViewColumn.One, { enableScripts: true });
            panel.webview.html = getWebviewContent(signature, tx);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to fetch transaction: ${error}`);
        }
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
function getWebviewContent(signature, tx) {
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
//# sourceMappingURL=extension.js.map