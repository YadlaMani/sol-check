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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const web3_js_1 = require("@solana/web3.js");
const webview_1 = __importDefault(require("./webview"));
function activate(context) {
    console.log('Congratulations, your extension "sol-check" is now active!');
    let connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
    const signatureInfoCommand = vscode.commands.registerCommand("sol-check.lookupSignature", async () => {
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
            panel.webview.html = (0, webview_1.default)(signature, tx);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to fetch transaction: ${error}`);
        }
    });
    const tokenInfoCommand = vscode.commands.registerCommand("sol-check.lookupToken", async () => {
        const mint = await vscode.window.showInputBox({
            prompt: "Enter Token Mint Address",
            placeHolder: "Eg: So11111111111111111111111111111111111111112",
        });
        if (!mint) {
            vscode.window.showErrorMessage("No mint address provided.");
            return;
        }
        try {
            const tokenInfo = await connection.getParsedAccountInfo(new web3_js_1.PublicKey(mint));
            if (!tokenInfo || !tokenInfo.value) {
                vscode.window.showErrorMessage("Token not found.");
                return;
            }
            const panel = vscode.window.createWebviewPanel("tokenInfo", "Solana Token Info", vscode.ViewColumn.One, { enableScripts: true });
            panel.webview.html = (0, webview_1.default)(mint, tokenInfo.value);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });
    const changeClusterCommand = vscode.commands.registerCommand("sol-check.changeCluster", async () => {
        const cluster = await vscode.window.showQuickPick(["devnet", "testnet", "mainnet-beta"], {
            placeHolder: "Select Solana Cluster",
        });
        if (!cluster) {
            vscode.window.showErrorMessage("No cluster selected.");
            return;
        }
        connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)(cluster), "confirmed");
    });
    const showClusterCommand = vscode.commands.registerCommand("sol-check.showCluster", async () => {
        const currentCluster = connection.rpcEndpoint;
        vscode.window.showInformationMessage(`Current Solana Cluster: ${currentCluster}`);
    });
    context.subscriptions.push(tokenInfoCommand, signatureInfoCommand, changeClusterCommand, showClusterCommand);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map