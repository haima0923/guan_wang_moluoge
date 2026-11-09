FROM node:24-bookworm-slim
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --chown=node:node server.mjs seed.mjs zh.mjs article-content.mjs video-range.mjs article-html.mjs media-store.mjs translation.mjs content-sync.mjs service-content.mjs company-news.mjs request-policy.mjs release-copy.mjs ./
COPY --chown=node:node public ./public
COPY --chown=node:node scripts/backup.mjs ./scripts/backup.mjs
RUN mkdir /app/data && chown node:node /app/data
USER node
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000 DATA_DIR=/app/data
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 CMD node -e "fetch('http://127.0.0.1:3000/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.mjs"]
