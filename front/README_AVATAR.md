# 📷 Configuration Supabase Storage pour les Avatars

## 🚀 Configuration du Bucket

### 1. Créer le bucket dans Supabase Dashboard

1. **Aller dans Storage** → Create a new bucket
2. **Nom du bucket** : `avatars`
3. **Public bucket** : ✅ Coché (pour les URLs publiques)
4. **File size limit** : 5MB
5. **Allowed MIME types** : `image/*`

### 2. Configuration RLS (Row Level Security)

#### Policies nécessaires :

**Policy 1 : Upload (INSERT)**
```sql
-- Nom : "Users can upload their own avatar"
-- Table : objects
-- Operation : INSERT

(bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
```

**Policy 2 : Read (SELECT)**
```sql
-- Nom : "Anyone can view avatars"
-- Table : objects  
-- Operation : SELECT

bucket_id = 'avatars'
```

**Policy 3 : Update (UPDATE)**
```sql
-- Nom : "Users can update their own avatar"
-- Table : objects
-- Operation : UPDATE

(bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
```

**Policy 4 : Delete (DELETE)**
```sql
-- Nom : "Users can delete their own avatar"
-- Table : objects
-- Operation : DELETE

(bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
```

## 📁 Structure des fichiers

```
avatars/
├── {user_id_1}/
│   └── avatar_{uuid}.jpg
├── {user_id_2}/
│   └── avatar_{uuid}.png
└── {user_id_3}/
    └── avatar_{uuid}.webp
```

## 🔧 Variables d'environnement

Assurez-vous d'avoir dans votre `.env` :

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📋 Installation des dépendances

```bash
npm install uuid
```

## 🎯 Fonctionnalités implémentées

### ✅ Service AvatarService
- Upload avec validation (type, taille)
- Récupération d'avatar
- Suppression automatique de l'ancien avatar
- Gestion des erreurs
- Avatar par défaut via UI Avatars

### ✅ Hook useAvatar
- État de chargement
- Gestion des erreurs
- Auto-refresh après upload
- Intégration avec l'auth Supabase

### ✅ Composant AvatarUpload
- Interface drag & drop
- Preview en temps réel
- Design cohérent avec le site
- Boutons d'action stylisés
- Messages d'erreur informatifs
- Instructions claires

### ✅ Intégration Account.jsx
- Section dédiée aux avatars
- Styling cohérent
- Responsive design

## 🔍 Test de l'implémentation

1. **Vérifier l'auth** : L'utilisateur doit être connecté
2. **Tester l'upload** : Glisser-déposer ou cliquer
3. **Vérifier les permissions** : Seul le propriétaire peut modifier
4. **Tester la suppression** : Retour à l'avatar par défaut

## 🚨 Points d'attention

- **Sécurité** : Les policies RLS sont cruciales
- **Performance** : Les images sont automatiquement optimisées
- **Stockage** : Limite de 5MB par image
- **Nettoyage** : Ancien avatar supprimé automatiquement

## 🛠️ Commandes Supabase CLI (optionnel)

```bash
# Créer le bucket via CLI
npx supabase storage create avatars --public

# Appliquer les policies
npx supabase db push
```

## 📱 URLs d'exemple

- **Avatar uploadé** : `https://your-project.supabase.co/storage/v1/object/public/avatars/user-id/avatar_uuid.jpg`
- **Avatar par défaut** : `https://ui-avatars.com/api/?name=U&background=8b5cf6&color=ffffff&size=200`

## 🔄 Intégration avec l'existant

Le système s'intègre parfaitement avec :
- ✅ L'authentification Supabase existante
- ✅ Le design system du site (variables CSS)
- ✅ Les composants React existants
- ✅ La structure de fichiers du projet