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

- ✅ productsController.js:
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

      - profileController.js – Funkcionalitás és Leírás
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

            - searchProductscontroller.js – Termékek keresése
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
