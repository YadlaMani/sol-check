function formatTransactionDetails(sig: string, tx: any): string {
  const blockTime = tx.blockTime
    ? new Date(tx.blockTime * 1000).toLocaleString()
    : "N/A";
  const status = tx.meta?.err ? "Failed ❌" : "Success ✅";
  const fee = tx.meta?.fee ?? 0;

  const accounts = tx.transaction.message.accountKeys.map(
    (k: any) => k.pubkey || k.toBase58()
  );

  const instructions = tx.transaction.message.instructions
    .map(
      (ix: any, i: number) => `
    <pre><strong>Instruction ${i + 1}</strong>
${JSON.stringify(ix, null, 2)}</pre>
  `
    )
    .join("");

  return `
    <section>
      <h2>Signature</h2>
      <p id="sig">${sig}</p>
      <button class="copy-btn" data-target="sig">Copy</button>
      <p><a href="https://explorer.solana.com/tx/${sig}?cluster=devnet" target="_blank">View on Explorer ↗</a></p>
    </section>

    <section>
      <h2>Status</h2>
      <p>${status}</p>
    </section>

    <section>
      <h2>Block Time</h2>
      <p>${blockTime}</p>
    </section>

    <section>
      <h2>Fee</h2>
      <p>${fee} lamports</p>
    </section>

    <section>
      <h2>Accounts Involved</h2>
      <ul>
        ${accounts
          .map(
            (acc: string) =>
              `<li><code>${acc}</code> - <a href="https://explorer.solana.com/address/${acc}?cluster=devnet" target="_blank">View ↗</a></li>`
          )
          .join("")}
      </ul>
    </section>

    <section>
      <h2>Instructions</h2>
      ${instructions}
    </section>
  `;
}
function formatTokenDetails(mint: string, data: any): string {
  const parsed = data.data?.parsed?.info || {};
  return `
    <section>
      <h2>Token Mint Address</h2>
      <p id="mint">${mint}</p>
      <button class="copy-btn" data-target="mint">Copy</button>
      <p><a href="https://explorer.solana.com/address/${mint}?cluster=devnet" target="_blank">View on Explorer ↗</a></p>
    </section>

    <section>
      <h2>Token Info</h2>
      <pre>${JSON.stringify(parsed, null, 2)}</pre>
    </section>
  `;
}

export default function getWebviewContent(id: string, data: any): string {
  const isTx = !!data.transaction;
  const details = isTx
    ? formatTransactionDetails(id, data)
    : formatTokenDetails(id, data);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Solana ${isTx ? "Transaction" : "Token"} Info</title>
      <style>
        body {
          font-family: "Segoe UI", sans-serif;
          background: #1e1e1e;
          color: #ffffff;
          padding: 1rem 2rem;
        }
        section {
          margin-bottom: 1.5rem;
        }
        h2 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }
        p, code, a {
          color: #d4d4d4;
          word-break: break-word;
        }
        pre {
          background: #2d2d2d;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
        }
        .copy-btn {
          background: #007acc;
          color: white;
          border: none;
          padding: 4px 10px;
          border-radius: 4px;
          cursor: pointer;
          margin-left: 10px;
        }
      </style>
    </head>
    <body>
      ${details}
      <script>
        document.querySelectorAll(".copy-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const targetId = btn.dataset.target;
            const text = document.getElementById(targetId).textContent;
            navigator.clipboard.writeText(text);
            btn.textContent = "Copied!";
            setTimeout(() => btn.textContent = "Copy", 1500);
          });
        });
      </script>
    </body>
    </html>
  `;
}
