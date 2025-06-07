# Sol-Check

**Sol-Check** is a Visual Studio Code extension that supercharges your Solana development workflow. Instantly view transaction details and token mint information directly in your editor—no need to open Solscan or other explorers. Whether you're debugging, auditing, or building dApps, Sol-Check helps you get real-time insights into Solana transactions and tokens, right inside VS Code.

---

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view (`Ctrl+Shift+X`).
3. Search for `Sol-Check`.
4. Click **Install**.

---

## Usage

- Open the command palette (`Ctrl+Shift+P`).
- Search for and run any `Sol-Check` command (see below).
- Enter a Solana transaction signature or token mint address when prompted.
- View transaction or token details in a webview panel inside VS Code.

---

## Commands

| Command                        | Description                                               |
| ------------------------------ | --------------------------------------------------------- |
| `Solana: Lookup Signature`     | Enter a transaction signature to view transaction details |
| `Solana: Lookup Token`         | Enter a token mint address to view token info             |
| `Solana: Change Cluster`       | Switch between devnet, testnet, and mainnet-beta          |
| `Solana: Show Current Cluster` | Show the currently selected Solana cluster                |

---

## What Does It Do?

- **Transaction Lookup:** Instantly fetch and display Solana transaction details (status, fee, accounts, instructions, etc.) by entering a transaction signature.
- **Token Lookup:** View parsed token mint information by entering a token mint address.
- **Cluster Switching:** Easily switch between Solana clusters (devnet, testnet, mainnet-beta) for your queries.
- **All results are shown in a rich, interactive webview panel inside VS Code.**

---

## Links

- [GitHub Repository](https://github.com/YadlaMani/sol-check) – Star, fork, or contribute!
- [Twitter](https://x.com/mani_yadla_) – Report bugs, suggest features, or just say hi!

---

## License

This project is licensed under the MIT License.
