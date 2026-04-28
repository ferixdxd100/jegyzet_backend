# Jegyzet App Backend

A vizsgaremekünk egy webalapú jegyzetelő alkalmazás. Lehetővé teszi a felhasználók számára, hogy regisztráljanak, bejelentkezzenek, majd saját jegyzeteiket létrehozzák, szerkesszék és töröljék. Az adatok felhasználónként elkülönítve tárolódnak, és minden művelet hitelesítéshez kötött.

A backend **Node.js** JavaScript futtatókörnyezetre épül, az **Express** keretrendszer segítségével.

---

## Technológiák

- **Node.js** + **Express**
- **MySQL** (`mysql2/promise`)
- **bcryptjs** – jelszó hashelés
- **jsonwebtoken** – JWT token kezelés
- **cookie-parser** – HTTP-only cookie kezelés
- **dotenv** – környezeti változók


## Környezeti változók (`.env`)
 
```env
PORT=3000
JWT_SECRET=titkos_kulcs
JWT_EXPIRES_IN=7d
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=jelszo
DB_NAME=adatbazis_neve
```

## Telepítés

1. Telepítsd a függőségeket:
```bash
cd backend
npm install
```

2. Állítsd be a MySQL adatbázist:
   - Győződj meg róla, hogy a MySQL szerver fut
   - Szerkeszd a `.env` fájlt az adatbázis beállításokkal:
     - DB_HOST: localhost
     - DB_USER: root (vagy a te felhasználóneved)
     - DB_PASSWORD: (a te jelszavad)
     - DB_NAME: jegyzetapp

3. Indítsd el a szervert:
```bash
npm start
```

A szerver a http://localhost:3000 címen fog futni.



## API Végpontok



### Nyilvános végpontok
 
#### `POST /api/register` – Regisztráció
 
**Body:**
```json
{
  "name": "Teszt Elek",
  "username": "tesztelek",
  "password": "jelszo123"
}
```
 
| Státusz | Leírás |
|--------|--------|
| 200 | Sikeres regisztráció |
| 400 | Hiányzó mező |
| 402 | Foglalt felhasználónév |
| 500 | Szerverhiba |
 
---
 
#### `POST /api/login` – Bejelentkezés
 
**Body:**
```json
{
  "username": "tesztelek",
  "password": "jelszo123"
}
```
 
| Státusz | Leírás |
|--------|--------|
| 200 | Sikeres belépés, sütit állít be |
| 400 | Hiányzó mező |
| 401 | Hibás felhasználónév vagy jelszó |
| 500 | Szerverhiba |
 
---
 
### Védett végpontok (hitelesítés szükséges)
 
#### `POST /api/logout` – Kijelentkezés
 
Törli az `auth_token` cookie-t.
 
| Státusz | Leírás |
|--------|--------|
| 200 | Sikeres kijelentkezés |
 
---
 
#### `GET /api/me` – Bejelentkezett felhasználó adatai
 
**Válasz:**
```json
{
  "id": 1,
  "name": "Teszt Elek",
  "username": "tesztelek"
}
```
 
---
 
#### `GET /api/notes` – Összes jegyzet lekérése
 
A bejelentkezett felhasználó összes jegyzetét adja vissza, létrehozás ideje szerint csökkenő sorrendben.
 
---
 
#### `POST /api/notes` – Új jegyzet létrehozása
 
**Body:**
```json
{
  "title": "Első jegyzetem",
  "content": "Ez a tartalom."
}
```
 
| Státusz | Leírás |
|--------|--------|
| 200 | Sikeres létrehozás |
| 400 | Hiányzó mező |
| 500 | Szerverhiba |
 
---
 
#### `PUT /api/notes/:id` – Jegyzet frissítése
 
**Body:**
```json
{
  "title": "Módosított cím",
  "content": "Módosított tartalom."
}
```
 
| Státusz | Leírás |
|--------|--------|
| 200 | Sikeres frissítés |
| 400 | Hiányzó mező |
| 404 | Jegyzet nem található |
| 500 | Szerverhiba |
 
---
 
#### `DELETE /api/notes/:id` – Jegyzet törlése
 
| Státusz | Leírás |
|--------|--------|
| 200 | Sikeres törlés |
| 404 | Jegyzet nem található |
| 500 | Szerverhiba |
 
---
 
### Fiókbeállítások
 
#### `PUT /api/username` – Felhasználónév módosítása
 
**Body:**
```json
{
  "ujUsername": "ujnev123"
}
```
 
| Státusz | Leírás |
|--------|--------|
| 200 | Sikeres módosítás |
| 400 | Hiányzó mező |
| 402 | Foglalt felhasználónév |
| 500 | Szerverhiba |
 
---
 
#### `PUT /api/jelszo` – Jelszó módosítása
 
**Body:**
```json
{
  "jelenlegiJelszo": "regi_jelszo",
  "ujJelszo": "uj_jelszo"
}
```
 
| Státusz | Leírás |
|--------|--------|
| 200 | Sikeres módosítás |
| 400 | Hiányzó mező |
| 401 | Régi jelszó nem helyes |
| 500 | Szerverhiba |
 
---
 
#### `DELETE /api/fiokom` – Fiók törlése
 
Törli a felhasználót az adatbázisból és a cookie-t is.
 
| Státusz | Leírás |
|--------|--------|
| 200 | Sikeres törlés |
| 500 | Szerverhiba |
 
---


## Adatbázis Struktúra

<img width="557" height="265" alt="image" src="https://github.com/user-attachments/assets/f04ec7fb-529a-4301-8d2c-a35a1bae54e8" />


Az alkalmazás MySQL adatbázist használ, amely két táblából áll: `users` és `notes`.

### `users` tábla – felhasználók

| Mező | Típus | Leírás |
|------|-------|--------|
| `id` | int(11) | Egyedi azonosító (PK) |
| `name` | varchar(255) | Teljes név |
| `username` | varchar(255) | Felhasználónév (egyedi) |
| `password` | varchar(255) | Hashelt jelszó (bcrypt) |
| `created_at` | timestamp | Regisztráció időpontja |

### `notes` tábla – jegyzetek

| Mező | Típus | Leírás |
|------|-------|--------|
| `id` | int(11) | Egyedi azonosító (PK) |
| `user_id` | int(11) | Tulajdonos (FK → users.id) |
| `title` | varchar(255) | Jegyzet címe |
| `content` | text | Jegyzet tartalma |
| `created_at` | timestamp | Létrehozás időpontja |
| `updated_at` | timestamp | Utolsó módosítás időpontja |

A két tábla között **egy-a-többhöz** (1:N) kapcsolat áll fenn: egy felhasználóhoz tetszőleges számú jegyzet tartozhat, a `notes.user_id` mező hivatkozik a `users.id` mezőre.

## Készítették
- [Deák Feri](https://github.com/ferixdxd100)
- [Váradi krisztián](https://github.com/avaradikrisz127)
