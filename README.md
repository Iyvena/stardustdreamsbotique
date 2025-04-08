# StardustDreamsBotique Backend
---
## készítette:
- Szalay Viktória
---
# Backend Felépítése:

1. API végpontok
  - Adatbázis
    - Auth rendszer
      - Telepítés/használat

---
# Fő Csomagok

2. Csomagok/Middleware-ek:
   - express:
      - express.json() – JSON kérések kezelése
   - cookie-parser:
       - cookieParser() – Cookie-k kezelése
   - path:
       - cors() – Engedélyezi a frontend hozzáférését
    - limiter:
        -  limiter (kommentelve) – Rate limiting middleware
     -   authenticateToken:
         - authenticateToken – JWT alapú autentikáció   
---

# Statikus Fájlok:
- /uploads mappa elérhető publikus úton

---

# Útvonalak:

| URL Prefix   |     Fájl           | Funkciók |
| :---         |     :---:          |                               ---:  |
| /api/auth    | authRoutes.js      | Bejelentkezés, regisztráció         |
| /api/profile | profileRoutes.js   | Profil szerkesztés, lekérdezés      |
| /api/products| productsRoutes.js  | Termékek lekérdezése, kezelése      |
| /api/likes   | likedRoutes.js     | Termékek kedvelése                  |
| /api/orders  | orderRoutes.js     | Rendelések kezelése                 |
| /api/cart    | cartRoutes.js      | Kosár műveletek                     |
| /api         | searchRoutes.js    | Termék keresés                      |
| /api/user    | profileRoutes.js   | Felhasználói adatok lekérdezése     |

---

# Backend adatok:

 - config:
   - dotenvConfig.js
- Controllers:
  - authController.js:
 - ### **Függőségek:**
  1. bcryptjs: Jelszavak titkosítása és ellenőrzése.
  2. validator: Felhasználói bemenetek validálása (pl. email, jelszó).
  3. jsonwebtoken: JWT token generálás és validálás.
  4. database: Az adatbázis kapcsolódása és SQL lekérdezések végrehajtása.
  5. JWT_SECRET: A környezeti változóból betöltött titkos kulcs a JWT aláírásához.

I. register - Regisztráció:
- Funkció:
    - Regisztrálja az új felhasználót a rendszerben, ellenőrzi az email cím, felhasználónév és jelszó helyességét.
    - A jelszó titkosítása (bcrypt) történik, mielőtt az adatbázisba kerülne.
- Bemenet:
    - email, username, password a kérés törzsében.
- Validálás:
    - Ellenőrzi, hogy az email cím érvényes-e.
    - A felhasználónév nem üres.
    - A jelszó legalább 8 karakter hosszú.
- Válasz:
    - Sikeres regisztráció: 201-es válasz státusz.
    - Hibás bemenet: 400-as válasz státusz, részletes hibák.
