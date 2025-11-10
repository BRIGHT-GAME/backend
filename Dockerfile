# Используем официальный образ Node.js (например, версии 22)
FROM node:22

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock)
COPY package*.json ./

# Устанавливаем зависимости с опцией --legacy-peer-deps (если необходимо)
RUN npm install --legacy-peer-deps

# Копируем остальные файлы проекта в рабочую директорию
COPY . .

# Собираем приложение (будет создана папка dist)
RUN npm run build

# Указываем порт, который используется приложением (8000)
EXPOSE 8000

# Запускаем приложение в продакшен режиме
CMD ["npm", "run", "start:prod"]
