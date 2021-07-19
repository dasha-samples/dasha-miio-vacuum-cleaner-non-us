# Процесс запуска приложения

Этот пример построен для наглядной презентации работы голосового асистента для управления роботом-пылесосом Xiaomi. Если вам нужна какая-либо помощь, обращайтесь в наше комьюнити разработчиков
[Комьюнити разработчиков](https://community.dasha.ai).

Это приложение построено на [`node-mihome`](https://www.npmjs.com/package/node-mihome) и использует особые параметры. Проверьте ссылку, чтобы понять, как получить ваши  `DEVICE_ID`, `DEVICE_TOKEN` и т.п.

1. Клонируйте репозиторий и используйте:

```sh
git clone https://github.com/dasha-samples/dasha-miio-vacuum-cleaner
cd dasha-miio-vacuum-cleaner
npm install
```

2. Создайте файл `.env` который содержит:
```sh
DEVICE_ID=<your_deviceid>
MI_USERNAME=<your_mi_username>
MI_PASSWORD=<your_mi_password>
MI_MODEL=<your_device_model>
DEVICE_IP=<your_device_ip>
DEVICE_TOKEN=<your_device_token>
```

3. Создайте или войдите в свою учетную запись с помощью инструмента Dasha CLI:

```sh
npx dasha account login
```

4. Чтобы начать чат, выполните:

```sh
npm start chat
```

5. Чтобы инициировать звонок, выполните:

```sh
npm start <your phone number>
```

Номер телефона должен быть в международном формате, исключая `+` (пример: `79133334455`)
