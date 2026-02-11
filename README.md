# StageFlow (Buehnentechnik Verwaltung)

Vollstaendiges Full-Stack Projekt mit Next.js (App Router), TypeScript, TailwindCSS, Prisma (SQLite) und eigener Session-Auth.

## Features
- Auth mit Rollen (`member`, `admin`) + httpOnly Session Cookie
- Admin Bereich mit zweiter Passwortabfrage
- Arbeitszeiten Stempeln (Start/Stop) + CSV Export
- Kalender mit Kategorien und Crew-Zuordnung
- Event Management inkl. Checklisten und Equipment
- Oeffentliche Buchungsanfragen inkl. Honeypot + Rate-Limit
- Interne Anfrageverwaltung inkl. Kommentare

## Lokales Setup
1) Abhaengigkeiten installieren
```
npm install
```

2) Env Datei anlegen
```
cp .env.example .env
```

3) Admin-Bereich Passwort Hash erzeugen (optional, empfohlen)
```
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('admin2',12).then(h=>console.log(h))"
```
Trage den Hash in `ADMIN_AREA_PASSWORD_HASH` ein. Alternativ kannst du `ADMIN_AREA_PASSWORD` verwenden (nur lokal empfohlen).

4) Migrationen anwenden + Seed
```
npm run prisma:migrate
npm run prisma:seed
```

5) Dev Server starten
```
npm run dev
```

## Demo Accounts (nur fuer Tests)
- Admin: `admin` / `admin123`
- Member: `member` / `member123`

## Routen
Oeffentlich:
- `/`
- `/book`
- `/book/success`

Intern:
- `/login`
- `/dashboard`
- `/stempeln`
- `/kalender`
- `/events` + `/events/[id]`
- `/requests` + `/requests/[id]`
- `/profile`

Admin:
- `/admin`
- `/admin/users`

## Vercel Deployment
Das Projekt ist fuer lokale SQLite Entwicklung vorbereitet. Fuer Vercel empfiehlt sich eine Postgres DB:
1) In `prisma/schema.prisma` den Provider auf `postgresql` umstellen.
2) `DATABASE_URL` in Vercel auf die Vercel Postgres URL setzen.
3) Migrationen deployen:
```
npx prisma migrate deploy
```

## Hinweise
- Session Cookie: `bt_session` (httpOnly)
- Admin-Verify Cookie: `admin_verified` (20 Min)
- Rate-Limits: Login (5/10 Min), Booking (5/5 Min)