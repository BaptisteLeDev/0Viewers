# 📺 API Twitch - Documentation

---

## 🔑 Authentification

### Obtenir un token d'accès

**Endpoint :**
```http
POST https://id.twitch.tv/oauth2/token?client_id=<client_id>&client_secret=<client_secret>&grant_type=client_credentials
```

**Paramètres :**
- `client_id` : Votre ID client Twitch
- `client_secret` : Votre secret client Twitch
- `grant_type` : `client_credentials`

---

## 🎥 Récupération des streams

### Streams francophones

**Endpoint :**
```http
GET https://api.twitch.tv/helix/streams?language=fr
```

**Headers requis :**
```http
Authorization: Bearer <access_token>
Client-Id: <client_id>
```

**Paramètres :**
- `language=fr` : Filtre les streams en français

---

## 📋 Notes importantes

> ⚠️ **Attention :** Remplacez `<access_token>` et `<client_id>` par vos vraies valeurs.

> 📖 **Documentation complète :** [Twitch API Reference](https://dev.twitch.tv/docs/api/reference)