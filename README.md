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

<details>
  
<summary>Controllers:</summary>
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

II. login - Bejelentkezés:
- Funkció:
  - A felhasználó bejelentkezése az email cím és jelszó alapján.
  - Az email cím és jelszó ellenőrzése után a jelszót összehasonlítja a tárolt titkosított jelszóval (bcrypt.compare).
  - Ha sikeres a bejelentkezés, JWT tokent generál.
  - A tokent cookie-ban tárolja a válaszban (auth_token).
- Bemenet:
  - email, password a kérés törzsében.
- Validálás:
  - Ellenőrzi, hogy az email cím érvényes-e.
  - A jelszó nem üres.
- Válasz:
  - Sikeres bejelentkezés: 200-as válasz státusz és a JWT token.
  - Hibás jelszó vagy email: 401-es válasz státusz, hibaüzenet.
 
III.  logout - Kijelentkezés:
- Funkció:
  -  Törli a auth_token cookie-t, ezzel kijelentkezteti a felhasználót.
- Válasz:
  - 200-as válasz státusz és sikeres kijelentkezés üzenet.
 
IV. loginUser - Adminisztrátor Bejelentkezés:
- Funkció:
  - Adminisztrátor felhasználó bejelentkezése a felhasználónév és jelszó alapján.
  - A jelszót titkosítva ellenőrzi, és ha sikeres, JWT tokent generál.
  - A tokent cookie-ban tárolja, mint az login esetén.
- Bemenet:
  - username, password a kérés törzsében.
- Válasz:
  - Sikeres bejelentkezés: 200-as válasz státusz és a JWT token.
  - Hibás felhasználónév vagy jelszó: 401-es válasz státusz, hibaüzenet.

 V. isAdmin - Adminisztrátor Jogosultság Ellenőrzése:
 - Funkció:
   - Ellenőrzi, hogy a felhasználó rendelkezik-e adminisztrátori jogokkal.
   - Ha a felhasználó nem admin, 403-as hibát ad vissza.
- Használat:
  - Middleware-ként használható a protected route-okhoz, ahol admin jogosultság szükséges.

VI. isLoggedIn - Bejelentkezett Felhasználó Ellenőrzése:
- Funkció:
  - Ellenőrzi, hogy a felhasználó be van-e jelentkezve a auth_token cookie segítségével.
  - Ha be van jelentkezve, true értékkel válaszol, különben false értékkel.
- Válasz:
  - JSON válasz a felhasználó bejelentkezett státuszával.
 
VII. detectRole - Felhasználói Szerepkör Lekérdezése:
- Funkció:
  - Visszaadja a bejelentkezett felhasználó szerepkörét (role), amelyet az JWT tartalmaz.
  - Használható, ha szükség van a felhasználó szerepkörének megismerésére.
</details>
