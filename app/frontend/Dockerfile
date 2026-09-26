FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runner

RUN apk add --no-cache nginx openssl

WORKDIR /app

COPY nginx.conf /etc/nginx/http.d/app.conf
RUN rm -f /etc/nginx/http.d/default.conf

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

COPY start.sh /start.sh
RUN sed -i 's/\r$//' /start.sh
RUN chmod +x /start.sh

EXPOSE 80 443

CMD ["/start.sh"]