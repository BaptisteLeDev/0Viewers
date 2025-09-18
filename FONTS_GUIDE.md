# 🎨 Guide des Polices - 0Viewers

## ✅ Polices intégrées :

### 1. **Iceland** - Pour le logo
- ✅ Google Font ajoutée dans `index.html`
- ✅ Variable CSS : `--font-logo: "Iceland", sans-serif`
- ✅ Classe : `.iceland-regular`

### 2. **Share Tech Mono** - Pour le texte général
- ✅ Google Font ajoutée dans `index.html`
- ✅ Variable CSS : `--font-primary: "Share Tech Mono", monospace`
- ✅ Classe : `.share-tech-mono-regular`
- ✅ Police par défaut du `body`

## 🎯 Utilisations :

### Police Iceland (Logo) :
```jsx
<span className="iceland-regular">0Viewers</span>
```

**Appliquée sur :**
- ✅ Logo navigation
- ✅ Mentions "0Viewers" dans auth (SignIn, SignUp)
- ✅ Footer
- ✅ Page Home (stats)

### Police Share Tech Mono (Texte) :
- ✅ Police par défaut pour tout le site
- ✅ Donne un style "coding/gaming" parfait pour Twitch

## 🔧 Classes utilitaires disponibles :

```css
.iceland-regular        /* Police Iceland normale */
.share-tech-mono-regular /* Police Share Tech Mono normale */
.font-logo              /* Force Iceland (!important) */
.font-primary           /* Force Share Tech Mono (!important) */
.font-fallback          /* Police de fallback système */
```

## 📱 Rendu attendu :

- **Logo "0Viewers"** : Style épuré, moderne (Iceland)
- **Texte général** : Style monospace tech/gaming (Share Tech Mono)
- **Contraste parfait** pour l'univers gaming/streaming

## 🚀 Performance :

- **Preconnect** : `fonts.googleapis.com` et `fonts.gstatic.com`
- **Display: swap** : Affichage rapide avec fallback
- **Poids optimisé** : Seulement weight 400 pour chaque police

## 🧪 Test :

Vérifie que :
1. Le logo "0Viewers" utilise Iceland
2. Tout le reste utilise Share Tech Mono
3. Polices se chargent rapidement
4. Fallback fonctionne si Google Fonts indisponible

Style parfait pour une app de découverte de streamers ! 🎮✨