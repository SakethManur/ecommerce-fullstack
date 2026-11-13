# syntax=docker/dockerfile:1

FROM node:24-alpine

ENV NODE_ENV=production

WORKDIR /app

# Copy the manifests first so the dependency layer is cached independently of
# the source. `npm ci` installs exactly what package-lock.json pins.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node . .

# node:alpine ships an unprivileged `node` user (uid 1000). Drop to it so the
# API never runs as root.
USER node

EXPOSE 5001

# The API reports 200 on /health only when the database also answers.
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
    CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||5001)+'/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["npm", "start"]
