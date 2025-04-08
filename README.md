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
    
 ---

- cartController.js:
  - ### **Függőségek:**
    1. database: Az adatbázis elérését biztosító modul (models/database.js).
    2. A req.user.id feltételezi, hogy a felhasználó már hitelesítve van és a JWT middleware betölti az azonosítót.
   
I. purchaseProduct – Termék hozzáadása a kosárhoz:
- Funkció:
  - Ellenőrzi, hogy van-e már kosár a felhasználónak.
  - Ha igen, hozzáadja a terméket.
  - Ha nincs, létrehoz egyet, majd hozzáadja a terméket.
- Validálás:
  - product_id és quantity megléte.
- Válasz:
  - Sikeres hozzáadás vagy mennyiségfrissítés: 200 / 201.
  - Hibás adat vagy SQL hiba: 400 / 500.

 II.  addToCart – Termék hozzáadása vagy mennyiség frissítése:
 - Funkció:
   -  Ha a termék már a kosárban van, növeli a mennyiséget.
   -  Ha nincs, beszúrja új tételként.
-  Bemenet:
  -  cart_id, product_id, quantity – függvényparaméterként.
-  Válasz:
  -  Frissítés: 200.
  -  Új hozzáadás: 201.
  -  SQL hiba esetén: 500.

III. checkCart – Kosár tartalmának lekérdezése:
- Funkció:
  - Visszaadja a felhasználó kosarában lévő termékek listáját, azok részleteivel és összesített árakkal.
  - Kimenet (példa struktúra):
    ```
    {
        "cart_id": 19,
        "product_id": 5,
        "product_name": "Genshin Impact costume Tighnari",
        "price": "71.99",
        "type_id": 1,
        "chategory_id": 2,
        "description": "Genshin Impact, costume, Tighnari full cosplay with dress, wigs and props",
        "quantity": 2,
        "total_price": "143.98"
    }
    ```
- Válasz:
  - Siker: 200.
  - Hiba: 500.

 IV. removeItemFromCart – Termék eltávolítása a kosárból
 - Funkció:
   -  Törli az adott terméket a felhasználó kosarából.
-  Bemenet:
  - product_id a req.params-ban.
- Válasz:
  - Siker: 200.
  - Nem található: 404.
  - Hiányzó adat vagy SQL hiba: 400 / 500.
 
V. updateQuantity – Mennyiség frissítése:
- Funkció:
  - Módosítja egy kosárban lévő termék mennyiségét.
- Bemenet:
  - product_id, quantity a req.body-ban.
-  Validálás:
  -  Meglévő termék ellenőrzése a kosárban.
-  Válasz:
  -  Sikeres frissítés: 200.
  -  Nincs ilyen termék: 404.
  -  Hiányzó adat vagy SQL hiba: 400 / 500.

VI.  checkout – Vásárlás (fizetés) és kosár ürítése:
- Funkció:
  - Lekérdezi a kosarat.
  - Szimulált fizetés (loggolás formájában).
  - Kiüríti a kosarat.
  - Visszaküldi a megvásárolt termékek listáját.
- Bemenet:
  - email, card_token, shipping_address a req.body-ban.
- Validálás:
  - Minden mező megléte.
  - Kosár nem lehet üres.
- Válasz:
  - Siker: 200 (termékek listájával).
  - Hiányzó adatok vagy üres kosár: 400.
  - SQL hiba: 500.
    
</details>
