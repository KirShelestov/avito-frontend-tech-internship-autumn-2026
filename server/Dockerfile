# dev-образ: бэкенд с авто-перезапуском (tsx watch)
FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# При docker compose перекрывается bind-mount'ом; нужно для сборки образа без volume.
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
