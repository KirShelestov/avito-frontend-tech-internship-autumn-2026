# dev-образ: Vite dev-сервер с HMR
FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# При docker compose перекрывается bind-mount'ом; нужно для сборки образа без volume.
COPY . .

EXPOSE 5173

# Без --host Vite слушает только localhost внутри контейнера.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
