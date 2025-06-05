import * as vscode from "vscode";
import { Connection, clusterApiUrl, PublicKey, Cluster } from "@solana/web3.js";
import getWebviewContent from "./webview";
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "sol-check" is now active!');
  let connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const signatureInfoCommand = vscode.commands.registerCommand(
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
  const tokenInfoCommand = vscode.commands.registerCommand(
    "sol-check.lookupToken",
    async () => {
      const mint = await vscode.window.showInputBox({
        prompt: "Enter Token Mint Address",
        placeHolder: "Eg: So11111111111111111111111111111111111111112",
      });

      if (!mint) {
        vscode.window.showErrorMessage("No mint address provided.");
        return;
      }

      try {
        const tokenInfo = await connection.getParsedAccountInfo(
          new PublicKey(mint)
        );

        if (!tokenInfo || !tokenInfo.value) {
          vscode.window.showErrorMessage("Token not found.");
          return;
        }

        const panel = vscode.window.createWebviewPanel(
          "tokenInfo",
          "Solana Token Info",
          vscode.ViewColumn.One,
          { enableScripts: true }
        );

        panel.webview.html = getWebviewContent(mint, tokenInfo.value);
      } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error}`);
      }
    }
  );
  const changeClusterCommand = vscode.commands.registerCommand(
    "sol-check.changeCluster",
    async () => {
      const cluster = await vscode.window.showQuickPick(
        ["devnet", "testnet", "mainnet-beta"],
        {
          placeHolder: "Select Solana Cluster",
        }
      );
      if (!cluster) {
        vscode.window.showErrorMessage("No cluster selected.");
        return;
      }
      connection = new Connection(
        clusterApiUrl(cluster as Cluster),
        "confirmed"
      );
    }
  );
  const showClusterCommand = vscode.commands.registerCommand(
    "sol-check.showCluster",
    async () => {
      const currentCluster = connection.rpcEndpoint;
      vscode.window.showInformationMessage(
        `Current Solana Cluster: ${currentCluster}`
      );
    }
  );

  context.subscriptions.push(
    tokenInfoCommand,
    signatureInfoCommand,
    changeClusterCommand,
    showClusterCommand
  );
}

export function deactivate() {}
