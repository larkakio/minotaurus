# Minotaurus Mini App – Deploy

## Локальний запуск

```bash
npm install
npm run dev
```

Відкрийте http://localhost:3000

## Деплой (Vercel)

1. Пуш проєкту в GitHub і підключіть репо до Vercel.
2. Додайте змінні оточення:
   - `NEXT_PUBLIC_APP_URL` = `https://minotaurus-iota.vercel.app`
   - `NEXT_PUBLIC_BASE_APP_ID` = app_id з https://base.dev (після створення Mini App)
3. У `public/.well-known/farcaster.json` вже вказано `https://minotaurus-iota.vercel.app`.
4. Згенеруйте **accountAssociation** через https://farcaster.xyz/~/developers/mini-apps/manifest і вставте в `farcaster.json` замість placeholder.
5. Перевірте embed: https://farcaster.xyz/~/developers/mini-apps/embed

## Farcaster

- Embed: `fc:miniapp` і `fc:frame` з однаковим JSON, `version: "1"`, `action.type: "launch_frame"`.
- У клієнті викликається `sdk.actions.ready()` (компонент `FarcasterReady`).

## Base

- У layout використовується `base:app_id` з `NEXT_PUBLIC_BASE_APP_ID`.
- У `farcaster.json`: `requiredChains: ["eip155:8453"]`.

## Геймплей

- **Roll** – натисніть кубик.
- **6** – ходить Мінотавр (AI, A*), якщо дійде до героя – герой повертається на старт.
- **1–5** – оберіть героя (тап по ньому), потім **свайп** вгору/вниз/ліво/право для руху (кількість кроків = значення кубика).
- Мета – довести героя до кольорової клітини храму по центру (перемога).
