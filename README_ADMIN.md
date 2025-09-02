# Admin Dashboard

Un tableau de bord administrateur moderne et responsive construit avec React, TypeScript, Tailwind CSS et Shadcn UI.

## 🚀 Fonctionnalités

- **Design moderne et responsive** avec Tailwind CSS
- **Composants UI élégants** avec Shadcn UI
- **Gestion d'état** avec React Query (TanStack Query)
- **Routing** avec React Router v6
- **TypeScript** pour un développement typé et sécurisé
- **Performance optimisée** avec Vite

### Pages incluses :
- **Dashboard** - Vue d'ensemble avec métriques et statistiques
- **Utilisateurs** - Gestion des utilisateurs avec recherche et filtres
- **Paramètres** - Configuration de l'application et préférences

## 🛠️ Technologies utilisées

- **React 18** - Framework JavaScript
- **TypeScript** - Superset typé de JavaScript
- **Vite** - Build tool rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **Shadcn UI** - Composants UI modernes
- **React Query** - Gestion des données et cache
- **React Router** - Routing côté client
- **Lucide React** - Icônes SVG

## 📦 Installation

1. Cloner le projet :
```bash
git clone <url-du-repo>
cd admin-dashboard
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer le serveur de développement :
```bash
npm run dev
```

4. Ouvrir [http://localhost:5173](http://localhost:5173) dans votre navigateur

## 🎨 Structure du projet

```
src/
├── components/           # Composants React
│   ├── ui/              # Composants UI de base (Shadcn)
│   ├── AdminDashboard.tsx
│   ├── Header.tsx
│   └── Sidebar.tsx
├── pages/               # Pages de l'application
│   ├── Dashboard.tsx
│   ├── Users.tsx
│   └── Settings.tsx
├── lib/                 # Utilitaires
│   └── utils.ts
├── App.tsx             # Composant principal
├── main.tsx            # Point d'entrée
└── index.css           # Styles globaux
```

## 🎨 Personnalisation

### Thème et couleurs
Les couleurs peuvent être personnalisées dans `src/index.css` en modifiant les variables CSS :

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... autres variables */
}
```

### Ajouter de nouveaux composants
Pour ajouter un nouveau composant Shadcn UI :

1. Aller sur [ui.shadcn.com](https://ui.shadcn.com/)
2. Choisir le composant désiré
3. Copier le code dans `src/components/ui/`

## 📝 Scripts disponibles

- `npm run dev` - Lancer le serveur de développement
- `npm run build` - Builder l'application pour la production
- `npm run preview` - Prévisualiser le build de production
- `npm run lint` - Lancer ESLint

## 🔗 API Integration

L'application utilise React Query pour la gestion des données. Exemple d'utilisation :

```typescript
import { useQuery } from '@tanstack/react-query'

const { data: users, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
})
```

## 🌟 Prochaines fonctionnalités

- [ ] Authentification et autorisation
- [ ] Graphiques et visualisations de données
- [ ] Mode sombre / clair
- [ ] Notifications en temps réel
- [ ] Export de données
- [ ] Tests unitaires et d'intégration

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

---

**Développé avec ❤️ en utilisant React, TypeScript et Tailwind CSS**
