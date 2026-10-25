import path from 'path';
import crypto from 'crypto';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function cashfreeProxyPlugin(env: Record<string, string>) {
  return {
    name: 'vite-plugin-cashfree-proxy',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api/cashfree')) {
          return next();
        }

        const readBody = () => new Promise<{ raw: string; parsed: any }>((resolve) => {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', () => {
            try { resolve({ raw: body, parsed: body ? JSON.parse(body) : {} }); }
            catch { resolve({ raw: body, parsed: {} }); }
          });
        });

        const sendJson = (statusCode: number, data: any) => {
          res.statusCode = statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        try {
          const bodyPayload = req.method === 'POST' ? await readBody() : { raw: '', parsed: {} };
          const body = bodyPayload.parsed;
          const clientConfig = body.config || {};
          const appId = clientConfig.appId || env.CASHFREE_APP_ID || '';
          const secretKey = clientConfig.secretKey || env.CASHFREE_SECRET_KEY || '';
          const environment = (clientConfig.environment || env.CASHFREE_ENV || 'production').toLowerCase();
          const apiVersion = clientConfig.apiVersion || '2023-08-01';

          const baseUrl = environment === 'production'
            ? 'https://api.cashfree.com/pg'
            : 'https://sandbox.cashfree.com/pg';

          // 1. Webhook Signature Verification Endpoint
          if (req.url === '/api/cashfree/webhook') {
            const signature = req.headers['x-webhook-signature'];
            const timestamp = req.headers['x-webhook-timestamp'];

            if (!signature || !timestamp) {
              return sendJson(400, { error: 'Missing Cashfree webhook signature headers.' });
            }

            // Anti-replay: Reject payloads with timestamp skew > 5 minutes (300s)
            const currentTime = Math.floor(Date.now() / 1000);
            const tsNum = parseInt(String(timestamp), 10);
            if (isNaN(tsNum) || Math.abs(currentTime - tsNum) > 300) {
              return sendJson(400, { error: 'Webhook timestamp skew exceeds tolerance (replay attack protection).' });
            }

            // Verify signature: HMAC-SHA256(timestamp + rawBody, secretKey)
            const computedSignature = crypto
              .createHmac('sha256', secretKey)
              .update(timestamp + bodyPayload.raw)
              .digest('base64');

            if (signature !== computedSignature) {
              return sendJson(401, { error: 'Invalid Cashfree webhook signature.' });
            }

            return sendJson(200, { status: 'OK', message: 'Webhook verified and processed.' });
          }

          // 2. Test Connection
          if (req.url === '/api/cashfree/test-connection') {
            if (!appId || !secretKey) {
              return sendJson(400, { success: false, message: 'Missing Cashfree App ID or Secret Key.' });
            }
            const check = await fetch(`${baseUrl}/orders/probe_connection_test`, {
              headers: {
                'x-client-id': appId,
                'x-client-secret': secretKey,
                'x-api-version': apiVersion
              }
            });
            if (check.status === 401 || check.status === 403) {
              const err = await check.json().catch(() => ({}));
              return sendJson(401, { success: false, message: err.message || 'Authentication failed: Invalid Cashfree credentials.' });
            }
            return sendJson(200, { success: true, message: `Successfully authenticated with Cashfree PG (${environment.toUpperCase()}).` });
          }

          // 3. Create Order
          if (req.url === '/api/cashfree/create-order') {
            if (!appId || !secretKey) {
              return sendJson(400, { error: 'Cashfree App ID and Secret Key must be configured.' });
            }

            const cfPayload = {
              order_id: body.order_id,
              order_amount: body.order_amount,
              order_currency: body.order_currency || 'INR',
              customer_details: body.customer_details,
              order_meta: body.order_meta,
              order_note: body.order_note
            };

            const response = await fetch(`${baseUrl}/orders`, {
              method: 'POST',
              headers: {
                'x-client-id': appId,
                'x-client-secret': secretKey,
                'x-api-version': apiVersion,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(cfPayload)
            });

            const data = await response.json();
            return sendJson(response.status, data);
          }

          // 4. Verify/Get Order
          if (req.url.startsWith('/api/cashfree/orders/')) {
            const orderId = req.url.split('/api/cashfree/orders/')[1]?.split('?')[0];
            if (!orderId) {
              return sendJson(400, { error: 'Missing order_id' });
            }

            const response = await fetch(`${baseUrl}/orders/${orderId}`, {
              headers: {
                'x-client-id': appId,
                'x-client-secret': secretKey,
                'x-api-version': apiVersion
              }
            });

            const data = await response.json();
            return sendJson(response.status, data);
          }

          return sendJson(404, { error: 'Not found' });
        } catch (err: any) {
          console.error('[Cashfree Proxy Error]', err);
          return sendJson(500, { error: err?.message || 'Internal proxy error' });
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        cashfreeProxyPlugin(env)
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.CASHFREE_APP_ID': JSON.stringify(env.CASHFREE_APP_ID || ''),
        // Redacted from client bundle; secret key stays strictly in proxy server middleware
        'process.env.CASHFREE_SECRET_KEY': JSON.stringify(''),
        'process.env.CASHFREE_ENV': JSON.stringify(env.CASHFREE_ENV || 'production')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

