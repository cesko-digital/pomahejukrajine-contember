# Pomáhej Ukrajině

## Části aplikace

Aplikace je rozdělena do následujících částí:
- Front-end: https://www.pomahejukrajine.cz/ v next.js; repo: https://github.com/cesko-digital/pomahejukrajine-web
- Server: API se server-side cachováním pro fungování stránky s nabídkami pomoci (https://www.pomahejukrajine.cz/nabidky); repo: https://github.com/cesko-digital/pomahejukrajine-server
- Worker: Odesílání emailů dobrovolníkům; repo: https://github.com/cesko-digital/pomahejukrajine-worker
- Contember - dokumentace na https://docs.contember.com/; repo: https://github.com/cesko-digital/pomahejukrajine-contember
	- API: Úložiště všech dat. 
	- Admin: Přístup pro administrátory, neziskové organizace a pod.


## Popis nejvýznamějších entit ve schématu

- Čísleníky
  - `OfferType`: Typ pomoci. Například doprava, tlumočení, ubytování.
  - `Question`: Jednotlivá doplňující otázka pod typem pomoci.
  - `QuestionOption`: Možnost odpovědi na otázku. Relevatní pro typy otázky radio a checkbox. Pokud requireSpecification=true, tak se po vybrání možnosti zobrazí povinné textové políčko na doplnění odpovědi.
  - `OfferStatus`: Stav nabídky, přiřazuje se v administraci. Uživatel ho může měnit jen omezeně (a jen podle hodnot OfferStatusEnum)
- Data nabídek
  - `Volunteer`: Dobrovolník. Vytváří se vždy při vložení nové nabídky (= odeslání formuláře).
  - `Offer`: Jednotlivá nabídka. Vytváří se pro každý zaškrtnutý checkbox pod "co mohu nabídnout"
  - `OfferParameter`: Odpovědi na otázky u nabídky. V případě typů radio, text, textare, number a date se hodnota uloží jako value v této entitě. Do fieldu specification se ukládá text z dodatečného políčka (u typu radio).
  - `OfferParameterValue`: Odpovědi na otázky u nabídky. V případě typů checkbox a district se hodnota uloží jako value v této entitě. Do fieldu specification se ukládá text z dodatečného políčka (u typu checkbox).


## Proces přidání nabídky

1. Dobrovolník vyplní na FE nabídky pomoci (https://www.pomahejukrajine.cz/nabidka). Ta se odešle na API routu v next.js a tam se zvaliduje a uloží přes GraphQL Content API do Contemberu. 
2. Worker kontroluje pravidelně nové dobrovolníky a pošle jim email s ověřovacím linkem.
3. Ověřovací link vede na FE, kde si nastaví heslo (https://www.pomahejukrajine.cz/verify). To se pošle na API routu v next.js, která založí uživatele v Contember Tenant API a nastaví dobrovolníka jako ověřeného. 
4. V tu chvíli se nabídka začne zobrazovat v nabídkách pomoci na FE (po té, co si server refreshne cache) a v administraci.

## Lokální spuštění

Je potřeba spustit všechny části, které člověk potřebuje pro vývoj - prakticky vždy Contember a front-end, často i worker.

Contember (tento repozitář) se spustí pomocí `npm install` a `npm start` (je potřeba `npm` verze 7+ a docker s docker-compose).

