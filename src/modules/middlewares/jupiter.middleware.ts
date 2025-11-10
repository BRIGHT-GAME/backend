import { createProxyMiddleware } from 'http-proxy-middleware';
import { Injectable, NestMiddleware } from "@nestjs/common";

@Injectable()
export class JupiterProxyMiddleware implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: 'https://quote-api.jup.ag',
    changeOrigin: true,
    pathRewrite: {
      '^/jupiter-api': '',
    },
    on: {
      proxyReq: (proxyReq) => {
        proxyReq.setHeader('Origin', 'https://quote-api.jup.ag');
      },
    },
  });

  use(req: any, res: any, next: () => void) {
    this.proxy(req, res, next);
  }
}
