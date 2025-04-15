# StardustDreamsBotique Backend
---
## készítette:
- Szalay Viktória
---
# Backend Felépítése:

1. API végpontok
  - Adatbázis
      - adatbázis linkje: https://drawsql.app/teams/elefant/diagrams/stardust-workshop 
    - Auth rendszer
      - Telepítés/használat
    - Postman(tesztelés) linkje: [https://web.postman.co/documentation/38557822-3323ce46-38d2-4898-a437-c36ce3e708e5/publish?workspaceId=8b899a62-3eb2-4904-8e1e-95576a83651e](https://documenter.getpostman.com/view/38557822/2sB2cVfhfg)

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

- 👤 authController.js:
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

- 🛒 cartController.js:
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
 
  ---

- ❤️ likeController.js – Kedvencek kezelése:
  - ### **Függőségek:**
    1.  database: az SQL adatbázis kapcsolatot biztosító modul.
    2.  Feltételezi, hogy req.user.id tartalmazza az azonosított felhasználó ID-ját (JWT middleware használatával).
   
I. likeProduct(req, res) – Termék kedvencekhez adása / eltávolítása:
- Funkció:
  - Ha a termék már kedvenc, eltávolítja (unlike).
  - Ha még nem az, akkor hozzáadja a kedvencekhez (like).
- Bemenet:
  - product_id: req.params-ból.
  - user_id: az azonosított felhasználótól (req.user.id).
- Lépések:
  1. Ellenőrzi, hogy a felhasználó már kedvencek közé tette-e a terméket.
  2.  Ha igen → DELETE.
  3.  Ha nem → INSERT.
- Válaszok:
  -  Sikeres hozzáadás: 200 OK + "liked".
  -  Sikeres eltávolítás: 200 OK + "unliked".
  -   Hiányzó ID: 400.
  -   SQL hiba: 500.
 
II. unlikeProduct(req, res) – Egy termék külön törlése a kedvencekből:
- Ez hasonló a likeProduct funkció "unlike" ágához, de külön route-on hívható.
- Bemenet:
  - product_id (params), user_id (req.user.id).
- Lépések:
  - Egyértelmű törlés DELETE SQL-lel.
- Válaszok:
  - Sikeres törlés: 200 OK.
  - Nem található: 404.
  - SQL hiba: 500.
 
III. checkLike(req, res) – Kedvencek lekérdezése:
- Funkció:
  - Visszaadja a felhasználó kedvenc termékeit, egyesítve a products táblával.
-  Bemenet:
  -  user_id (req.user.id).
-  SQL művelet:
  -  JOIN a products és likes táblán, user_id alapján.
-  Válasz:
  -   Siker: 200 OK, a kedvenc termékek listája.
  -   SQL hiba: 500.
- Példa válasz:
 
   ```
    {
        "product_id": 5,
        "product_name": "Genshin Impact costume Tighnari",
        "price": "71.99",
        "product": "Tighnari_costume.jpeg",
        "type_id": 1,
        "chategory_id": 2,
        "user_id": 19,
        "description": "Genshin Impact, costume, Tighnari full cosplay with dress, wigs and props"
    }
```
```
---

- 📦 productsController.js:
  - ### **Függőségek:**
    - database: Az adatbázis-műveleteket végző modul (models/database.js)
    - fs: Fájlrendszer modul, a képek törléséhez
    - req.user.id: Feltételezi, hogy a felhasználó már hitelesítve van, a JWT middleware által
      
  - I. getALLproduct – Összes termék lekérdezése
    - Funkció:
      - Lekérdezi az adatbázisból az összes terméket.
    - Bemenet:
      - req.user_id: A bejelentkezett felhasználó azonosítója (bár jelenleg nincs ténylegesen használva a lekérdezésben)
    - Válasz:
      - Sikeres lekérdezés esetén: 200 – Termékek listája
      -  Nincs találat: 404
      -  SQL hiba: 500
  - II.   uploadProduct – Új termék feltöltése
    - Funkció:
      - Új termék beszúrása az adatbázisba.
      - Kép feltöltésének és termékadatok meglétének validálása.
    -  Bemenet:
      -  product_name, description, price, type_id, category_name – a req.body-ból
      -  req.file – a feltöltött kép
    -  Validálás:
       - Minden szükséges mező megléte ellenőrzésre kerül.
    -  Válasz:
      -  Sikeres feltöltés: 201 (termék ID-val)
      -  Hiányos adatok: 400
      -  SQL hiba: 500
   
    III. filterProducts – Termékek szűrése kategória vagy típus alapján
    - Funkció:
      - Lekérdezi a termékeket a megadott chategory_id és/vagy type_id alapján.
    - Bemenet:
       - chategory_id, type_id – a req.query-ből
    - Válasz:
      - Találatok: 200
      - Nincs találat: 404
      - SQL hiba: 500
     
    IV. deleteProduct – Termék törlése
    - Funkció:
     - Lekérdezi a termékhez tartozó fájlnevet, és törli azt a szerverről.
     - Ezután törli a terméket az adatbázisból.
    - Bemenet:
       - product_id – a req.params-ból
    - Válasz:
      - Sikeres törlés: 200
      - Hiányzó product_id: 400
      - Nem található termék: 404
      - SQL hiba: 500
     
    V.  updateProduct – Termék adatainak frissítése
    - Funkció:
       - Részleges frissítést végez az adott terméken (csak a megadott mezőket módosítja).
       - Ha kép is érkezik, frissíti a fájlnevet is.
    - Bemenet:
       - product_id – a req.params-ból
       - product_name, description, price, type_id, chategory_id – a req.body-ból
       - req.file – új kép (opcionális)
    - Validálás:
       - Legalább egy mező megadása kötelező a frissítéshez.
    - Válasz:
        - Sikeres frissítés: 200
        - Nem található vagy nincs jogosultság: 404
        - Hiányzó adatok: 400
        - SQL hiba: 500
     
    ---
    - updateProductDescription.js - Funkcionalitás és Leírás:
      - ### **Függőségek:**
        - database: Az adatbázis-műveleteket végző modul (models/database.js)
       
    I.  updateProductDescription – Termék leírásának frissítése:
    - Funkció:
       - Frissíti a megadott termék leírását.
    - Bemenet:
       - product_id: A termék azonosítója (a req.body-ból)
       - description: Az új leírás (a req.body-ból)
    - Validálás:
       - Ellenőrzi, hogy mind a product_id, mind a description mezők szerepelnek-e a kérésben.
    - Válasz:
      - Sikeres frissítés: 200 – A termék leírása sikeresen frissítve.
      - Hiányzó adat: 400 – A product_id vagy a description hiányzik.
      - A termék nem található: 404 – Nincs olyan termék, amely megfelelne a megadott product_id-nak.
      - SQL hiba: 500 – Belső hibák az adatbázis műveletek során.
     
      ---

      - 👨🏻‍💼 profileController.js – Funkcionalitás és Leírás
         - ### **Függőségek:**
           - database: Az adatbázis-műveleteket végző modul (models/database.js)
           - bcryptjs: A jelszó titkosításához szükséges könyvtár
          
        I. editProfileName – Felhasználói név frissítése:
          - Funkció:
             - Frissíti a felhasználó nevét.
          - Bemenet:
             - username: A felhasználó új neve (a req.body-ból)
          - Validálás:
             - Ellenőrzi, hogy a username mező nem üres és nem csak szóköz.
          - Válasz:
            - Sikeres frissítés: 200 – A felhasználó neve sikeresen frissítve.
            - Hiányzó adat: 400 – A név nem lehet üres.
            - Felhasználó nem található: 404 – A felhasználó nem található az adatbázisban.
            - SQL hiba: 500 – Belső hiba.
           
          II.  editProfilePassword – Felhasználói jelszó frissítése
            - Funkció:
               - Frissíti a felhasználó jelszavát.
            - Bemenet:
               - password: Az új jelszó (a req.body-ból)
            - Validálás:
               - Ellenőrzi, hogy a jelszó legalább 8 karakter hosszú-e.
            - Válasz:
              -  Sikeres frissítés: 200 – A jelszó sikeresen frissítve.
              -  Helytelen jelszó: 400 – A jelszónak legalább 8 karakter hosszúnak kell lennie.
              -  SQL hiba: 500 – Belső hiba.
             
        III. editProfileAdress – Felhasználói cím frissítése
        - Funkció:
           - Frissíti a felhasználó címét.
        - Bemenet:
           - address: Az új cím (a req.body-ból)
        - Validálás:
           - Ellenőrzi, hogy a cím nem üres.
        - Válasz:
          - Sikeres frissítés: 200 – A cím sikeresen frissítve.
          - Hiányzó adat: 400 – A cím nem lehet üres.
          - Felhasználó nem található: 404 – A felhasználó nem található.
          - SQL hiba: 500 – Belső hiba.
         
        IV. editProfilePic – Profilkép frissítése
        - Funkció:
           - Frissíti a felhasználó profilképét.
        - Bemenet:
           - profile_pic: Az új profilkép fájl neve (a fájl feltöltése után)
        - Válasz:
           - Sikeres frissítés: 200 – A profilkép sikeresen frissítve.
           - SQL hiba: 500 – Belső hiba.
         
          V. getProfilePic – Profilkép lekérdezése
          - Funkció:
             - Visszaadja a felhasználó profilképének fájlnevét.
          - Bemenet:
             - user_id: A felhasználó azonosítója (a req.user.id-ból)
          - Válasz:
            - Sikeres lekérdezés: 200 – A profilkép fájl neve.
            -  Felhasználó nem található: 404 – A felhasználó nem található.
           
          VI. getUsername – Felhasználói név lekérdezése
          - Funkció:
             - Visszaadja a felhasználó nevét.
          - Bemenet:
             - user_id: A felhasználó azonosítója (a req.user.id-ból)
          - Válasz:
            - Sikeres lekérdezés: 200 – A felhasználó neve.
            - Felhasználó nem található: 404 – A felhasználó nem található.
           
          VII. getAddress – Felhasználói cím lekérdezése
          - Funkció:
             - Visszaadja a felhasználó címét.
          - Bemenet:
             - user_id: A felhasználó azonosítója (a req.user.id-ból)
          - Válasz:
              - Sikeres lekérdezés: 200 – A felhasználó címe.
              - Felhasználó nem található: 404 – A felhasználó nem található.
           
            ---

            - 🔎 searchProductscontroller.js – Termékek keresése
             - Funkció:
               - A funkció lehetővé teszi, hogy termékeket keressünk az adatbázisban a felhasználó által megadott kifejezés alapján. Ha nincs keresési kifejezés, akkor az összes terméket lekéri.
             - Bemenet:
               - search: A keresési kifejezés, amely a req.params.search-ból érkezik. Ha nincs megadva kifejezés, alapértelmezés szerint üres stringként kezeljük.
            - Validálás:
                - A keresési kifejezés (search) szóközökkel körülvett vagy üres stringként érkezhet. A kód az trim() metódust alkalmazza, hogy eltávolítsa a fölösleges szóközöket.
            - Funkcionalitás:
              1. Üres keresési kifejezés:
                 - Ha a keresési kifejezés üres, az összes terméket lekérjük az adatbázisból.
                 - Az SQL lekérdezés
                   ```
                   SELECT * FROM products
                   ```
                2. Nem üres keresési kifejezés:
                   - Ha van keresési kifejezés, a LIKE operátort használjuk az adatbázisban való kereséshez.
                   - A keresési kifejezés a termékek product_name, description, és price mezőiben kerül keresésre.
                   - Az SQL lekérdezés:
                     ```
                     SELECT * FROM products WHERE product_name LIKE ? OR description LIKE ? OR price LIKE ?
                     ```
                     - A keresési kifejezés minden esetben % karakterekkel lesz körülvéve, hogy a találatok részleges egyezést is figyelembe vegyenek.
                    
                   - Válasz:
                     - 200 – A termékek listája visszaadva a válaszban.
                     - 500 – Ha SQL hiba történik a lekérdezés során, egy hibajelzést küldünk: Adatbázis hiba.
</details>

---

<details>
<summary>Middleware</summary>
  
  - 👤 authenticateToken & authenticateUser – Middleware a felhasználó hitelesítéséhez
    - ### **Függőségek:**
      - jsonwebtoken (jwt): A JSON Web Token (JWT) kezelésére használt könyvtár.
      - database: Az adatbázis-műveleteket végző modul (models/database.js).
      - dotenvConfig: A környezeti változókat tartalmazó konfigurációs fájl (JWT_SECRET).

I. authenticateToken – Middleware a token ellenőrzésére
- Funkció:
  -  A middleware ellenőrzi, hogy a kérés tartalmazza-e az érvényes JWT tokent a cookies.auth_token-ban. Ha igen, a token érvényességét ellenőrzi, és a felhasználói adatokat hozzáadja a req.user objektumhoz. Ha nem érvényes a token vagy nincs token, akkor hibát jelez.
- Bemenet:
  - cookie: A kérés tartalmazza a auth_token nevű cookie-t, amely a felhasználó JWT tokenjét tartalmazza.
- Funkcionalitás:
  - Token keresése: A middleware megpróbálja megtalálni a auth_token-t a kérés cookie-jában.
  - Token validálás: A jwt.verify metódus segítségével érvényesíti a tokent a JWT_SECRET kulcs használatával.
-   Hibák:
  - Ha a token nincs a kérésben, akkor 403-as státuszkóddal hibaüzenet érkezik: Nincs bejelentkezett felhasználó.
  - Ha a token érvénytelen, akkor 403-as státuszkóddal hibaüzenet érkezik: A token érvénytelen.
 - Válasz:
   - Sikeres hitelesítés: Ha a token érvényes, a felhasználói adatokat (dekódolt token) hozzáadja a req.user objektumhoz, majd a next() metódust hívja, hogy a következő middleware-t vagy route handler-t lefuttathassa.
   - Hiba: Ha a token nem található vagy érvénytelen, hibát küld vissza a válaszban.
  
  II. authenticateUser – Middleware a felhasználó hitelesítéséhez Authorization Header segítségével
  - Funkció:
    - A middleware ellenőrzi, hogy a kérés tartalmazza-e a JWT tokent az Authorization header-ben, és az érvényességét is ellenőrzi. Ha a token érvényes, akkor a felhasználói adatokat hozzáadja a req.user objektumhoz, különben hibát jelez.
- Bemenet:
  -  Authorization Header: A kérésben található Authorization header, amely tartalmazza a token-t. A header formátuma: Bearer <token>.
- Funkcionalitás:
  - Token keresése: A middleware megpróbálja kinyerni a JWT tokent a Authorization header-ből.
  - Token validálás: A jwt.verify metódus segítségével érvényesíti a tokent a .env fájlban tárolt JWT_SECRET kulcs használatával.
  - Hibák:
    - Ha nincs token a header-ben, akkor 401-es státuszkóddal hibaüzenet érkezik: Nincs token, hozzáférés megtagadva.
    - Ha a token érvénytelen, akkor 401-es státuszkóddal hibaüzenet érkezik: Érvénytelen token.
- Válasz:
  - Sikeres hitelesítés: Ha a token érvényes, a felhasználói adatokat (dekódolt token) hozzáadja a req.user objektumhoz, majd a next() metódust hívja, hogy a következő middleware-t vagy route handler-t lefuttathassa.
  - Hiba: Ha a token nem található vagy érvénytelen, hibát küld vissza a válaszban.

---
 
 - 📎 upload – Fájlok feltöltése (Multer middleware)
 - ### **Függőségek:**
   - multer: A fájlok feltöltésére használt middleware az Express.js alkalmazások számára.
   - fs: A fájlrendszer kezelésére használt modul.
   - path: A fájlok elérési útvonalának kezelésére használt modul.
  
  - Funkció:
    -  A upload middleware lehetővé teszi a fájlok (képformátumok) feltöltését az Express.js alkalmazásba. A feltöltéshez szükséges beállítások közé tartozik a fájlok méretének korlátozása, a fájl típusának ellenőrzése, valamint a fájlok elnevezése és tárolása a szerveren.
  I. Funkcionalitás:
  - destination:
    - A fájlokat az uploads/ mappába tárolja.
    - Ha a mappa nem létezik, a middleware automatikusan létrehozza azt a fs.existsSync() és fs.mkdirSync() segítségével.
  - filename:
    - A fájl nevét a következő formátumban generálja: <felhasználói_azonosító>-<dátum>-<eredeti_fájlnév>.
    - A dátum ISO 8601 formátumban van, például: 2025-04-09.
    - A fájlok így egyediek lesznek, és nem ütköznek egymással, mivel tartalmazzák a felhasználó azonosítóját és a feltöltés dátumát.

II. Upload (Feltöltési beállítások):
- fileSize limit: A feltöltött fájl maximális mérete 10MB, amit a limits beállításban adunk meg. Ha egy fájl meghaladja ezt a méretet, akkor a rendszer elutasítja a feltöltést.
- fileFilter: A fájl típusát ellenőrizzük a filetypes változó segítségével. A megengedett formátumok:
- _**.jpeg, .jpg, .png, .gif, .webp, .avif.**_
- Ha a fájl kiterjesztése vagy MIME típusa nem egyezik a megadott típusokkal, akkor hibaüzenetet küldünk vissza a következővel: Csak képformátumban lehet feltölteni a jelmezeket.

- Válasz:
  -  Sikeres feltöltés: A fájl sikeresen feltöltődik a szerverre, és a válaszban a feltöltött fájl elérési útja (vagy más információ) kerül visszaküldésre, ha szükséges.
  -  Hiba: Fájl túl nagy (ha a fájl meghaladja a 10MB-ot)
    
</details>

---

<details>
<summary>Models</summary>

- database.js – Adatbázis kapcsolat létrehozása
 - ### **Függőségek:**
   - mysql2: MySQL adatbázishoz való csatlakozást biztosító Node.js könyvtár.
   - dotenvConfig: Konfigurációs fájl, amely környezeti változókból olvassa be az adatbázis elérési adatokat.
- Funkció:
  - Ez a modul létrehoz egy MySQL connection pool-t a mysql2 csomag segítségével, amelyet az alkalmazás használ az adatbázis-műveletekhez. A pool lehetővé teszi, hogy több lekérdezés fusson párhuzamosan hatékonyan és biztonságosan.

- Beállítások:
  1. host: Az adatbázis szerver hosztja (DB_HOST).
  2. port: Az adatbázis szerver portja (DB_PORT).
  3. user: Felhasználónév az adatbázishoz (DB_USER).
  4. password: A felhasználó jelszava (DB_PASSWORD).
  5. database: Az adatbázis neve, amelyhez csatlakozni szeretnénk (DB_DATABASE).
  6. timezone: Az időzóna 'Z', azaz UTC.
  7. waitForConnections: Ha igaz, akkor a kliens várakozik, ha nincs szabad kapcsolat.
  8. connectionLimit: A poolban engedélyezett maximális kapcsolatok száma (10).
  9. queueLimit: A várakozási sor maximális hossza. 0 esetén nincs limit.

- Funkcionalitás:
  -  MySQL Connection Pool: Egy connection pool használatával az alkalmazás teljesítménye jelentősen javul, mivel nem kell minden lekérdezéshez új kapcsolatot létrehozni.
  -  Biztonság: A kapcsolati adatok .env fájlból történő beolvasásával a szenzitív információk nincsenek közvetlenül a kódban.
 
  
</details>

---

<details>

<summary>Routes</summary>

- 👤 authRoutes.js – Felhasználói autentikációs útvonalak
  - ### **Függőségek:**
    - express: Express.js keretrendszer az útvonalak kezelésére.
    - authenticateToken: Middleware a JWT tokenek hitelesítésére (../middleware/jwtAuth).
    - authControllers: Az autentikációs műveleteket megvalósító controller függvények:
        - register, login, logout, loginUser, isLoggedIn, detectRole.
     
I. Útvonalak és Funkcionalitás:
1. POST /register – Felhasználó regisztrálása
   -  Controller: register
   -  Leírás: Új felhasználó létrehozása.
   -  Validálás: Az adatok formátumát és meglétét a controller végzi.
   -  Válasz:
     - Sikeres regisztráció: 201
     - Hibás vagy hiányzó adatok: 400
     - Belső hiba: 500

2.  POST /login – Felhasználói bejelentkezés
   - Controller: login
     - Leírás: Felhasználó bejelentkezése és JWT token generálása.
      - Válasz:
        - Sikeres bejelentkezés: 200 (cookie-ban auth_token)
        - Helytelen adatok: 401
        - Hiba esetén: 500
       
  3. POST /logout – Kijelentkezés
     - Middleware: authenticateToken
     - Controller: logout
     - Leírás: Felhasználó kijelentkeztetése, cookie törlése.
     - Válasz:
       - Sikeres kijelentkezés: 200
       - Nincs token: 403
      
  4. POST ./login – Admin felhasználó bejelentkezése (HIBA van az útvonalban)
     - ⚠️ Figyelem: Ez az útvonal hibás: ./login helyett /admin-login vagy valami egyedi kellene.
     - Middleware: authenticateToken
     - Controller: loginUser
     - Leírás: Autentikált bejelentkezés logikája (pl. admin).
     - Válasz: A controller alapján.
    
  5.  GET /isLoggedIn – Ellenőrzés, hogy be van-e jelentkezve a felhasználó
     - Middleware: authenticateToken
     - Controller: isLoggedIn
     - Leírás: Visszajelzés, ha a felhasználó be van jelentkezve.
     - Válasz:
       - Be van jelentkezve: 200
       - Token hiányzik vagy érvénytelen: 403
    
  6. GET /role – Felhasználói szerepkör lekérdezése
     - Middleware: authenticateToken
     - Controller: detectRole
     - Leírás: Visszaadja a felhasználó szerepkörét (pl. admin, user).
     - Válasz:
       - Sikeres lekérdezés: 200
       - Hibák esetén: 403, 500
      
  7. Exportálás:
     - A router exportálva van, hogy a fő app.js vagy server.js fájlban mountolható legyen pl. /auth útvonal alá.

---

- 🛒 cartRoutes.js – Kosár műveletek útvonalai
   - ### **Függőségek:**
     - express: Express.js router a HTTP-kérések kezeléséhez.
     - jwtAuth: Middleware (authenticateUser) a felhasználó hitelesítéséhez JWT token alapján.
     - cartController: A kosárhoz kapcsolódó logikákat tartalmazó controller függvények:
       - purchaseProduct, checkCart, removeItemFromCart, updateQuantity, checkout, deleteCartItem.
      
I. Útvonalak és Funkcionalitás:

  1. POST /add – Termék hozzáadása a kosárhoz
     - Middleware: authenticateUser
     - Controller: purchaseProduct
     - Leírás: Hozzáad egy terméket az aktuális felhasználó kosarához.
     - Bemenet: Termék adatai (pl. product_id, quantity) a req.body-ban.
     - Válasz:
       - Siker: 200 vagy 201
       - Hiba: 400, 401, 500
      
  2. POST /cart/update-quantity – Kosárban lévő termék mennyiségének frissítése
     - Middleware: authenticateUser
     - Controller: updateQuantity
     - Leírás: Módosítja egy termék mennyiségét a felhasználó kosarában.
     - Bemenet: product_id, new_quantity a req.body-ban.
     - Válasz:
       - Siker: 200
       - Hibás adat vagy jogosultság hiánya: 400, 401, 403
      
  3. DELETE /remove/:product_id – Termék eltávolítása a kosárból
     - Middleware: authenticateUser
     - Controller: removeItemFromCart
     - Leírás: Törli a megadott product_id-val rendelkező terméket a kosárból.
     - Válasz:
       - Siker: 200
       - Termék nem található: 404
       - Hiba: 401, 500
      
  4. GET /check-cart – Kosár tartalmának lekérdezése
     - Middleware: authenticateUser
     - Controller: checkCart
     - Leírás: Lekéri a bejelentkezett felhasználó kosarának tartalmát.
     - Válasz:
       - Siker: 200 – Kosár adatok tömbje
       - Hiba: 401, 500
      
  5.  POST /checkout – Pénztár folyamat indítása
     - Middleware: authenticateUser
     - Controller: checkout
     - Leírás: Lezárja a vásárlást, fizetési/feldolgozási művelet elindítása.
     - Válasz:
        - Siker: 200 vagy 201
        - Hiba: 400, 401, 500
    
  6. DELETE /deleteCartItem/:product_id – Kosár elem törlése
     - Middleware: authenticateUser
     - Controller: deleteCartItem
     - Megjegyzés: Úgy tűnik, ez funkcionálisan azonos a /remove/:product_id útvonallal. Ha nem különböznek érdemben, érdemes lehet összevonni őket.
     - Válasz: Hasonló, mint a remove-nál.
    
  7. Exportálás:
     - A router exportálva van, hogy beilleszthető legyen a fő alkalmazásba (pl. /cart útvonal prefixel).
    
---

- ❤️ likeRoutes.js – Kedvencek (Like) műveletek útvonalai
     - ### **Függőségek:**
       -  express: Express router a HTTP-kérések kezeléséhez.
       -  jwtAuth: Middleware (authenticateToken) a felhasználó JWT-alapú hitelesítéséhez.
       -  likeController: A kedvencekhez kapcsolódó logikát tartalmazó controller függvények:
         - likeProduct, unlikeProduct, checkLike.
      
I.  Útvonalak és Funkcionalitás:

1.  POST /:product_id – Termék hozzáadása a kedvencekhez
   - Middleware: authenticateToken
   - Controller: likeProduct
   - Leírás: Hozzáadja a megadott product_id-val rendelkező terméket a bejelentkezett felhasználó kedvenceihez.
   - Bemenet:
     - product_id: az útvonal paraméterből (req.params)
  - Válasz:
    - Siker: 201 – Termék hozzáadva a kedvencekhez
    - Már létezik: 409 – A termék már szerepel a kedvencek között
    - Hiba: 401, 500
   
2. GET /check – Kedvencek ellenőrzése
   - Middleware: authenticateToken
   - Controller: checkLike
   - Leírás: Lekérdezi a felhasználó által kedvelt termékek listáját.
   - Válasz:
     - Siker: 200 – A felhasználó kedvenceinek listája
     - Hiba: 401, 500
    
3. DELETE /likes/:product_id – Termék eltávolítása a kedvencek közül
   - Middleware: authenticateToken
   - Controller: unlikeProduct
   - Leírás: Törli a megadott product_id-val rendelkező terméket a felhasználó kedvenceiből.
   - Válasz:
     - Siker: 200 – Termék eltávolítva
     - Nem található: 404 – A termék nem volt kedvenc
     - Hiba: 401, 500
    
4. Exportálás:
   - A router exportálva van, hogy beilleszthető legyen a fő alkalmazásba (pl. /likes útvonal prefixel).

---

- 📋 productsDescriptionRoutes.js – Termékleírás frissítése
  - ### **Függőségek:**
    - express: Express router a HTTP-kérések kezeléséhez.
    - productsDescriptionController: A termékek leírásának frissítéséért felelős controller, amely tartalmazza az updateProductDescription függvényt.
   
I. Útvonalak és Funkcionalitás:

1. POST /update-description – Termék leírásának frissítése
  - Controller: updateProductDescription
  - Leírás: Frissíti egy adott termék leírását az adatbázisban.
  - Bemenet (a req.body-ból):
    -  product_id: A frissítendő termék azonosítója.
    -  new_description: Az új leírás szövege.
  -  Válasz:
    -  Siker: 200 – A termékleírás sikeresen frissítve.
    - Hiányzó vagy érvénytelen adat: 400 – Hibás vagy hiányzó bemeneti mezők.
    - Nem található termék: 404 – A megadott termék nem létezik.
    - Hiba: 500 – Belső szerverhiba adatbázis művelet során.

2. Exportálás:
   - A router exportálva van, hogy beilleszthető legyen a fő alkalmazásba (pl. /products útvonal prefixel).
  
---

- 📦 productsRoutes.js – Termékekkel kapcsolatos útvonalak
  - ### **Függőségek:**
    - express: Express router a HTTP-kérések kezeléséhez.
    - authenticateToken: Middleware a JWT-alapú hitelesítéshez.
    - isAdmin: Middleware/controller függvény, ami ellenőrzi, hogy a bejelentkezett felhasználó admin-e.
    - upload: A multer middleware képek feltöltéséhez.
    - productsController: A termékekhez kapcsolódó műveleteket tartalmazó controller:
      - getALLproduct, uploadProduct, filterProducts, deleteProduct, updateProduct.
     
I. Útvonalak és Funkcionalitás:

1. GET /getALLproduct – Összes termék lekérdezése
   - Controller: getALLproduct
   - Leírás: Lekérdezi az adatbázisban lévő összes terméket.
   - Válasz:
     - Siker: 200 – Terméklista visszaadva.
      - Hiba: 500 – Adatbázis hiba.
    
2. POST /uploadProduct – Új termék feltöltése (csak admin)
   - Middlewares:
      - authenticateToken: Bejelentkezés ellenőrzése.
      - isAdmin: Jogosultság ellenőrzése (csak admin).
      - upload.single('productImage'): Fájl feltöltése a productImage mezőből.
   - Controller: uploadProduct
   - Leírás: Új termék hozzáadása az adatbázishoz képfeltöltéssel együtt.
   - Válasz:
     - Siker: 201 – Termék sikeresen hozzáadva.
     - Jogosultság hiány: 403 – Nem admin jogosultság.
     - Hiba: 400, 500

3. PUT /:id – Termék frissítése (csak admin)
   - Middlewares:
      - authenticateToken
      - isAdmin
      - upload.single('product')
   - Controller: updateProduct
   - Leírás: Egy meglévő termék adatainak módosítása.
   - Bemenet:
      - id: A frissítendő termék azonosítója (req.params.id)
      - Képfájl és egyéb mezők a req.body-ból
   - Válasz:
      - Siker: 200 – Termék sikeresen frissítve.
      - Nem található: 404 – Nincs ilyen termék.
      - Jogosultság hiány: 403
      - Hiba: 400, 500

4. GET /filter – Termékek szűrése
   - Controller: filterProducts
   - Leírás: Termékek szűrése megadott kritériumok alapján (pl. kategória, ár stb.).
   - Válasz:
     - Siker: 200 – Szűrt terméklista visszaadva.
     - Hiba: 400, 500
    
5. DELETE /:product_id – Termék törlése (csak admin)
   - Middlewares:
      - authenticateToken
   - Controller: deleteProduct
   - Leírás: Egy megadott azonosítójú termék törlése az adatbázisból.
   - Bemenet:
      - product_id: Az útvonal paraméterből (req.params)
   - Válasz:
      - Siker: 200 – Termék sikeresen törölve.
      - Nem található: 404 – A termék nem létezik.
      - Jogosultság hiány: 403
      - Hiba: 500
6. Exportálás:
   - A router exportálva van, hogy beilleszthető legyen a fő alkalmazásba (pl. /products útvonal prefixel).

---

- 👨🏻‍💼 profileRoutes.js – Felhasználói profilhoz kapcsolódó útvonalak
  - ### **Függőségek:**
  - express: Express router létrehozásához.
  - authenticateToken: Middleware a JWT-alapú hitelesítéshez.
  - upload: multer middleware a profilkép feltöltéséhez.
  - profileController: A profilhoz kapcsolódó logikát kezelő függvények:
    - editProfileName, editProfilePassword, editProfileAdress, editProfilePic, getProfilePic, getUsername, getAddress
 
I. Útvonalak és Funkcionalitás:

1. PUT /editProfileName – Felhasználónév módosítása
   - Middlewares: authenticateToken
   - Controller: editProfileName
   - Leírás: A bejelentkezett felhasználó nevének frissítése.
   - Bemenet: username (req.body)
   - Válasz:
    - Siker: 200 – Név sikeresen frissítve.
     - Hibák: 400 (hiányzó adat), 404 (felhasználó nem található), 500 (adatbázis hiba)
  
2. PUT /editProfilePassword – Jelszó módosítása
   - Middlewares: authenticateToken
   - Controller: editProfilePassword
   - Leírás: A felhasználó jelszavának frissítése.
   - Bemenet: password (req.body)
   - Válasz:
     - Siker: 200 – Jelszó frissítve.
     - Hibák: 400 (nem megfelelő jelszó), 500 (belső hiba)

3. PUT /editProfileAdress – Cím módosítása
   - Middlewares: authenticateToken
   - Controller: editProfileAdress
   - Leírás: A felhasználó lakcímének frissítése.
   - Bemenet: address (req.body)
   - Válasz:
     - Siker: 200 – Cím frissítve.
     - Hibák: 400 (üres mező), 404 (nincs ilyen felhasználó), 500 (adatbázis hiba)

4. PUT /editProfilePic – Profilkép módosítása
   - Middlewares: authenticateToken, upload.single('profile_pic')
   - Controller: editProfilePic
   - Leírás: A felhasználó új profilképének feltöltése és mentése.
   - Válasz:
     - Siker: 200 – Profilkép sikeresen frissítve.
     - Hibák: 500 – Fájlkezelési vagy adatbázis hiba

5. GET /pic – Profilkép lekérdezése
   - Middlewares: authenticateToken
   - Controller: getProfilePic
   - Leírás: A bejelentkezett felhasználó profilképének fájlnevét adja vissza.
   - Válasz:
     - Siker: 200 – Profilkép fájlnév.
     - Hibák: 404 (felhasználó nem található)

6. GET /username – Felhasználónév lekérdezése
   - Middlewares: authenticateToken
   - Controller: getUsername
   - Leírás: Visszaadja a bejelentkezett felhasználó nevét.
   - Válasz:
     - Siker: 200 – Felhasználónév.
     - Hiba: 404 – Felhasználó nem található

7. GET /address – Cím lekérdezése
   - Middlewares: authenticateToken
   - Controller: getAddress
   - Leírás: A bejelentkezett felhasználó címét adja vissza.
   - Válasz:
     - Siker: 200 – Lakcím.
     - Hiba: 404 – Felhasználó nem található

8. Exportálás:
   - A router exportálva van a fő alkalmazásba történő beillesztéshez (pl. /profile útvonal prefixel).

---

- 🔎 searchRoutes.js – Termékek kereséséhez kapcsolódó útvonal
  - ### **Függőségek:**
     - express: Express Router használatához.
     - searchController: A termékkereséssel kapcsolatos logikát tartalmazó modul.
       - searchProducts: A termékek keresését megvalósító függvény.
      
I. Útvonal és Funkcionalitás:

1. GET /products/:search? – Termékek keresése kulcsszó alapján
   - Controller: searchProducts
   - Leírás:
      - Ha nincs megadott keresőkifejezés (:search), akkor az összes terméket visszaadja.
      - Ha meg van adva keresőkifejezés, akkor a product_name, description, illetve price mezőkre szűr az SQL LIKE feltételével.
   - Paraméter (opcionális):
      - :search – Keresett kifejezés (pl. termék neve, leírása, ára)
   - Válasz:
      - Sikeres lekérdezés: 200 – A keresési feltételeknek megfelelő termékek listája.
      - Hibák:
        - 500 – Adatbázis hiba esetén hibaüzenetet küld vissza ("Adatbázis hiba")

2. Exportálás:
   - A router exportálva van, így a fő alkalmazásban hozzáadható egy /search prefix-szel.

</details>


# app.js – Alkalmazás belépési pontja
  1. Függőségek:
    - express: A szerver létrehozásához használt web framework.
    - cors: A cross-origin kérések kezelésére.
    - cookie-parser: A HTTP-sütik kezeléséhez.
    - path: Az elérési utak kezelésére szolgáló natív Node.js modul.
   
  2. Saját middleware-ek:
    - limiter: A rate limiter middleware, ami megakadályozza a túl sok kérés egy időn belül.
     - authenticateToken: A JWT token ellenőrzésére használt middleware.
  3. Betöltött route-ok:
      - /api/auth: Felhasználói hitelesítés (regisztráció, bejelentkezés, stb.)
      - /api/profile: Felhasználói profilműveletek (név, jelszó, cím módosítás, stb.)
      - /api/likes: Termék kedvelésének kezelése.
      - /api/products: Termékek listázása, feltöltése, szerkesztése, törlése.
      - /api/orders: Rendelések kezelése.
      - /api/cart: Kosárhoz kapcsolódó műveletek.
      - /: Termékleírás frissítése.
      - /api: Termék keresés.
        
   4. Middleware-ek:
      - express.json(): A JSON típusú body-k elemzésére.
      - express.urlencoded({extended: true}): URL-kódolt body-k elemzése.
      - cookieParser(): Sütik olvasása a kérésekből.
      - cors({ origin: ..., credentials: true }): Engedélyezi a CORS kéréseket a frontend (pl. Netlify) felől.

  5. Statikus fájlkezelés:
     - app.use('/uploads', express.static(...)): A feltöltött fájlokat (pl. profilkép, termékkép) statikus útvonalon keresztül teszi elérhetővé.

  6. Megjegyzések:
     - Több route modul többször is regisztrálva van (pl. cartRoutes, productsRoutes, likeRoutes, profileRoutes), ami redundáns lehet. Ajánlott ezeket egyszer használni.
     - Kommentben szerepelnek a jövőbeli jelszó-helyreállító útvonalak (forgotPasswordRoutes, resetPasswordRoutes) – ezek implementálása után aktiválhatók.
     - A limiter jelenleg kikommentelt – éles környezetben érdemes aktiválni a DoS védelem érdekében.
