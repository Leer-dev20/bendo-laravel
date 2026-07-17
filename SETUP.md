# Bendo — Guide de setup (nouveau contributeur)

Ce guide te permet de démarrer le projet dans un état identique à celui des autres contributeurs, sans retomber dans les pièges déjà rencontrés pendant le développement.

## 1. Prérequis

- **PHP 8.3** (via Laravel Herd — existe aussi pour Windows : https://herd.laravel.com/windows)
- **Composer 2**
- **Node.js** (version LTS récente, 20+)
- **Git**

Vérifie tes versions :
```bash
php -v
composer -V
node -v
npm -v
```

## 2. Cloner le projet et se mettre sur ta branche

```bash
git clone https://github.com/Leer-dev20/bendo-laravel.git
cd bendo-laravel
git checkout hamza
git pull origin test
```

## 3. Installer les dépendances (IMPORTANT : commandes exactes)

**Ne jamais utiliser `composer update` ou `npm install` en écrasant les verrous.** Utilise toujours :

```bash
composer install
npm ci
```

`npm ci` (et non `npm install`) installe **exactement** les versions figées dans `package-lock.json` — c'est ce qui garantit que tout le monde a les mêmes versions de dépendances, notamment :
- `lucide-react` verrouillé sur `0.462.0` (la v1.0 a supprimé les icônes de marques Instagram/Facebook/Twitter/Apple — voir section Pièges)
- `vite@^8` avec `@vitejs/plugin-react@^6` (versions compatibles entre elles)

## 4. Configuration de l'environnement

```bash
cp .env.example .env
php artisan key:generate
```

Base de données : le projet utilise **SQLite en local**. Vérifie que ton `.env` contient :
```env
DB_CONNECTION=sqlite
```
(pas besoin de `DB_HOST`/`DB_PORT`/`DB_DATABASE` pour SQLite)

Crée le fichier de base si besoin :
```bash
touch database/database.sqlite
```

⚠️ **Ne commite jamais `database/database.sqlite`** — vérifie qu'il est bien dans `.gitignore`. Chacun a sa propre base locale, régénérée via les migrations/seeders (qui eux sont commités).

## 5. Migrer et peupler la base

```bash
php artisan migrate:fresh --seed
```

Ça recrée toutes les tables et les peuple avec les restaurants/zones de test.

## 6. Lancer le projet

Dans 2 (ou 3) terminaux séparés :

```bash
php artisan serve
```
```bash
npm run dev
```

Optionnel (temps réel, si tu travailles sur cette partie) :
```bash
php artisan reverb:start
```

Le site est accessible sur `http://127.0.0.1:8000` (ou `http://localhost:8000` — **utilise `localhost` plutôt que `127.0.0.1`** si tu dois tester une fonctionnalité de géolocalisation navigateur, Safari/Chrome bloquent parfois l'API sur `127.0.0.1`).

## 7. Pièges déjà rencontrés (pour ne pas les reproduire)

- **`AuthorizesRequests` manquant** : si tu as une erreur `Call to undefined method ...::authorize()`, ouvre `app/Http/Controllers/Controller.php` et vérifie qu'il contient `use Illuminate\Foundation\Auth\Access\AuthorizesRequests;` + `use AuthorizesRequests;` dans la classe. Laravel 13 ne l'inclut plus par défaut.
- **Tailwind v4, pas v3** : ce projet n'a **pas** de `tailwind.config.js` — tout le thème est dans `resources/css/app.css` via `@theme`/`@utility`. Si tu dois référencer une variable CSS dans une classe arbitraire, la syntaxe est `w-(--ma-variable)` et **non** `w-[--ma-variable]` (v3), sinon ça casse silencieusement la mise en page.
- **`lucide-react`** : reste sur `0.462.0`. Ne le mets jamais à jour sans vérifier — la v1.0 a supprimé les icônes de marques.
- **Champs de formulaire vides → erreur `NOT NULL constraint`** : le middleware Laravel convertit les chaînes vides en `null`. Les contrôleurs gèrent déjà ça avec des valeurs par défaut (`$data['champ'] ?? ''`), donc si tu ajoutes un nouveau champ optionnel dans un formulaire, pense à faire pareil côté contrôleur.
- **403/404 après modification de routes** : si le comportement semble incohérent avec ton code, vide les caches avant de chercher plus loin :
  ```bash
  php artisan route:clear
  php artisan config:clear
  ```
- **Mutations Inertia dans l'admin** : toujours ajouter `preserveState: true` (en plus de `preserveScroll: true`) sur les `router.post/patch/delete`, sinon la page recharge et revient sur l'onglet "Aperçu" au lieu de rester sur l'onglet en cours.

## 8. Structure du projet (repères rapides)

- `resources/js/Pages/` : une page par route (convention Inertia)
- `resources/js/components/ui/` : composants shadcn/ui portés (Button, Dialog, Sidebar...) — génériques, pas de logique métier
- `resources/js/components/` : composants métier (Header, CartFab, ServiceWidget...)
- `resources/js/context/CartContext.jsx` : état du panier (client, localStorage)
- `resources/js/hooks/useAuth.js` : accès à l'utilisateur connecté (props Inertia partagées, pas de requête séparée)
- `app/Http/Controllers/Admin/` : contrôleurs réservés à l'espace admin
- `app/Services/Payment/` : intégrations Stripe/Wave/Orange Money

## 9. Rappel du workflow Git

```bash
git checkout hamza
git pull origin test        # avant de commencer à coder
# ... travail ...
git add .
git commit -m "message clair"
git push origin hamza
```
Puis ouvre une **Pull Request `hamza → test`** sur GitHub (pas de push direct sur `test` ou `main`).
