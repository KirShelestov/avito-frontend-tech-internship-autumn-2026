# dev-образ: Vite dev-сервер с HMR
FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# остальной код приезжает через bind-mount в docker-compose,
# копия нужна только чтобы образ собирался и без volume
COPY . .

EXPOSE 5173

# --host 0.0.0.0, иначе dev-сервер не виден снаружи контейнера
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
