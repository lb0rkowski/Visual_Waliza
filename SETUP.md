# ETAP 3 — MySQL na home.pl

## Pliki w paczce

```
NOWE:
├── lib/db.ts                    ← Połączenie MySQL (mysql2 pool)
├── app/api/bookings/route.ts    ← API: rezerwacje (GET, POST, DELETE)
├── app/api/contact/route.ts     ← API: formularz kontaktowy (POST)
├── app/api/messages/route.ts    ← API: wiadomości admin (GET)
├── mysql-schema.sql             ← SQL do uruchomienia w phpMyAdmin
└── .env.local.template          ← Szablon zmiennych

ZAKTUALIZOWANE (nadpisz stare):
├── package.json                 ← + mysql2
├── lib/store.tsx                ← Fetch z /api/bookings
├── app/rezerwacje/page.tsx      ← Loading, async, error handling
├── app/kontakt/page.tsx         ← Wysyła do /api/contact
└── app/vault-x9k2m/page.tsx     ← Tab Wiadomości, refresh, confirm delete
```

---

## Krok po kroku

### 1. Utwórz bazę MySQL w home.pl

1. Zaloguj się do **panelu home.pl**
2. Przejdź do **Bazy danych MySQL**
3. Kliknij **Utwórz nową bazę**
4. Nazwa: np. `caseout` (home.pl doda prefix, np. `id123456_caseout`)
5. Zapisz sobie:
   - **Host** — np. `mysql.twoja-domena.pl` (widoczny w panelu)
   - **Nazwa bazy** — np. `id123456_caseout`
   - **Użytkownik** — np. `id123456_caseout`
   - **Hasło** — to co ustawiłeś

### 2. Uruchom SQL w phpMyAdmin

1. W panelu home.pl kliknij **phpMyAdmin** przy swojej bazie
2. Przejdź do zakładki **SQL**
3. Wklej całą zawartość pliku `mysql-schema.sql`
4. Kliknij **Wykonaj**
5. Powinieneś zobaczyć tabele `bookings` i `messages` + 3 demo rezerwacje

### 3. Stwórz .env.local

W katalogu projektu (obok package.json) stwórz plik `.env.local`:

```
DB_HOST=mysql.twoja-domena.pl
DB_PORT=3306
DB_USER=id123456_caseout
DB_PASS=twoje-haslo
DB_NAME=id123456_caseout
```

⚠️ **UWAGA**: Dane z home.pl. Host to NIE jest localhost!

### 4. Wrzuć pliki z paczki do projektu

Skopiuj zawartość paczki do odpowiednich lokalizacji:
- `lib/db.ts` → nowy plik
- `lib/store.tsx` → nadpisz stary
- `app/api/` → nowy folder z 3 route'ami
- `app/rezerwacje/page.tsx` → nadpisz
- `app/kontakt/page.tsx` → nadpisz
- `app/vault-x9k2m/page.tsx` → nadpisz
- `package.json` → nadpisz (dodany mysql2)

Możesz też usunąć `lib/supabase.ts` jeśli istnieje — nie jest już potrzebny.

### 5. Zainstaluj i odpal

```bash
npm install
npm run dev
```

### 6. Test

1. `/rezerwacje` → zarezerwuj sesję → sprawdź w phpMyAdmin czy pojawiła się w tabeli `bookings`
2. `/kontakt` → wyślij wiadomość → sprawdź `messages` w phpMyAdmin
3. `/vault-x9k2m` → hasło `caseout2025` → zakładka Wiadomości
4. Admin → Rezerwacje → DEL → rezerwacja znika z bazy

---

## Troubleshooting

| Problem | Rozwiązanie |
|---------|------------|
| `ECONNREFUSED` | Host w .env.local jest zły — sprawdź w panelu home.pl |
| `Access denied` | Zły user/hasło w .env.local |
| `Unknown database` | Nazwa bazy z prefixem, np. `id123456_caseout` nie `caseout` |
| `ER_NOT_SUPPORTED_AUTH_MODE` | Dodaj do lib/db.ts: `authPlugins: { mysql_native_password: () => () => Buffer.from('password') }` |
| Timeout na home.pl | home.pl blokuje zewnętrzne połączenia MySQL — app musi stać na tym samym serwerze LUB na Vercel z whitelistowanym IP |
| Pusta strona | Restartuj `npm run dev` po dodaniu .env.local |

---

## ⚠️ Ważne: hosting a baza

home.pl domyślnie **blokuje zewnętrzne połączenia do MySQL**. 
To znaczy, że `npm run dev` na Twoim komputerze może nie mieć dostępu do bazy na home.pl.

**Opcje:**

**A) Odblokuj zdalny dostęp** (zalecane na dev)
- Panel home.pl → Bazy MySQL → Twoja baza → **Zdalny dostęp**
- Dodaj swoje IP (sprawdź na whatismyip.com)
- Albo wpisz `%` żeby zezwolić na wszystkie (mniej bezpieczne)

**B) Lokalna baza na dev** (alternatywa)
- Zainstaluj MySQL lokalnie
- Użyj `DB_HOST=localhost` w .env.local
- Na produkcji (Vercel/home.pl) ustaw prawdziwe dane

**C) Deploy na home.pl** (produkcja)
- Jeśli app stoi na home.pl Node.js — połączenie będzie lokalne, zero problemów
