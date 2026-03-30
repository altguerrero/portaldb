import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { createServer } from 'node:net';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');
const upstreamApiUrl = process.env['RICK_API_URL'] || 'https://rickandmortyapi.com/api';

const app = express();
const angularApp = new AngularNodeAppEngine();

function ensurePortAvailable(port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const tester = createServer()
      .once('error', reject)
      .once('listening', () => {
        tester.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });

    tester.listen(port);
  });
}

/**
 * Proxy the Rick and Morty API through the SSR server to avoid browser CORS
 * issues and keep the same base URL for client-side and server-side requests.
 */
app.get('/api/{*splat}', async (req, res, next) => {
  try {
    const splat = req.params['splat'];
    const apiPath = Array.isArray(splat) ? splat.join('/') : String(splat ?? '');

    if (!apiPath.length) {
      res.status(400).json({ error: 'Missing API path.' });
      return;
    }

    const targetUrl = new URL(`${upstreamApiUrl}/${apiPath}`);

    for (const [key, value] of Object.entries(req.query)) {
      if (Array.isArray(value)) {
        value.forEach((item) => targetUrl.searchParams.append(key, String(item)));
        continue;
      }

      if (value != null) {
        targetUrl.searchParams.set(key, String(value));
      }
    }

    const upstreamResponse = await fetch(targetUrl, {
      headers: {
        accept: 'application/json',
      },
    });

    const responseBody = await upstreamResponse.text();

    res.status(upstreamResponse.status);
    res.setHeader(
      'content-type',
      upstreamResponse.headers.get('content-type') ?? 'application/json; charset=utf-8',
    );
    res.send(responseBody);
  } catch (error) {
    next(error);
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = Number(process.env['PORT'] || 4000);

  void ensurePortAvailable(port)
    .then(() => {
      const server = app.listen(port, () => {
        console.log(`Node Express server listening on http://localhost:${port}`);
      });

      server.on('error', (error: NodeJS.ErrnoException) => {
        console.error(error);
        process.exit(1);
      });
    })
    .catch((error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(
          `Port ${port} is already in use. Free it or run the server on another port, for example: PORT=4010 npm run serve:ssr:portaldb`,
        );
        process.exit(1);
      }

      console.error(error);
      process.exit(1);
    });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
