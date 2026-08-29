# dev-образ: бэкенд с авто-перезапуском (tsx watch)
FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# остальной код приезжает через bind-mount в docker-compose,
# копия нужна только чтобы образ собирался и без volume
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
