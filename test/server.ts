const CLURA_URL = "http://localhost:8000";
const PORT = 4000;

const html = (body: string) =>
  new Response(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Clura Test App</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #0a0a0a; color: #e5e5e5; min-height: 100vh; padding: 32px 24px; }
    h1 { font-size: 1.25rem; font-weight: 600; margin-bottom: 24px; color: #fff; }
    h2 { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #737373; margin-bottom: 8px; }
    .card { background: #141414; border: 1px solid #262626; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    pre { background: #0a0a0a; border: 1px solid #262626; border-radius: 8px; padding: 12px; font-size: 0.75rem; overflow-x: auto; white-space: pre-wrap; word-break: break-all; color: #a3a3a3; max-height: 220px; overflow-y: auto; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; margin-bottom: 12px; }
    .badge.ok { background: #14532d; color: #4ade80; }
    .badge.err { background: #450a0a; color: #f87171; }
    input { width: 100%; background: #0a0a0a; border: 1px solid #404040; border-radius: 8px; padding: 8px 12px; color: #e5e5e5; font-size: 0.8rem; margin-bottom: 8px; outline: none; }
    input:focus { border-color: #737373; }
    button { background: #fff; color: #000; border: none; border-radius: 8px; padding: 8px 16px; font-size: 0.8rem; font-weight: 600; cursor: pointer; margin-right: 8px; margin-top: 4px; }
    button:hover { opacity: 0.85; }
    button.secondary { background: #262626; color: #e5e5e5; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .full { grid-column: 1 / -1; }
    .result { margin-top: 12px; }
    .tag { font-size: 0.7rem; color: #737373; margin-bottom: 4px; }
    @media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  ${body}
  <script>
    function decodeJwt(token) {
      try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        return JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      } catch { return null; }
    }

    function copy(text, btn) {
      navigator.clipboard.writeText(text);
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = orig, 1500);
    }

    async function verifyToken(tokenId) {
      const token = document.getElementById(tokenId)?.value;
      const resultId = tokenId + '_verify';
      document.getElementById(resultId).innerHTML = '<span style="color:#737373">Verifying…</span>';
      try {
        const jwks = await fetch('${CLURA_URL}/.well-known/jwks.json').then(r => r.json());
        const payload = decodeJwt(token);
        const exp = payload?.exp;
        const now = Math.floor(Date.now() / 1000);
        const expired = exp && exp < now;
        const expStr = exp ? new Date(exp * 1000).toLocaleString() : 'N/A';
        document.getElementById(resultId).innerHTML =
          '<span class="badge ' + (expired ? 'err' : 'ok') + '">' +
          (expired ? 'EXPIRED' : 'VALID (signature not checked client-side — use server)') +
          '</span>' +
          '<div class="tag">Expires: ' + expStr + '</div>' +
          '<pre>' + JSON.stringify(payload, null, 2) + '</pre>';
      } catch(e) {
        document.getElementById(resultId).innerHTML = '<span class="badge err">ERROR: ' + e.message + '</span>';
      }
    }

    async function doExchange() {
      const code = document.getElementById('code_input').value;
      const app_secret = document.getElementById('app_secret_input').value;
      const resultEl = document.getElementById('exchange_result');
      resultEl.innerHTML = '<span style="color:#737373">Exchanging…</span>';
      try {
        const res = await fetch('${CLURA_URL}/v1/global-auth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, app_secret }),
        });
        const data = await res.json();
        if (!res.ok) {
          resultEl.innerHTML = '<span class="badge err">ERROR ' + res.status + '</span><pre>' + JSON.stringify(data, null, 2) + '</pre>';
          return;
        }
        resultEl.innerHTML = '<span class="badge ok">SUCCESS — tokens issued</span>';
        document.getElementById('id_token_input').value = data.id_token ?? '';
        document.getElementById('access_token_input').value = data.access_token ?? '';
        document.getElementById('refresh_token_input').value = data.refresh_token ?? '';
        document.getElementById('refresh_secret_input').value = app_secret;
        document.getElementById('id_token_card').style.display = '';
        document.getElementById('access_token_card').style.display = '';
        document.getElementById('refresh_card').style.display = '';
      } catch(e) {
        resultEl.innerHTML = '<span class="badge err">NETWORK ERROR: ' + e.message + '</span>';
      }
    }

    async function doRefresh() {
      const refresh_token = document.getElementById('refresh_token_input').value;
      const app_client_id = document.getElementById('app_client_id_input').value;
      const app_secret = document.getElementById('refresh_secret_input').value;
      const resultEl = document.getElementById('refresh_result');
      resultEl.innerHTML = '<span style="color:#737373">Refreshing…</span>';
      try {
        const res = await fetch('${CLURA_URL}/v1/global-auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token, app_client_id, app_secret }),
        });
        const data = await res.json();
        if (!res.ok) {
          resultEl.innerHTML = '<span class="badge err">ERROR ' + res.status + '</span><pre>' + JSON.stringify(data, null, 2) + '</pre>';
          return;
        }
        resultEl.innerHTML = '<span class="badge ok">SUCCESS — new tokens issued, old refresh token invalidated</span><pre>' + JSON.stringify(data, null, 2) + '</pre>';
        document.getElementById('id_token_input').value = data.id_token ?? '';
        document.getElementById('access_token_input').value = data.access_token ?? '';
        document.getElementById('refresh_token_input').value = data.refresh_token ?? '';
      } catch(e) {
        resultEl.innerHTML = '<span class="badge err">NETWORK ERROR: ' + e.message + '</span>';
      }
    }

    async function fetchJwks() {
      const resultEl = document.getElementById('jwks_result');
      try {
        const data = await fetch('${CLURA_URL}/.well-known/jwks.json').then(r => r.json());
        resultEl.innerHTML = '<span class="badge ok">OK</span><pre>' + JSON.stringify(data, null, 2) + '</pre>';
      } catch(e) {
        resultEl.innerHTML = '<span class="badge err">ERROR: ' + e.message + '</span>';
      }
    }

    async function fetchOIDC() {
      const resultEl = document.getElementById('oidc_result');
      try {
        const data = await fetch('${CLURA_URL}/.well-known/openid-configuration').then(r => r.json());
        resultEl.innerHTML = '<span class="badge ok">OK</span><pre>' + JSON.stringify(data, null, 2) + '</pre>';
      } catch(e) {
        resultEl.innerHTML = '<span class="badge err">ERROR: ' + e.message + '</span>';
      }
    }
  </script>
</body>
</html>`,
    { headers: { "Content-Type": "text/html" } },
  );

Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      return html(`
        <h1>Clura Test App</h1>
        <div class="card">
          <h2>Instructions</h2>
          <p style="font-size:0.85rem;color:#a3a3a3;line-height:1.6">
            1. Create an app in the Clura dashboard with <code style="color:#e5e5e5">redirectUri = http://localhost:4000/callback</code><br/>
            2. Visit <code style="color:#e5e5e5">http://localhost:3000/user-login/&lt;appClientId&gt;</code><br/>
            3. Login with Google → you'll land here at <code style="color:#e5e5e5">/callback</code> with a short-lived code<br/>
            4. Enter your <code style="color:#e5e5e5">app_secret</code> and click Exchange to get your tokens
          </p>
        </div>
      `);
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code") ?? "";

      if (!code) {
        return html(
          `<h1>Clura Test App — Callback</h1><div class="card"><span class="badge err">No code received</span><p style="font-size:0.85rem;color:#a3a3a3;margin-top:8px">Missing code in query params.</p></div>`,
        );
      }

      return html(`
        <h1>Clura Test App — Callback received</h1>
        <div class="grid">

          <div class="card full">
            <h2>Exchange Code for Tokens</h2>
            <div class="tag">auth code (auto-filled, valid for 2 minutes, single-use)</div>
            <input id="code_input" value="${code}" readonly />
            <div class="tag">app_secret — shown once at app creation</div>
            <input id="app_secret_input" placeholder="64-char hex secret" />
            <button onclick="doExchange()">POST /v1/global-auth/token</button>
            <div id="exchange_result" class="result"></div>
          </div>

          <div class="card" id="id_token_card" style="display:none">
            <h2>ID Token</h2>
            <input id="id_token_input" readonly />
            <button onclick="copy(document.getElementById('id_token_input').value, this)" class="secondary">Copy</button>
            <button onclick="verifyToken('id_token_input')">Decode & Inspect</button>
            <div id="id_token_input_verify" class="result"></div>
          </div>

          <div class="card" id="access_token_card" style="display:none">
            <h2>Access Token</h2>
            <input id="access_token_input" readonly />
            <button onclick="copy(document.getElementById('access_token_input').value, this)" class="secondary">Copy</button>
            <button onclick="verifyToken('access_token_input')">Decode & Inspect</button>
            <div id="access_token_input_verify" class="result"></div>
          </div>

          <div class="card full" id="refresh_card" style="display:none">
            <h2>Test Token Refresh</h2>
            <div class="tag">refresh_token (auto-filled)</div>
            <input id="refresh_token_input" />
            <div class="tag">app_client_id — copy from dashboard</div>
            <input id="app_client_id_input" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
            <div class="tag">app_secret</div>
            <input id="refresh_secret_input" placeholder="64-char hex secret" />
            <button onclick="doRefresh()">POST /v1/global-auth/refresh</button>
            <div id="refresh_result" class="result"></div>
          </div>

          <div class="card">
            <h2>JWKS Endpoint</h2>
            <button onclick="fetchJwks()">GET /.well-known/jwks.json</button>
            <div id="jwks_result" class="result"></div>
          </div>

          <div class="card">
            <h2>OpenID Configuration</h2>
            <button onclick="fetchOIDC()">GET /.well-known/openid-configuration</button>
            <div id="oidc_result" class="result"></div>
          </div>

        </div>
      `);
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Test app running at http://localhost:${PORT}`);
console.log(`Set redirectUri = http://localhost:${PORT}/callback in the Clura dashboard`);
