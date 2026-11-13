# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1 -- build the Vite bundle
# ---------------------------------------------------------------------------
FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
# devDependencies are needed here: vite itself is one.
RUN npm ci

COPY . .

# Vite inlines VITE_* variables at build time, so the API URL is baked into
# the bundle and must be an address the *browser* can reach -- not a
# Docker-internal hostname. docker-compose.yml passes the published port.
ARG VITE_API_URL=http://localhost:5001
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---------------------------------------------------------------------------
# Stage 2 -- serve the static files
# ---------------------------------------------------------------------------
FROM nginx:1.29-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
