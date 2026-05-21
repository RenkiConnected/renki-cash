import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Home, LayoutDashboard, Smartphone, Battery, Camera, FileText, ChevronRight, ChevronUp, ChevronDown, Plus, Edit2, Trash2, Save, X, Palette, Type, Settings, Check, ArrowLeft, Upload, Sparkles, Lock } from 'lucide-react';
import { loadConfig, saveKey, subscribeConfig } from './storage';

// Mot de passe d'accès au tableau de bord
const DASHBOARD_PASSWORD = 'Raphael2232';

// ================== BASE DE DONNÉES INITIALE ==================
// Prix indicatifs basés sur les grilles publiques Back Market, Recommerce, Easy Cash (mai 2026)
// Tous éditables depuis le dashboard

const INITIAL_BRANDS = [
  { id: 'apple', name: 'Apple', logo: '🍎', logoImage: '', color: '#000000' },
  { id: 'samsung', name: 'Samsung', logo: '📱', logoImage: '', color: '#1428A0' },
  { id: 'xiaomi', name: 'Xiaomi', logo: '⚡', logoImage: '', color: '#FF6900' },
  { id: 'honor', name: 'Honor', logo: '✨', logoImage: '', color: '#E60020' },
  { id: 'oppo', name: 'Oppo', logo: '💚', logoImage: '', color: '#1BAF74' },
  { id: 'google', name: 'Google', logo: '🔍', logoImage: '', color: '#4285F4' },
];

// Les prix de vente concurrents ne sont plus stockés : ils sont saisis manuellement
// à chaque estimation. mp({ '256 Go': 790, ... }) ne sert plus qu'à définir la liste
// des capacités disponibles pour chaque modèle.
const mp = (obj) => Object.keys(obj);

const INITIAL_PRODUCTS = [
  // ===== APPLE — prix marché Très Bon État, mai 2026 =====
  { id: 'iphone-16-pro-max', brand: 'apple', name: 'iPhone 16 Pro Max', image: '', storage: mp({ '256 Go': 790, '512 Go': 940, '1 To': 1100 }) },
  { id: 'iphone-16-pro',     brand: 'apple', name: 'iPhone 16 Pro',     image: '', storage: mp({ '128 Go': 680, '256 Go': 760, '512 Go': 890 }) },
  { id: 'iphone-16-plus',    brand: 'apple', name: 'iPhone 16 Plus',    image: '', storage: mp({ '128 Go': 560, '256 Go': 630, '512 Go': 740 }) },
  { id: 'iphone-16',         brand: 'apple', name: 'iPhone 16',         image: '', storage: mp({ '128 Go': 490, '256 Go': 560, '512 Go': 660 }) },
  { id: 'iphone-15-pro-max', brand: 'apple', name: 'iPhone 15 Pro Max', image: '', storage: mp({ '256 Go': 660, '512 Go': 770, '1 To': 880 }) },
  { id: 'iphone-15-pro',     brand: 'apple', name: 'iPhone 15 Pro',     image: '', storage: mp({ '128 Go': 540, '256 Go': 610, '512 Go': 720 }) },
  { id: 'iphone-15-plus',    brand: 'apple', name: 'iPhone 15 Plus',    image: '', storage: mp({ '128 Go': 450, '256 Go': 510, '512 Go': 600 }) },
  { id: 'iphone-15',         brand: 'apple', name: 'iPhone 15',         image: '', storage: mp({ '128 Go': 390, '256 Go': 450, '512 Go': 530 }) },
  { id: 'iphone-14-pro-max', brand: 'apple', name: 'iPhone 14 Pro Max', image: '', storage: mp({ '128 Go': 500, '256 Go': 560, '512 Go': 660, '1 To': 750 }) },
  { id: 'iphone-14-pro',     brand: 'apple', name: 'iPhone 14 Pro',     image: '', storage: mp({ '128 Go': 410, '256 Go': 470, '512 Go': 550 }) },
  { id: 'iphone-14-plus',    brand: 'apple', name: 'iPhone 14 Plus',    image: '', storage: mp({ '128 Go': 340, '256 Go': 390, '512 Go': 460 }) },
  { id: 'iphone-14',         brand: 'apple', name: 'iPhone 14',         image: '', storage: mp({ '128 Go': 300, '256 Go': 350, '512 Go': 420 }) },
  { id: 'iphone-13-pro-max', brand: 'apple', name: 'iPhone 13 Pro Max', image: '', storage: mp({ '128 Go': 380, '256 Go': 440, '512 Go': 510, '1 To': 590 }) },
  { id: 'iphone-13-pro',     brand: 'apple', name: 'iPhone 13 Pro',     image: '', storage: mp({ '128 Go': 320, '256 Go': 370, '512 Go': 440 }) },
  { id: 'iphone-13',         brand: 'apple', name: 'iPhone 13',         image: '', storage: mp({ '128 Go': 250, '256 Go': 290, '512 Go': 350 }) },
  { id: 'iphone-13-mini',    brand: 'apple', name: 'iPhone 13 mini',    image: '', storage: mp({ '128 Go': 210, '256 Go': 240, '512 Go': 290 }) },
  { id: 'iphone-12-pro-max', brand: 'apple', name: 'iPhone 12 Pro Max', image: '', storage: mp({ '128 Go': 280, '256 Go': 320, '512 Go': 380 }) },
  { id: 'iphone-12-pro',     brand: 'apple', name: 'iPhone 12 Pro',     image: '', storage: mp({ '128 Go': 230, '256 Go': 270, '512 Go': 320 }) },
  { id: 'iphone-12',         brand: 'apple', name: 'iPhone 12',         image: '', storage: mp({ '64 Go': 160, '128 Go': 190, '256 Go': 230 }) },
  { id: 'iphone-12-mini',    brand: 'apple', name: 'iPhone 12 mini',    image: '', storage: mp({ '64 Go': 130, '128 Go': 160, '256 Go': 190 }) },
  { id: 'iphone-11-pro-max', brand: 'apple', name: 'iPhone 11 Pro Max', image: '', storage: mp({ '64 Go': 200, '256 Go': 240, '512 Go': 290 }) },
  { id: 'iphone-11-pro',     brand: 'apple', name: 'iPhone 11 Pro',     image: '', storage: mp({ '64 Go': 160, '256 Go': 190, '512 Go': 230 }) },
  { id: 'iphone-11',         brand: 'apple', name: 'iPhone 11',         image: '', storage: mp({ '64 Go': 120, '128 Go': 140, '256 Go': 170 }) },
  { id: 'iphone-se-2022',    brand: 'apple', name: 'iPhone SE (2022)',  image: '', storage: mp({ '64 Go': 100, '128 Go': 120, '256 Go': 150 }) },
  { id: 'iphone-xr',         brand: 'apple', name: 'iPhone XR',         image: '', storage: mp({ '64 Go': 80, '128 Go': 100, '256 Go': 120 }) },
  { id: 'iphone-xs-max',     brand: 'apple', name: 'iPhone XS Max',     image: '', storage: mp({ '64 Go': 100, '256 Go': 130, '512 Go': 160 }) },
  { id: 'iphone-xs',         brand: 'apple', name: 'iPhone XS',         image: '', storage: mp({ '64 Go': 80, '256 Go': 100, '512 Go': 130 }) },
  // ===== SAMSUNG =====
  { id: 's25-ultra', brand: 'samsung', name: 'Galaxy S25 Ultra', image: '', storage: mp({ '256 Go': 760, '512 Go': 860, '1 To': 970 }) },
  { id: 's25-plus',  brand: 'samsung', name: 'Galaxy S25+',      image: '', storage: mp({ '256 Go': 580, '512 Go': 670 }) },
  { id: 's25',       brand: 'samsung', name: 'Galaxy S25',       image: '', storage: mp({ '128 Go': 460, '256 Go': 520, '512 Go': 600 }) },
  { id: 's24-ultra', brand: 'samsung', name: 'Galaxy S24 Ultra', image: '', storage: mp({ '256 Go': 600, '512 Go': 690, '1 To': 790 }) },
  { id: 's24-plus',  brand: 'samsung', name: 'Galaxy S24+',      image: '', storage: mp({ '256 Go': 440, '512 Go': 520 }) },
  { id: 's24',       brand: 'samsung', name: 'Galaxy S24',       image: '', storage: mp({ '128 Go': 350, '256 Go': 400 }) },
  { id: 's23-ultra', brand: 'samsung', name: 'Galaxy S23 Ultra', image: '', storage: mp({ '256 Go': 440, '512 Go': 510, '1 To': 590 }) },
  { id: 's23-plus',  brand: 'samsung', name: 'Galaxy S23+',      image: '', storage: mp({ '256 Go': 330, '512 Go': 390 }) },
  { id: 's23',       brand: 'samsung', name: 'Galaxy S23',       image: '', storage: mp({ '128 Go': 270, '256 Go': 310 }) },
  { id: 's22-ultra', brand: 'samsung', name: 'Galaxy S22 Ultra', image: '', storage: mp({ '128 Go': 310, '256 Go': 360, '512 Go': 420 }) },
  { id: 's22-plus',  brand: 'samsung', name: 'Galaxy S22+',      image: '', storage: mp({ '128 Go': 220, '256 Go': 260 }) },
  { id: 's22',       brand: 'samsung', name: 'Galaxy S22',       image: '', storage: mp({ '128 Go': 180, '256 Go': 210 }) },
  { id: 'z-fold-6',  brand: 'samsung', name: 'Galaxy Z Fold 6',  image: '', storage: mp({ '256 Go': 900, '512 Go': 1000, '1 To': 1110 }) },
  { id: 'z-fold-5',  brand: 'samsung', name: 'Galaxy Z Fold 5',  image: '', storage: mp({ '256 Go': 630, '512 Go': 710 }) },
  { id: 'z-flip-6',  brand: 'samsung', name: 'Galaxy Z Flip 6',  image: '', storage: mp({ '256 Go': 540, '512 Go': 610 }) },
  { id: 'z-flip-5',  brand: 'samsung', name: 'Galaxy Z Flip 5',  image: '', storage: mp({ '256 Go': 350, '512 Go': 400 }) },
  { id: 'a55',       brand: 'samsung', name: 'Galaxy A55 5G',    image: '', storage: mp({ '128 Go': 200, '256 Go': 230 }) },
  { id: 'a54',       brand: 'samsung', name: 'Galaxy A54 5G',    image: '', storage: mp({ '128 Go': 160, '256 Go': 190 }) },
  { id: 'a35',       brand: 'samsung', name: 'Galaxy A35 5G',    image: '', storage: mp({ '128 Go': 150, '256 Go': 170 }) },
  // ===== XIAOMI =====
  { id: 'mi-14-ultra', brand: 'xiaomi', name: 'Xiaomi 14 Ultra',  image: '', storage: mp({ '512 Go': 670, '1 To': 760 }) },
  { id: 'mi-14-pro',   brand: 'xiaomi', name: 'Xiaomi 14 Pro',    image: '', storage: mp({ '256 Go': 500, '512 Go': 580 }) },
  { id: 'mi-14',       brand: 'xiaomi', name: 'Xiaomi 14',        image: '', storage: mp({ '256 Go': 400, '512 Go': 460 }) },
  { id: 'mi-13-pro',   brand: 'xiaomi', name: 'Xiaomi 13 Pro',    image: '', storage: mp({ '256 Go': 350, '512 Go': 410 }) },
  { id: 'mi-13',       brand: 'xiaomi', name: 'Xiaomi 13',        image: '', storage: mp({ '128 Go': 270, '256 Go': 320 }) },
  { id: 'redmi-note-13-pro-plus', brand: 'xiaomi', name: 'Redmi Note 13 Pro+', image: '', storage: mp({ '256 Go': 210, '512 Go': 250 }) },
  { id: 'redmi-note-13-pro',      brand: 'xiaomi', name: 'Redmi Note 13 Pro',  image: '', storage: mp({ '128 Go': 160, '256 Go': 190 }) },
  { id: 'redmi-note-13',          brand: 'xiaomi', name: 'Redmi Note 13',      image: '', storage: mp({ '128 Go': 120, '256 Go': 140 }) },
  { id: 'poco-x6-pro',            brand: 'xiaomi', name: 'Poco X6 Pro',        image: '', storage: mp({ '256 Go': 190, '512 Go': 230 }) },
  // ===== HONOR =====
  { id: 'honor-magic-6-pro', brand: 'honor', name: 'Honor Magic 6 Pro', image: '', storage: mp({ '256 Go': 490, '512 Go': 570 }) },
  { id: 'honor-magic-6',     brand: 'honor', name: 'Honor Magic 6',     image: '', storage: mp({ '256 Go': 350, '512 Go': 410 }) },
  { id: 'honor-magic-5-pro', brand: 'honor', name: 'Honor Magic 5 Pro', image: '', storage: mp({ '256 Go': 330, '512 Go': 390 }) },
  { id: 'honor-90',          brand: 'honor', name: 'Honor 90',          image: '', storage: mp({ '256 Go': 200, '512 Go': 240 }) },
  { id: 'honor-200-pro',     brand: 'honor', name: 'Honor 200 Pro',     image: '', storage: mp({ '512 Go': 380 }) },
  { id: 'honor-200',         brand: 'honor', name: 'Honor 200',         image: '', storage: mp({ '256 Go': 270, '512 Go': 320 }) },
  // ===== OPPO =====
  { id: 'find-x7-ultra', brand: 'oppo', name: 'Oppo Find X7 Ultra', image: '', storage: mp({ '256 Go': 560, '512 Go': 650 }) },
  { id: 'find-x7',       brand: 'oppo', name: 'Oppo Find X7',       image: '', storage: mp({ '256 Go': 430, '512 Go': 490 }) },
  { id: 'find-x6-pro',   brand: 'oppo', name: 'Oppo Find X6 Pro',   image: '', storage: mp({ '256 Go': 380, '512 Go': 440 }) },
  { id: 'reno-12-pro',   brand: 'oppo', name: 'Oppo Reno 12 Pro',   image: '', storage: mp({ '256 Go': 270, '512 Go': 320 }) },
  { id: 'reno-11-pro',   brand: 'oppo', name: 'Oppo Reno 11 Pro',   image: '', storage: mp({ '256 Go': 220, '512 Go': 260 }) },
  { id: 'reno-11',       brand: 'oppo', name: 'Oppo Reno 11',       image: '', storage: mp({ '256 Go': 170 }) },
  { id: 'a98',           brand: 'oppo', name: 'Oppo A98',           image: '', storage: mp({ '256 Go': 120 }) },
  // ===== GOOGLE =====
  { id: 'pixel-9-pro-xl', brand: 'google', name: 'Pixel 9 Pro XL', image: '', storage: mp({ '256 Go': 660, '512 Go': 760, '1 To': 870 }) },
  { id: 'pixel-9-pro',    brand: 'google', name: 'Pixel 9 Pro',    image: '', storage: mp({ '128 Go': 540, '256 Go': 600, '512 Go': 690 }) },
  { id: 'pixel-9',        brand: 'google', name: 'Pixel 9',        image: '', storage: mp({ '128 Go': 420, '256 Go': 490 }) },
  { id: 'pixel-8-pro',    brand: 'google', name: 'Pixel 8 Pro',    image: '', storage: mp({ '128 Go': 420, '256 Go': 480, '512 Go': 560, '1 To': 660 }) },
  { id: 'pixel-8',        brand: 'google', name: 'Pixel 8',        image: '', storage: mp({ '128 Go': 310, '256 Go': 370 }) },
  { id: 'pixel-8a',       brand: 'google', name: 'Pixel 8a',       image: '', storage: mp({ '128 Go': 250, '256 Go': 300 }) },
  { id: 'pixel-7-pro',    brand: 'google', name: 'Pixel 7 Pro',    image: '', storage: mp({ '128 Go': 270, '256 Go': 310, '512 Go': 370 }) },
  { id: 'pixel-7',        brand: 'google', name: 'Pixel 7',        image: '', storage: mp({ '128 Go': 200, '256 Go': 240 }) },
  { id: 'pixel-7a',       brand: 'google', name: 'Pixel 7a',       image: '', storage: mp({ '128 Go': 180 }) },
];

// ================================================================
// PARAMÈTRES DU CALCUL DE RACHAT — modifiables dans le dashboard
// ================================================================
// Logique :
//   prix de base = prix de vente concurrent saisi × (1 - décote concurrent 30%)
//   prix de rachat = base × coef d'état − décote batterie − décote caméra → × bonus facture
//   prix de revente suggéré = prix de rachat + marge (80 à 100 €)
const INITIAL_PRICING = {
  competitorDiscount: 0.25,   // 25% retirés du prix de vente concurrent
  resaleMarginMin: 80,        // marge basse pour le prix de revente suggéré
  resaleMarginMax: 100,       // marge haute pour le prix de revente suggéré
  conditionMultiplier: {
    'neuf': 1.00, 'comme-neuf': 0.90, 'bon': 0.80,
    'moyen': 0.65, 'mauvais': 0.45, 'tres-mauvais': 0.25,
  },
  batteryDeduction: {
    'a-remplacer':       { default: 50,  samsung: 80,  google: 80 },
    'non-fonctionnelle': { default: 100, samsung: 150, google: 150 },
  },
  cameraDeduction: {
    'a-remplacer': 60,
    'non-fonctionnelle': 120,
  },
  invoiceBonus: 1.05,
};


const DEFAULT_THEME = {
  primary: '#00B8D4',      // Bleu turquoise Coriolis
  primaryDark: '#0091A7',
  primaryLight: '#E0F7FA',
  secondary: '#1A2B47',    // Bleu marine accent
  background: '#FFFFFF',
  surface: '#F8FAFC',
  text: '#0F172A',
  textMuted: '#64748B',
  accent: '#FFB300',
  success: '#10B981',
  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  siteName: 'Renki Cash',
  logoUrl: '',
  fontSize: 16,
};

// ================================================================
// FONCTION DE CALCUL DU PRIX DE RACHAT
// ================================================================
// competitorPrice = prix de vente concurrent saisi manuellement (€)
function computeBuybackPrice({ product, competitorPrice, evaluation, pricing }) {
  const cp = parseFloat(competitorPrice);
  if (!product || !cp || cp <= 0) return null;

  const breakdown = [{ label: 'Prix de vente concurrent', value: Math.round(cp), type: 'base' }];

  // 1. Décote concurrent (30%)
  const discountPct = Math.round(pricing.competitorDiscount * 100);
  let p = cp * (1 - pricing.competitorDiscount);
  breakdown.push({ label: `Décote concurrent (−${discountPct}%)`, value: -Math.round(cp * pricing.competitorDiscount), type: 'sub' });

  // 2. Coefficient d'état
  if (evaluation.condition) {
    const mult = pricing.conditionMultiplier[evaluation.condition] ?? 1;
    const before = p;
    p = p * mult;
    const diff = Math.round(p - before);
    const pct = Math.round((mult - 1) * 100);
    breakdown.push({ label: `État (${pct > 0 ? '+' : ''}${pct}%)`, value: diff, type: 'sub' });
  }

  // 3. Décote batterie
  if (evaluation.battery && evaluation.battery !== 'fonctionnelle') {
    const tier = pricing.batteryDeduction[evaluation.battery];
    const deduction = tier?.[product.brand] ?? tier?.default ?? 0;
    p -= deduction;
    breakdown.push({ label: `Batterie ${evaluation.battery === 'a-remplacer' ? 'à remplacer' : 'non fonctionnelle'}`, value: -deduction, type: 'sub' });
  }

  // 4. Décote caméra
  if (evaluation.camera && evaluation.camera !== 'fonctionnelle') {
    const ded = pricing.cameraDeduction[evaluation.camera] ?? 0;
    p -= ded;
    breakdown.push({ label: `Caméra ${evaluation.camera === 'a-remplacer' ? 'à remplacer' : 'non fonctionnelle'}`, value: -ded, type: 'sub' });
  }

  // 5. Bonus facture
  if (evaluation.invoice === 'oui') {
    const before = p;
    p = p * pricing.invoiceBonus;
    const bonus = Math.round(p - before);
    breakdown.push({ label: `Bonus facture < 2 ans (+${Math.round((pricing.invoiceBonus - 1) * 100)}%)`, value: bonus, type: 'bonus' });
  }

  const buyback = Math.max(0, Math.round(p));
  breakdown.push({ label: 'Prix de rachat', value: buyback, type: 'final' });

  // Prix de revente suggéré = rachat + marge (80 à 100 €)
  const resaleMin = buyback + pricing.resaleMarginMin;
  const resaleMax = buyback + pricing.resaleMarginMax;

  return { price: buyback, breakdown, competitorPrice: Math.round(cp), resaleMin, resaleMax };
}

// ================== APP PRINCIPALE ==================
export default function RenkiCash() {
  const [view, setView] = useState('home'); // home | brand | product | dashboard | result
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [brands, setBrands] = useState(INITIAL_BRANDS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [pricing, setPricing] = useState(INITIAL_PRICING);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [evaluation, setEvaluation] = useState({
    condition: null,
    battery: null,
    camera: null,
    invoice: null,
  });
  const [finalCalc, setFinalCalc] = useState(null);
  const [competitorPrice, setCompetitorPrice] = useState(''); // prix de vente concurrent saisi manuellement
  const [dashboardUnlocked, setDashboardUnlocked] = useState(false); // accès dashboard déverrouillé ?
  const hydrated = useRef(false); // évite de ré-sauvegarder pendant le chargement initial

  // Applique un objet de config (venant de Firebase ou du local) sur les états
  const applyConfig = (cfg) => {
    if (!cfg) return;
    if (cfg.theme) setTheme({ ...DEFAULT_THEME, ...cfg.theme });
    if (cfg.products) setProducts(cfg.products);
    if (cfg.brands) setBrands(cfg.brands);
    if (cfg.pricing) setPricing(cfg.pricing);
  };

  // Chargement initial + écoute temps réel (si Firebase configuré)
  useEffect(() => {
    let unsub = () => {};
    (async () => {
      const cfg = await loadConfig();
      applyConfig(cfg);
      hydrated.current = true;
      // Écoute des changements faits par d'autres appareils
      unsub = subscribeConfig((data) => applyConfig(data));
    })();
    return () => unsub();
  }, []);

  // Sauvegarde (Firebase si configuré, sinon local). Ignorée pendant l'hydratation.
  useEffect(() => { if (hydrated.current) saveKey('theme', theme); }, [theme]);
  useEffect(() => { if (hydrated.current) saveKey('products', products); }, [products]);
  useEffect(() => { if (hydrated.current) saveKey('brands', brands); }, [brands]);
  useEffect(() => { if (hydrated.current) saveKey('pricing', pricing); }, [pricing]);

  const evaluationComplete = evaluation.condition && evaluation.battery && evaluation.camera && evaluation.invoice;

  // Calcul du prix de rachat (réactif) — nécessite un prix concurrent saisi + évaluation complète
  const currentCalc = useMemo(() => {
    if (!evaluationComplete || !selectedProduct || !competitorPrice) return null;
    return computeBuybackPrice({
      product: selectedProduct, competitorPrice, evaluation, pricing,
    });
  }, [evaluationComplete, selectedProduct, competitorPrice, evaluation, pricing]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q));
  }, [products, searchQuery]);

  const goHome = () => {
    setView('home');
    setSelectedBrand(null);
    setSelectedProduct(null);
    setSelectedStorage(null);
    setEvaluation({ condition: null, battery: null, camera: null, invoice: null });
    setFinalCalc(null);
    setSearchQuery('');
    setCompetitorPrice('');
  };

  // Styles inline pour theming dynamique
  const css = useMemo(() => `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;600;700;800&display=swap');
    .rc-root { font-family: ${theme.fontFamily}; font-size: ${theme.fontSize}px; color: ${theme.text}; background: ${theme.background}; min-height: 100vh; }
    .rc-root *, .rc-root *::before, .rc-root *::after { box-sizing: border-box; }
    @keyframes rc-fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes rc-popIn { 0% { opacity: 0; transform: scale(0.92); } 60% { transform: scale(1.02); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes rc-slideIn { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes rc-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes rc-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
    @keyframes rc-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    .rc-fade { animation: rc-fadeIn 0.4s ease both; }
    .rc-pop { animation: rc-popIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
    .rc-slide { animation: rc-slideIn 0.35s ease both; }
    button { font-family: inherit; }
    .rc-tile { transition: transform 0.18s ease, box-shadow 0.25s ease, border-color 0.2s; cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent; }
    .rc-tile:active { transform: scale(0.96); }
    .rc-tile:hover { transform: translateY(-4px); box-shadow: 0 12px 32px -8px ${theme.primary}33; }
    .rc-btn { transition: all 0.18s; -webkit-tap-highlight-color: transparent; }
    .rc-btn:active { transform: scale(0.97); }
    .rc-input { transition: border-color 0.2s, box-shadow 0.2s; }
    .rc-input:focus { outline: none; border-color: ${theme.primary}; box-shadow: 0 0 0 3px ${theme.primary}25; }
    .rc-scroll { scrollbar-width: thin; scrollbar-color: ${theme.primary} transparent; }
    .rc-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
    .rc-scroll::-webkit-scrollbar-thumb { background: ${theme.primary}; border-radius: 3px; }
    .rc-brand-pill { transition: all 0.2s; cursor: pointer; -webkit-tap-highlight-color: transparent; white-space: nowrap; }
    .rc-brand-pill:active { transform: scale(0.95); }
    .rc-criteria-btn { transition: all 0.2s; cursor: pointer; -webkit-tap-highlight-color: transparent; }
    .rc-criteria-btn:active { transform: scale(0.97); }
    .rc-criteria-btn.selected { animation: rc-pulse 0.4s ease; }
    .rc-price-display { background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%); background-size: 200% 200%; animation: rc-shimmer 3s linear infinite; }
    @media (max-width: 640px) {
      .rc-grid-brands { grid-template-columns: repeat(2, 1fr) !important; }
      .rc-grid-products { grid-template-columns: repeat(1, 1fr) !important; }
      .rc-hide-mobile { display: none !important; }
      .rc-header-title { font-size: 1.1rem !important; }
    }
    @media (min-width: 641px) and (max-width: 1023px) {
      .rc-grid-brands { grid-template-columns: repeat(3, 1fr) !important; }
      .rc-grid-products { grid-template-columns: repeat(2, 1fr) !important; }
    }
  `, [theme]);

  return (
    <div className="rc-root">
      <style>{css}</style>
      <Header theme={theme} view={view} setView={setView} goHome={goHome} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <InfoBanner theme={theme} />
      {view !== 'dashboard' && (
        <BrandsRibbon
          theme={theme}
          brands={brands}
          selectedBrand={selectedBrand}
          onSelect={(b) => { setSelectedBrand(b); setView('brand'); setSelectedProduct(null); }}
        />
      )}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px 80px' }}>
        {view === 'home' && <HomeView theme={theme} brands={brands} products={products} onSelectBrand={(b) => { setSelectedBrand(b); setView('brand'); }} searchQuery={searchQuery} filteredProducts={filteredProducts} onSelectProduct={(p) => { setSelectedBrand(brands.find(b => b.id === p.brand)); setSelectedProduct(p); setView('product'); }} />}
        {view === 'brand' && selectedBrand && <BrandView theme={theme} brand={selectedBrand} products={products.filter(p => p.brand === selectedBrand.id)} onSelectProduct={(p) => { setSelectedProduct(p); setView('product'); }} />}
        {view === 'product' && selectedProduct && <ProductView theme={theme} product={selectedProduct} brand={brands.find(b => b.id === selectedProduct.brand)} selectedStorage={selectedStorage} setSelectedStorage={setSelectedStorage} competitorPrice={competitorPrice} setCompetitorPrice={setCompetitorPrice} evaluation={evaluation} setEvaluation={setEvaluation} pricing={pricing} evaluationComplete={evaluationComplete} currentCalc={currentCalc} onValidate={() => { setFinalCalc(currentCalc); setView('result'); }} onBack={() => setView('brand')} />}
        {view === 'result' && finalCalc && <ResultView theme={theme} product={selectedProduct} storage={selectedStorage} calc={finalCalc} evaluation={evaluation} onRestart={goHome} />}
        {view === 'dashboard' && (dashboardUnlocked
          ? <Dashboard theme={theme} setTheme={setTheme} brands={brands} setBrands={setBrands} products={products} setProducts={setProducts} pricing={pricing} setPricing={setPricing} onLock={() => setDashboardUnlocked(false)} />
          : <DashboardLogin theme={theme} onUnlock={() => setDashboardUnlocked(true)} />
        )}
      </main>
      <Footer theme={theme} />
    </div>
  );
}

// ================== INFO BANNER (sticky en haut, défilement lent) ==================
function InfoBanner({ theme }) {
  const message = "Tout téléphone acheté il y a moins de 2 ans doit être repris avec sa facture d'achat";
  const items = Array.from({ length: 6 }, () => message);
  return (
    <div style={{ background: theme.secondary, color: '#fff', overflow: 'hidden', position: 'sticky', top: 0, zIndex: 60, borderBottom: `2px solid ${theme.primary}` }}>
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'rc-marquee 90s linear infinite', width: 'fit-content' }}>
        {[...items, ...items].map((msg, i) => (
          <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 32px', fontSize: '0.85rem', fontWeight: 600 }}>
            <FileText size={14} style={{ color: theme.primary, flexShrink: 0 }} />
            <span>{msg}</span>
            <span style={{ color: theme.primary, margin: '0 4px' }}>•</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ================== HEADER ==================
function Header({ theme, view, setView, goHome, searchQuery, setSearchQuery }) {
  return (
    <header style={{ background: '#fff', borderBottom: `1px solid ${theme.primary}15`, position: 'sticky', top: 35, zIndex: 50, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div onClick={goHome} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}>
          {theme.logoUrl ? (
            <img src={theme.logoUrl} alt="logo" style={{ height: 38, width: 'auto' }} />
          ) : (
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20, boxShadow: `0 4px 12px ${theme.primary}40` }}>R</div>
          )}
          <div className="rc-header-title" style={{ fontWeight: 800, fontSize: '1.35rem', letterSpacing: '-0.02em', color: theme.text, fontFamily: 'Manrope, sans-serif' }}>
            {theme.siteName}
          </div>
        </div>

        <div style={{ flex: 1, position: 'relative', maxWidth: 480 }} className="rc-hide-mobile">
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: theme.textMuted }} />
          <input
            className="rc-input"
            type="text"
            placeholder="Rechercher un modèle..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); if (e.target.value) setView('home'); }}
            style={{ width: '100%', padding: '10px 14px 10px 42px', borderRadius: 10, border: `1.5px solid ${theme.primary}25`, background: theme.surface, fontSize: '0.95rem', color: theme.text }}
          />
        </div>

        <nav style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          <NavBtn theme={theme} active={view === 'home'} onClick={goHome} icon={<Home size={18} />} label="Accueil" />
          <NavBtn theme={theme} active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<LayoutDashboard size={18} />} label="Dashboard" />
        </nav>
      </div>

      <div style={{ padding: '0 16px 12px', maxWidth: 1280, margin: '0 auto' }} className="rc-hide-mobile" />
      {/* Search mobile */}
      <div style={{ padding: '0 16px 12px', display: 'none' }} className="rc-show-mobile" />
      <div style={{ padding: '0 16px 12px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ position: 'relative', display: 'block' }} className="rc-search-mobile">
          <style>{`@media (min-width: 641px) { .rc-search-mobile { display: none !important; } }`}</style>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: theme.textMuted }} />
          <input
            className="rc-input"
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); if (e.target.value) setView('home'); }}
            style={{ width: '100%', padding: '9px 12px 9px 38px', borderRadius: 10, border: `1.5px solid ${theme.primary}25`, background: theme.surface, fontSize: '0.9rem' }}
          />
        </div>
      </div>
    </header>
  );
}

function NavBtn({ theme, active, onClick, icon, label }) {
  return (
    <button
      className="rc-btn"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 14px', borderRadius: 10,
        border: 'none',
        background: active ? theme.primary : 'transparent',
        color: active ? '#fff' : theme.text,
        fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
      }}
    >
      {icon}
      <span className="rc-hide-mobile">{label}</span>
    </button>
  );
}

// ================== BRANDS RIBBON ==================
function BrandsRibbon({ theme, brands, selectedBrand, onSelect }) {
  return (
    <div style={{ background: `linear-gradient(180deg, ${theme.primaryLight} 0%, ${theme.background} 100%)`, borderBottom: `1px solid ${theme.primary}15` }}>
      <div className="rc-scroll" style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 16px', display: 'flex', gap: 10, overflowX: 'auto' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: theme.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', alignSelf: 'center', flexShrink: 0, marginRight: 4 }}>Marques</span>
        {brands.map((b) => (
          <button
            key={b.id}
            className="rc-brand-pill"
            onClick={() => onSelect(b)}
            style={{
              padding: '8px 16px', borderRadius: 999,
              border: `1.5px solid ${selectedBrand?.id === b.id ? theme.primary : theme.primary + '25'}`,
              background: selectedBrand?.id === b.id ? theme.primary : '#fff',
              color: selectedBrand?.id === b.id ? '#fff' : theme.text,
              fontWeight: 600, fontSize: '0.88rem',
              display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: selectedBrand?.id === b.id ? `0 4px 12px ${theme.primary}40` : 'none',
            }}
          >
            {b.logoImage ? (
              <img src={b.logoImage} alt={b.name} style={{ width: 18, height: 18, objectFit: 'contain', borderRadius: 3 }} onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <span style={{ fontSize: '1rem' }}>{b.logo}</span>
            )}
            {b.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ================== HOME VIEW ==================
function HomeView({ theme, brands, products, onSelectBrand, searchQuery, filteredProducts, onSelectProduct }) {
  if (searchQuery) {
    return (
      <div className="rc-fade">
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 16, fontFamily: 'Manrope, sans-serif' }}>
          Résultats pour « {searchQuery} » <span style={{ color: theme.textMuted, fontWeight: 400, fontSize: '0.95rem' }}>({filteredProducts.length})</span>
        </h2>
        <div className="rc-grid-products" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} brand={brands.find(b => b.id === p.brand)} theme={theme} onClick={() => onSelectProduct(p)} />
          ))}
          {filteredProducts.length === 0 && <p style={{ color: theme.textMuted }}>Aucun modèle trouvé.</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="rc-fade">
      {/* Hero */}
      <section style={{ marginBottom: 36, padding: '36px 28px', borderRadius: 24, background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.18)', fontSize: '0.8rem', fontWeight: 600, marginBottom: 14 }}>
            <Sparkles size={14} /> Reprise mobile en magasin
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', fontWeight: 800, margin: '0 0 10px', lineHeight: 1.15, fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}>
            Estimez votre smartphone en quelques secondes
          </h1>
          <p style={{ fontSize: '1rem', opacity: 0.92, margin: 0, maxWidth: 600 }}>
            Sélectionnez votre marque, votre modèle, l'état de votre appareil et recevez immédiatement votre prix de reprise.
          </p>
        </div>
      </section>

      {/* Brands grid */}
      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: 18, fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.01em' }}>
          Choisissez votre marque
        </h2>
        <div className="rc-grid-brands" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
          {brands.map((b, i) => (
            <button
              key={b.id}
              className="rc-tile rc-pop"
              onClick={() => onSelectBrand(b)}
              style={{
                animationDelay: `${i * 60}ms`,
                padding: '24px 14px', borderRadius: 18,
                border: `1.5px solid ${theme.primary}15`,
                background: '#fff',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
                aspectRatio: '1',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {b.logoImage ? (
                <img src={b.logoImage} alt={b.name} style={{ width: 64, height: 64, objectFit: 'contain' }} onError={(e) => { e.target.src = ''; e.target.style.display = 'none'; }} />
              ) : (
                <div style={{ fontSize: '2.4rem', filter: 'grayscale(0)' }}>{b.logo}</div>
              )}
              <div style={{ fontWeight: 700, fontSize: '1rem', color: theme.text }}>{b.name}</div>
              <div style={{ fontSize: '0.75rem', color: theme.textMuted, fontWeight: 500 }}>
                {products.filter(p => p.brand === b.id).length} modèles
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: 18, fontFamily: 'Manrope, sans-serif' }}>Comment ça marche ?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {[
            { n: '1', title: 'Choisissez votre modèle', desc: 'Marque, modèle, capacité de stockage', icon: <Smartphone /> },
            { n: '2', title: 'Évaluez son état', desc: 'État général, batterie, caméra, facture', icon: <Check /> },
            { n: '3', title: 'Recevez votre prix', desc: 'Estimation instantanée et juste', icon: <Sparkles /> },
          ].map((s, i) => (
            <div key={i} className="rc-slide" style={{ animationDelay: `${i * 120}ms`, padding: 18, borderRadius: 16, background: theme.surface, border: `1px solid ${theme.primary}15`, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: theme.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>{s.n}</div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontSize: '0.88rem', color: theme.textMuted }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ================== BRAND VIEW ==================
function BrandView({ theme, brand, products, onSelectProduct }) {
  return (
    <div className="rc-fade">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        {brand.logoImage ? (
          <img src={brand.logoImage} alt={brand.name} style={{ width: 52, height: 52, objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
        ) : (
          <div style={{ fontSize: '2.2rem' }}>{brand.logo}</div>
        )}
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, fontFamily: 'Manrope, sans-serif' }}>{brand.name}</h2>
          <div style={{ fontSize: '0.9rem', color: theme.textMuted }}>{products.length} modèles disponibles</div>
        </div>
      </div>
      <div className="rc-grid-products" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} brand={brand} theme={theme} onClick={() => onSelectProduct(p)} delay={i * 40} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, brand, theme, onClick, delay = 0 }) {
  const nbStorage = (product.storage || []).length;
  return (
    <button
      onClick={onClick}
      className="rc-tile rc-pop"
      style={{
        animationDelay: `${delay}ms`,
        padding: 0, borderRadius: 18,
        border: `1.5px solid ${theme.primary}15`,
        background: '#fff',
        display: 'flex', flexDirection: 'column',
        textAlign: 'left',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ aspectRatio: '4/3', background: `linear-gradient(135deg, ${theme.primaryLight} 0%, ${theme.surface} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {product.image ? (
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 12 }} />
        ) : (
          <div style={{ fontSize: '3rem', opacity: 0.4 }}>{brand?.logo || '📱'}</div>
        )}
      </div>
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: theme.primary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{brand?.name}</div>
        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 8, color: theme.text, lineHeight: 1.25 }}>{product.name}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: theme.textMuted }}>{nbStorage} capacité{nbStorage > 1 ? 's' : ''}</div>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: theme.primary, display: 'flex', alignItems: 'center', gap: 4 }}>Estimer <ChevronRight size={15} /></div>
        </div>
      </div>
    </button>
  );
}

// ================== PRODUCT VIEW (formulaire d'évaluation) ==================
function ProductView({ theme, product, brand, selectedStorage, setSelectedStorage, competitorPrice, setCompetitorPrice, evaluation, setEvaluation, pricing, evaluationComplete, currentCalc, onValidate, onBack }) {
  const storageOptions = product.storage || [];
  useEffect(() => {
    if (!selectedStorage && storageOptions[0]) setSelectedStorage(storageOptions[0]);
  }, [product]);

  const discountPct = Math.round(pricing.competitorDiscount * 100);

  return (
    <div className="rc-fade">
      <button className="rc-btn" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: theme.textMuted, cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: 16 }}>
        <ArrowLeft size={16} /> Retour
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 20 }}>
        {/* Header produit */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 18, borderRadius: 18, background: theme.surface, border: `1px solid ${theme.primary}15` }}>
          <div style={{ width: 96, height: 96, borderRadius: 14, background: `linear-gradient(135deg, ${theme.primaryLight} 0%, #fff 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {product.image ? <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} /> : <span style={{ fontSize: '2.2rem' }}>{brand?.logo}</span>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: theme.primary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{brand?.name}</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '4px 0', fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.01em' }}>{product.name}</h2>
            <div style={{ fontSize: '0.88rem', color: theme.textMuted }}>Renseignez les critères pour obtenir votre prix</div>
          </div>
        </div>

        {/* Stockage + prix concurrent */}
        <Section theme={theme} title="Modèle et prix de vente concurrent" step={1}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {storageOptions.map(s => (
              <CriteriaBtn key={s} theme={theme} selected={selectedStorage === s} onClick={() => setSelectedStorage(s)} label={s} />
            ))}
          </div>
          <div style={{ background: theme.primaryLight, borderRadius: 12, padding: 16, border: `1.5px solid ${theme.primary}30` }}>
            <label style={{ fontSize: '0.92rem', fontWeight: 700, color: theme.text, display: 'block', marginBottom: 4 }}>
              Prix de vente actuel chez le concurrent (€)
            </label>
            <p style={{ fontSize: '0.8rem', color: theme.textMuted, margin: '0 0 10px' }}>
              Saisissez le prix affiché chez Back Market / Easy Cash / etc. Une décote de {discountPct}% est appliquée automatiquement comme base de calcul.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '0 0 auto' }}>
                <input
                  type="number"
                  inputMode="numeric"
                  value={competitorPrice}
                  onChange={(e) => setCompetitorPrice(e.target.value)}
                  placeholder="0"
                  className="rc-input"
                  style={{ width: 160, padding: '12px 38px 12px 14px', borderRadius: 10, border: `1.5px solid ${theme.primary}40`, background: '#fff', fontSize: '1.3rem', fontWeight: 800, color: theme.text, fontFamily: 'Manrope, sans-serif' }}
                />
                <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: theme.textMuted, fontSize: '1.1rem' }}>€</span>
              </div>
              {competitorPrice && parseFloat(competitorPrice) > 0 && (
                <div style={{ fontSize: '0.85rem', color: theme.text }}>
                  Base après −{discountPct}% : <strong style={{ color: theme.primaryDark }}>{Math.round(parseFloat(competitorPrice) * (1 - pricing.competitorDiscount))} €</strong>
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* État */}
        <Section theme={theme} title="État du téléphone" step={2}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
            {[
              { v: 'neuf', l: 'Neuf', d: 'Jamais utilisé, scellé' },
              { v: 'comme-neuf', l: 'Comme neuf', d: 'Aucune marque' },
              { v: 'bon', l: 'Bon état', d: 'Micro-rayures' },
              { v: 'moyen', l: 'État moyen', d: 'Rayures visibles' },
              { v: 'mauvais', l: 'Mauvais état', d: 'Impacts, traces' },
              { v: 'tres-mauvais', l: 'Très mauvais', d: 'Écran ou coque endommagé' },
            ].map(opt => (
              <CriteriaBtn key={opt.v} theme={theme} selected={evaluation.condition === opt.v} onClick={() => setEvaluation({ ...evaluation, condition: opt.v })} label={opt.l} desc={opt.d} />
            ))}
          </div>
        </Section>

        {/* Batterie */}
        <Section theme={theme} title="Batterie" step={3} icon={<Battery size={18} />}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
            {[
              { v: 'fonctionnelle', l: 'Fonctionnelle', d: 'Autonomie normale' },
              { v: 'a-remplacer', l: 'À remplacer', d: 'Autonomie faible' },
              { v: 'non-fonctionnelle', l: 'Non fonctionnelle', d: 'Ne charge plus' },
            ].map(opt => (
              <CriteriaBtn key={opt.v} theme={theme} selected={evaluation.battery === opt.v} onClick={() => setEvaluation({ ...evaluation, battery: opt.v })} label={opt.l} desc={opt.d} />
            ))}
          </div>
        </Section>

        {/* Caméra */}
        <Section theme={theme} title="Caméra" step={4} icon={<Camera size={18} />}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
            {[
              { v: 'fonctionnelle', l: 'Fonctionnelle', d: 'Photos nettes' },
              { v: 'a-remplacer', l: 'À remplacer', d: 'Floue ou rayée' },
              { v: 'non-fonctionnelle', l: 'Non fonctionnelle', d: 'Ne fonctionne plus' },
            ].map(opt => (
              <CriteriaBtn key={opt.v} theme={theme} selected={evaluation.camera === opt.v} onClick={() => setEvaluation({ ...evaluation, camera: opt.v })} label={opt.l} desc={opt.d} />
            ))}
          </div>
        </Section>

        {/* Facture */}
        <Section theme={theme} title="Facture d'achat (téléphone de moins de 2 ans)" step={5} icon={<FileText size={18} />}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, maxWidth: 360 }}>
            <CriteriaBtn theme={theme} selected={evaluation.invoice === 'oui'} onClick={() => setEvaluation({ ...evaluation, invoice: 'oui' })} label="Oui" desc="Bonus +5%" />
            <CriteriaBtn theme={theme} selected={evaluation.invoice === 'non'} onClick={() => setEvaluation({ ...evaluation, invoice: 'non' })} label="Non" />
          </div>
        </Section>

        {/* Prix de rachat + revente suggérée en temps réel */}
        {evaluationComplete && currentCalc && (
          <div className="rc-price-display rc-fade" style={{ padding: 24, borderRadius: 20, color: '#fff', boxShadow: `0 12px 32px ${theme.primary}40` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ fontSize: '0.85rem', opacity: 0.9, fontWeight: 600 }}>Prix de rachat</div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em', lineHeight: 1 }}>{currentCalc.price} €</div>
              </div>
              <button
                className="rc-btn"
                onClick={onValidate}
                style={{ padding: '14px 26px', borderRadius: 12, border: 'none', background: '#fff', color: theme.primaryDark, fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
              >
                Valider la reprise <ChevronRight size={18} />
              </button>
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', opacity: 0.9, fontWeight: 600 }}>Prix de revente conseillé :</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif' }}>{currentCalc.resaleMin} € – {currentCalc.resaleMax} €</span>
              <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>(marge {pricing.resaleMarginMin}–{pricing.resaleMarginMax} €)</span>
            </div>
          </div>
        )}

        {/* Aide si pas de prix saisi */}
        {evaluationComplete && !currentCalc && (
          <div className="rc-fade" style={{ padding: 18, borderRadius: 16, background: theme.surface, border: `1.5px dashed ${theme.primary}40`, textAlign: 'center', color: theme.textMuted, fontSize: '0.9rem' }}>
            Saisissez le prix de vente concurrent (étape 1) pour obtenir le prix de rachat.
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ theme, title, step, icon, children }) {
  return (
    <div style={{ padding: 18, borderRadius: 18, background: '#fff', border: `1px solid ${theme.primary}15`, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: theme.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>{step}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '1.05rem', fontFamily: 'Manrope, sans-serif' }}>
          {icon}{title}
        </div>
      </div>
      {children}
    </div>
  );
}

function CriteriaBtn({ theme, selected, onClick, label, desc }) {
  return (
    <button
      onClick={onClick}
      className={`rc-criteria-btn ${selected ? 'selected' : ''}`}
      style={{
        padding: '12px 14px', borderRadius: 12,
        border: `1.5px solid ${selected ? theme.primary : theme.primary + '20'}`,
        background: selected ? theme.primary + '12' : '#fff',
        color: selected ? theme.primaryDark : theme.text,
        textAlign: 'left', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 2,
        fontWeight: 600,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: '0.95rem' }}>{label}</span>
        {selected && <Check size={16} style={{ color: theme.primary }} />}
      </div>
      {desc && <span style={{ fontSize: '0.78rem', color: theme.textMuted, fontWeight: 500 }}>{desc}</span>}
    </button>
  );
}

// ================== RESULT VIEW ==================
function ResultView({ theme, product, storage, calc, evaluation, onRestart }) {
  const condLabels = { 'neuf': 'Neuf', 'comme-neuf': 'Comme neuf', 'bon': 'Bon état', 'moyen': 'État moyen', 'mauvais': 'Mauvais', 'tres-mauvais': 'Très mauvais' };
  const battLabels = { 'fonctionnelle': 'Fonctionnelle', 'a-remplacer': 'À remplacer', 'non-fonctionnelle': 'Non fonctionnelle' };

  return (
    <div className="rc-fade" style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: theme.success + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Check size={32} style={{ color: theme.success }} strokeWidth={3} />
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, fontFamily: 'Manrope, sans-serif' }}>Estimation validée</h2>
        <p style={{ color: theme.textMuted, margin: '6px 0 0' }}>Voici le prix de rachat pour votre appareil</p>
      </div>

      <div className="rc-price-display rc-pop" style={{ padding: 32, borderRadius: 24, color: '#fff', textAlign: 'center', marginBottom: 20, boxShadow: `0 16px 40px ${theme.primary}50` }}>
        <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: 6, fontWeight: 600 }}>Prix de rachat final</div>
        <div style={{ fontSize: '3.6rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', lineHeight: 1 }}>{calc.price} €</div>
        <div style={{ fontSize: '0.95rem', opacity: 0.9, marginTop: 8 }}>{product.name} · {storage}</div>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.25)', fontSize: '0.95rem' }}>
          Revente conseillée : <strong style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.15rem' }}>{calc.resaleMin} € – {calc.resaleMax} €</strong>
        </div>
      </div>

      {/* Détail du calcul */}
      <div style={{ padding: 20, borderRadius: 16, background: '#fff', border: `1px solid ${theme.primary}15`, marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 12px', fontFamily: 'Manrope, sans-serif' }}>Détail du calcul</h3>
        {calc.breakdown.map((line, i) => {
          const isFinal = line.type === 'final';
          const isBase = line.type === 'base';
          const isBonus = line.type === 'bonus';
          return (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0',
              borderTop: isFinal ? `2px solid ${theme.primary}` : i > 0 ? '1px solid #f1f5f9' : 'none',
              marginTop: isFinal ? 8 : 0, paddingTop: isFinal ? 14 : 10,
              fontWeight: isFinal || isBase ? 700 : 500,
              fontSize: isFinal ? '1.05rem' : '0.9rem',
              color: isFinal ? theme.primaryDark : line.value < 0 ? '#dc2626' : isBonus ? theme.success : theme.text,
            }}>
              <span>{line.label}</span>
              <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700 }}>
                {line.value > 0 && !isFinal && !isBase ? '+' : ''}{line.value} €
              </span>
            </div>
          );
        })}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0 0', fontSize: '0.9rem', fontWeight: 600, color: theme.textMuted }}>
          <span>Prix de revente conseillé</span>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, color: theme.text }}>{calc.resaleMin} € – {calc.resaleMax} €</span>
        </div>
      </div>

      <div style={{ padding: 20, borderRadius: 16, background: theme.surface, border: `1px solid ${theme.primary}15`, marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 12px', fontFamily: 'Manrope, sans-serif' }}>Récapitulatif de l'évaluation</h3>
        <Row label="Modèle" value={`${product.name} (${storage})`} />
        <Row label="État" value={condLabels[evaluation.condition]} />
        <Row label="Batterie" value={battLabels[evaluation.battery]} />
        <Row label="Caméra" value={battLabels[evaluation.camera]} />
        <Row label="Facture < 2 ans" value={evaluation.invoice === 'oui' ? 'Oui (+5%)' : 'Non'} last />
      </div>

      <button className="rc-btn" onClick={onRestart} style={{ width: '100%', padding: '14px', borderRadius: 12, border: `1.5px solid ${theme.primary}`, background: '#fff', color: theme.primary, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
        Nouvelle estimation
      </button>
    </div>
  );
}

function Row({ label, value, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: last ? 'none' : '1px solid #e5e7eb', fontSize: '0.92rem' }}>
      <span style={{ color: '#64748B' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

// ================== DASHBOARD LOGIN (protection par mot de passe) ==================
function DashboardLogin({ theme, onUnlock }) {
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(false);

  const tryUnlock = () => {
    if (pwd === DASHBOARD_PASSWORD) { setError(false); onUnlock(); }
    else { setError(true); }
  };

  return (
    <div className="rc-fade" style={{ maxWidth: 420, margin: '40px auto', padding: 28, borderRadius: 20, background: '#fff', border: `1px solid ${theme.primary}15`, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: theme.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <Lock size={26} style={{ color: theme.primary }} />
      </div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 6px', fontFamily: 'Manrope, sans-serif' }}>Accès réservé</h2>
      <p style={{ color: theme.textMuted, fontSize: '0.9rem', margin: '0 0 20px' }}>
        Entrez le mot de passe pour accéder au tableau de bord.
      </p>
      <input
        type="password"
        value={pwd}
        onChange={(e) => { setPwd(e.target.value); setError(false); }}
        onKeyDown={(e) => { if (e.key === 'Enter') tryUnlock(); }}
        placeholder="Mot de passe"
        autoFocus
        className="rc-input"
        style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${error ? '#dc2626' : theme.primary + '30'}`, background: theme.surface, fontSize: '1rem', color: theme.text, marginBottom: 12, textAlign: 'center' }}
      />
      {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: '0 0 12px', fontWeight: 600 }}>Mot de passe incorrect</p>}
      <button
        className="rc-btn"
        onClick={tryUnlock}
        style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: theme.primary, color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
      >
        Déverrouiller
      </button>
    </div>
  );
}

// ================== DASHBOARD ==================
function Dashboard({ theme, setTheme, brands, setBrands, products, setProducts, pricing, setPricing, onLock }) {
  const [tab, setTab] = useState('appearance');

  const tabs = [
    { id: 'appearance', label: 'Apparence', icon: <Palette size={16} /> },
    { id: 'typography', label: 'Typographie', icon: <Type size={16} /> },
    { id: 'products', label: 'Produits', icon: <Smartphone size={16} /> },
    { id: 'pricing', label: 'Formule de rachat', icon: <Settings size={16} /> },
    { id: 'brands', label: 'Marques', icon: <Sparkles size={16} /> },
  ];

  return (
    <div className="rc-fade">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <LayoutDashboard size={26} style={{ color: theme.primary }} />
        <h2 style={{ fontSize: '1.7rem', fontWeight: 800, margin: 0, fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}>Tableau de bord</h2>
        <button className="rc-btn" onClick={onLock} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${theme.primary}25`, background: '#fff', color: theme.textMuted, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
          <Lock size={15} /> Verrouiller
        </button>
      </div>

      <div className="rc-scroll" style={{ display: 'flex', gap: 6, marginBottom: 20, padding: '4px', background: theme.surface, borderRadius: 12, overflowX: 'auto' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="rc-btn"
            style={{
              padding: '9px 14px', borderRadius: 9,
              border: 'none',
              background: tab === t.id ? '#fff' : 'transparent',
              color: tab === t.id ? theme.primary : theme.textMuted,
              fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              whiteSpace: 'nowrap',
              boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="rc-fade" key={tab}>
        {tab === 'appearance' && <AppearanceTab theme={theme} setTheme={setTheme} />}
        {tab === 'typography' && <TypographyTab theme={theme} setTheme={setTheme} />}
        {tab === 'products' && <ProductsTab theme={theme} brands={brands} products={products} setProducts={setProducts} />}
        {tab === 'pricing' && <PricingTab theme={theme} pricing={pricing} setPricing={setPricing} />}
        {tab === 'brands' && <BrandsTab theme={theme} brands={brands} setBrands={setBrands} />}
      </div>
    </div>
  );
}

// --- Apparence ---
function AppearanceTab({ theme, setTheme }) {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card theme={theme} title="Identité du site">
        <Field label="Nom du site">
          <input className="rc-input" type="text" value={theme.siteName} onChange={(e) => setTheme({ ...theme, siteName: e.target.value })} style={inputStyle(theme)} />
        </Field>
        <Field label="URL du logo (laisser vide pour le logo généré)">
          <input className="rc-input" type="text" placeholder="https://..." value={theme.logoUrl} onChange={(e) => setTheme({ ...theme, logoUrl: e.target.value })} style={inputStyle(theme)} />
          {theme.logoUrl && (
            <div style={{ marginTop: 8, padding: 12, background: theme.surface, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.85rem', color: theme.textMuted }}>Aperçu :</span>
              <img src={theme.logoUrl} alt="logo" style={{ height: 32 }} onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
        </Field>
      </Card>

      <Card theme={theme} title="Couleurs">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
          <ColorField label="Bleu principal" value={theme.primary} onChange={(v) => setTheme({ ...theme, primary: v })} theme={theme} />
          <ColorField label="Bleu foncé" value={theme.primaryDark} onChange={(v) => setTheme({ ...theme, primaryDark: v })} theme={theme} />
          <ColorField label="Bleu clair (fond)" value={theme.primaryLight} onChange={(v) => setTheme({ ...theme, primaryLight: v })} theme={theme} />
          <ColorField label="Texte" value={theme.text} onChange={(v) => setTheme({ ...theme, text: v })} theme={theme} />
          <ColorField label="Fond" value={theme.background} onChange={(v) => setTheme({ ...theme, background: v })} theme={theme} />
          <ColorField label="Surface" value={theme.surface} onChange={(v) => setTheme({ ...theme, surface: v })} theme={theme} />
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="rc-btn" onClick={() => setTheme({ ...theme, primary: '#00B8D4', primaryDark: '#0091A7', primaryLight: '#E0F7FA' })} style={presetBtn(theme, '#00B8D4')}>Coriolis (défaut)</button>
          <button className="rc-btn" onClick={() => setTheme({ ...theme, primary: '#0066CC', primaryDark: '#004999', primaryLight: '#E6F0FB' })} style={presetBtn(theme, '#0066CC')}>Bleu classique</button>
          <button className="rc-btn" onClick={() => setTheme({ ...theme, primary: '#2563EB', primaryDark: '#1E40AF', primaryLight: '#EFF6FF' })} style={presetBtn(theme, '#2563EB')}>Royal</button>
          <button className="rc-btn" onClick={() => setTheme({ ...theme, primary: '#0EA5E9', primaryDark: '#0369A1', primaryLight: '#E0F2FE' })} style={presetBtn(theme, '#0EA5E9')}>Ciel</button>
        </div>
      </Card>
    </div>
  );
}

function ColorField({ label, value, onChange, theme }) {
  return (
    <div>
      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: theme.textMuted, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: 42, height: 42, borderRadius: 10, border: `1.5px solid ${theme.primary}25`, cursor: 'pointer', background: 'none' }} />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="rc-input" style={{ ...inputStyle(theme), padding: '8px 10px', fontSize: '0.85rem' }} />
      </div>
    </div>
  );
}

function presetBtn(theme, color) {
  return {
    padding: '8px 12px', borderRadius: 10, border: `1.5px solid ${theme.primary}20`, background: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
  };
}

// --- Typographie ---
function TypographyTab({ theme, setTheme }) {
  const fonts = [
    { v: "'Inter', 'Segoe UI', system-ui, sans-serif", l: 'Inter (par défaut)' },
    { v: "'Manrope', sans-serif", l: 'Manrope' },
    { v: "'Poppins', sans-serif", l: 'Poppins' },
    { v: "'Roboto', sans-serif", l: 'Roboto' },
    { v: "Georgia, serif", l: 'Georgia (serif)' },
  ];
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card theme={theme} title="Famille de police">
        <div style={{ display: 'grid', gap: 8 }}>
          {fonts.map(f => (
            <button key={f.v} onClick={() => setTheme({ ...theme, fontFamily: f.v })} className="rc-btn" style={{
              padding: '12px 14px', borderRadius: 10,
              border: `1.5px solid ${theme.fontFamily === f.v ? theme.primary : theme.primary + '20'}`,
              background: theme.fontFamily === f.v ? theme.primary + '10' : '#fff',
              fontFamily: f.v,
              textAlign: 'left', cursor: 'pointer', fontWeight: 600, fontSize: '1rem',
              color: theme.text,
            }}>
              {f.l} — Renki Cash
            </button>
          ))}
        </div>
      </Card>
      <Card theme={theme} title="Taille de texte globale">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 0' }}>
          <span style={{ fontSize: '0.85rem', color: theme.textMuted }}>A</span>
          <input type="range" min="13" max="20" step="1" value={theme.fontSize} onChange={(e) => setTheme({ ...theme, fontSize: parseInt(e.target.value) })} style={{ flex: 1, accentColor: theme.primary }} />
          <span style={{ fontSize: '1.25rem', color: theme.text, fontWeight: 700 }}>A</span>
          <span style={{ fontWeight: 700, color: theme.primary, minWidth: 50, textAlign: 'right' }}>{theme.fontSize} px</span>
        </div>
        <div style={{ marginTop: 12, padding: 14, background: theme.surface, borderRadius: 10, fontSize: theme.fontSize + 'px', fontFamily: theme.fontFamily, color: theme.text }}>
          Aperçu : le texte s'affichera avec cette taille dans toute l'application.
        </div>
      </Card>
    </div>
  );
}

// --- Produits ---
function ProductsTab({ theme, brands, products, setProducts }) {
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [openBrand, setOpenBrand] = useState(brands[0]?.id || null);
  const [q, setQ] = useState('');

  const handleSave = (prod) => {
    if (editing) setProducts(products.map(p => p.id === prod.id ? prod : p));
    else setProducts([...products, prod]);
    setEditing(null); setCreating(false);
  };
  const handleDelete = (id) => {
    if (window.confirm('Supprimer définitivement ce produit ?')) setProducts(products.filter(p => p.id !== id));
  };

  // Déplace un produit vers le haut/bas À L'INTÉRIEUR de sa marque.
  // On réordonne le tableau global "products" en conséquence.
  const moveWithinBrand = (productId, direction) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    // indices (dans le tableau global) des produits de la même marque, dans l'ordre
    const sameBrandIndices = products
      .map((p, i) => ({ p, i }))
      .filter(x => x.p.brand === product.brand)
      .map(x => x.i);
    const posInBrand = sameBrandIndices.findIndex(i => products[i].id === productId);
    const targetPos = posInBrand + direction;
    if (targetPos < 0 || targetPos >= sameBrandIndices.length) return; // déjà en bout
    const idxA = sameBrandIndices[posInBrand];
    const idxB = sameBrandIndices[targetPos];
    const next = [...products];
    [next[idxA], next[idxB]] = [next[idxB], next[idxA]];
    setProducts(next);
  };

  if (editing || creating) {
    return <ProductEditor theme={theme} brands={brands} product={editing} onSave={handleSave} onCancel={() => { setEditing(null); setCreating(false); }} />;
  }

  const query = q.trim().toLowerCase();

  return (
    <Card theme={theme} title={`Produits (${products.length})`}>
      <p style={{ fontSize: '0.85rem', color: theme.textMuted, margin: '0 0 14px' }}>
        Les modèles sont regroupés par marque. Utilisez les flèches pour les remonter ou les descendre dans l'ordre d'affichage du site.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un modèle..." className="rc-input" style={{ ...inputStyle(theme), maxWidth: 280 }} />
        <button className="rc-btn" onClick={() => setCreating(true)} style={{ padding: '9px 14px', borderRadius: 10, border: 'none', background: theme.primary, color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          <Plus size={16} /> Nouveau produit
        </button>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {brands.map(brand => {
          const brandProducts = products.filter(p => p.brand === brand.id &&
            (query === '' || p.name.toLowerCase().includes(query)));
          const totalInBrand = products.filter(p => p.brand === brand.id).length;
          if (query !== '' && brandProducts.length === 0) return null;
          const isOpen = openBrand === brand.id || query !== '';
          return (
            <div key={brand.id} style={{ borderRadius: 12, border: `1px solid ${theme.primary}15`, overflow: 'hidden' }}>
              {/* En-tête de marque (cliquable pour ouvrir/fermer) */}
              <button
                onClick={() => setOpenBrand(isOpen && query === '' ? null : brand.id)}
                className="rc-btn"
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: 'none', background: theme.primaryLight, cursor: query !== '' ? 'default' : 'pointer', textAlign: 'left' }}
              >
                {brand.logoImage
                  ? <img src={brand.logoImage} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                  : <span style={{ fontSize: '1.3rem' }}>{brand.logo}</span>}
                <span style={{ fontWeight: 800, fontSize: '1rem', fontFamily: 'Manrope, sans-serif', color: theme.text }}>{brand.name}</span>
                <span style={{ fontSize: '0.78rem', color: theme.textMuted, fontWeight: 600 }}>{totalInBrand} modèle{totalInBrand > 1 ? 's' : ''}</span>
                <ChevronRight size={18} style={{ marginLeft: 'auto', color: theme.textMuted, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {/* Liste des modèles de la marque */}
              {isOpen && (
                <div style={{ display: 'grid', gap: 6, padding: 10 }}>
                  {brandProducts.map((p, idx) => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 10, background: theme.surface, border: `1px solid ${theme.primary}10` }}>
                      {/* Flèches de réordonnancement */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <button className="rc-btn" onClick={() => moveWithinBrand(p.id, -1)} disabled={idx === 0} title="Monter"
                          style={{ width: 26, height: 22, borderRadius: 6, border: `1px solid ${theme.primary}20`, background: '#fff', cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.text, padding: 0 }}>
                          <ChevronUp size={15} />
                        </button>
                        <button className="rc-btn" onClick={() => moveWithinBrand(p.id, 1)} disabled={idx === brandProducts.length - 1} title="Descendre"
                          style={{ width: 26, height: 22, borderRadius: 6, border: `1px solid ${theme.primary}20`, background: '#fff', cursor: idx === brandProducts.length - 1 ? 'default' : 'pointer', opacity: idx === brandProducts.length - 1 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.text, padding: 0 }}>
                          <ChevronDown size={15} />
                        </button>
                      </div>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                        {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span>{brand.logo}</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.76rem', color: theme.textMuted }}>{(p.storage || []).join(' / ')}</div>
                      </div>
                      <button className="rc-btn" onClick={() => setEditing(p)} style={iconBtn(theme)}><Edit2 size={15} /></button>
                      <button className="rc-btn" onClick={() => handleDelete(p.id)} style={{ ...iconBtn(theme), color: '#dc2626' }}><Trash2 size={15} /></button>
                    </div>
                  ))}
                  {brandProducts.length === 0 && <p style={{ color: theme.textMuted, fontSize: '0.85rem', textAlign: 'center', padding: 12 }}>Aucun modèle dans cette marque.</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ProductEditor({ theme, brands, product, onSave, onCancel }) {
  const [form, setForm] = useState(product || {
    id: 'new-' + Date.now(),
    brand: brands[0]?.id || 'apple',
    name: '',
    image: '',
    storage: ['128 Go'],
  });
  const fileRef = useRef(null);

  const handleImg = (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Image trop lourde (max 2 Mo)'); return; }
    const reader = new FileReader();
    reader.onload = (e) => setForm({ ...form, image: e.target.result });
    reader.readAsDataURL(file);
  };

  const setCap = (idx, val) => {
    const arr = [...form.storage]; arr[idx] = val;
    setForm({ ...form, storage: arr });
  };
  const addCapacity = () => setForm({ ...form, storage: [...form.storage, 'Nouveau'] });
  const removeCapacity = (idx) => setForm({ ...form, storage: form.storage.filter((_, i) => i !== idx) });

  return (
    <Card theme={theme} title={product ? `Modifier — ${product.name}` : 'Nouveau produit'}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
        <Field label="Nom du modèle">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rc-input" style={inputStyle(theme)} />
        </Field>
        <Field label="Marque">
          <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="rc-input" style={inputStyle(theme)}>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Image produit">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input value={form.image && form.image.startsWith('http') ? form.image : ''} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="URL https://..." className="rc-input" style={{ ...inputStyle(theme), flex: 1, minWidth: 200 }} />
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImg(e.target.files?.[0])} />
          <button onClick={() => fileRef.current?.click()} className="rc-btn" style={{ padding: '9px 14px', borderRadius: 10, border: `1.5px solid ${theme.primary}30`, background: '#fff', color: theme.primary, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Upload size={14} /> Uploader
          </button>
        </div>
        {form.image && <img src={form.image} alt="" style={{ marginTop: 8, maxHeight: 120, borderRadius: 8, background: theme.surface, padding: 8 }} onError={(e) => e.target.style.display = 'none'} />}
      </Field>
      <Field label="Capacités de stockage disponibles">
        <div style={{ display: 'grid', gap: 8 }}>
          {form.storage.map((cap, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 8 }}>
              <input value={cap} onChange={(e) => setCap(idx, e.target.value)} className="rc-input" placeholder="128 Go" style={{ ...inputStyle(theme), flex: 1 }} />
              <button onClick={() => removeCapacity(idx)} className="rc-btn" style={iconBtn(theme)} disabled={form.storage.length <= 1}><Trash2 size={15} /></button>
            </div>
          ))}
          <button onClick={addCapacity} className="rc-btn" style={{ padding: '8px 12px', borderRadius: 10, border: `1.5px dashed ${theme.primary}40`, background: 'transparent', color: theme.primary, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
            <Plus size={14} /> Ajouter une capacité
          </button>
        </div>
      </Field>
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button onClick={() => onSave(form)} className="rc-btn" style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: theme.primary, color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Save size={16} /> Enregistrer
        </button>
        <button onClick={onCancel} className="rc-btn" style={{ padding: '10px 18px', borderRadius: 10, border: `1.5px solid ${theme.primary}25`, background: '#fff', color: theme.text, fontWeight: 600, cursor: 'pointer' }}>
          Annuler
        </button>
      </div>
    </Card>
  );
}

// --- Formule de rachat ---
function PricingTab({ theme, pricing, setPricing }) {
  const condLabels = { 'neuf': 'Neuf', 'comme-neuf': 'Comme neuf', 'bon': 'Bon état', 'moyen': 'Moyen', 'mauvais': 'Mauvais', 'tres-mauvais': 'Très mauvais' };
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card theme={theme} title="Formule de calcul du rachat">
        <div style={{ padding: 12, background: theme.primaryLight, borderRadius: 10, marginBottom: 14, fontSize: '0.85rem', color: theme.text }}>
          <strong>Formule :</strong> base = prix de vente concurrent saisi − décote concurrent. Puis : base × coef d'état − décote batterie − décote caméra, et × bonus facture. Le prix de revente conseillé = rachat + marge.
        </div>
        <Field label={`Décote sur le prix concurrent (%) — actuel : ${Math.round(pricing.competitorDiscount * 100)} %`}>
          <input type="number" min="0" max="90" step="1" value={Math.round(pricing.competitorDiscount * 100)} onChange={(e) => setPricing({ ...pricing, competitorDiscount: (parseFloat(e.target.value) || 0) / 100 })} className="rc-input" style={{ ...inputStyle(theme), maxWidth: 160 }} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <Field label="Marge de revente min (€)">
            <input type="number" min="0" step="5" value={pricing.resaleMarginMin} onChange={(e) => setPricing({ ...pricing, resaleMarginMin: parseFloat(e.target.value) || 0 })} className="rc-input" style={inputStyle(theme)} />
          </Field>
          <Field label="Marge de revente max (€)">
            <input type="number" min="0" step="5" value={pricing.resaleMarginMax} onChange={(e) => setPricing({ ...pricing, resaleMarginMax: parseFloat(e.target.value) || 0 })} className="rc-input" style={inputStyle(theme)} />
          </Field>
        </div>
      </Card>

      <Card theme={theme} title="Coefficient selon l'état du téléphone">
        <p style={{ fontSize: '0.85rem', color: theme.textMuted, margin: '0 0 12px' }}>1.00 = aucune réduction · 0.50 = -50%</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
          {Object.keys(pricing.conditionMultiplier).map(k => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: theme.surface, borderRadius: 8 }}>
              <span style={{ flex: 1, fontSize: '0.85rem' }}>{condLabels[k]}</span>
              <input type="number" step="0.01" min="0" max="1.2" value={pricing.conditionMultiplier[k]} onChange={(e) => setPricing({ ...pricing, conditionMultiplier: { ...pricing.conditionMultiplier, [k]: parseFloat(e.target.value) || 0 } })} className="rc-input" style={{ ...inputStyle(theme), width: 80, padding: '6px 8px' }} />
            </div>
          ))}
        </div>
      </Card>

      <Card theme={theme} title="Décote batterie (en €)">
        <p style={{ fontSize: '0.85rem', color: theme.textMuted, margin: '0 0 12px' }}>
          Montant soustrait du prix. Par défaut 50€, sauf Samsung et Google (80€).
        </p>
        {['a-remplacer', 'non-fonctionnelle'].map(state => (
          <div key={state} style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: 6 }}>{state === 'a-remplacer' ? 'À remplacer' : 'Non fonctionnelle'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 8 }}>
              {['default', 'samsung', 'google'].map(b => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: theme.surface, borderRadius: 8 }}>
                  <span style={{ flex: 1, fontSize: '0.85rem' }}>{b === 'default' ? 'Autres marques' : b === 'samsung' ? 'Samsung' : 'Google'}</span>
                  <input type="number" min="0" step="5" value={pricing.batteryDeduction[state][b] || 0} onChange={(e) => setPricing({ ...pricing, batteryDeduction: { ...pricing.batteryDeduction, [state]: { ...pricing.batteryDeduction[state], [b]: parseFloat(e.target.value) || 0 } } })} className="rc-input" style={{ ...inputStyle(theme), width: 80, padding: '6px 8px' }} />
                  <span style={{ fontSize: '0.8rem', color: theme.textMuted }}>€</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Card>

      <Card theme={theme} title="Décote caméra (en €)">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
          {Object.keys(pricing.cameraDeduction).map(k => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: theme.surface, borderRadius: 8 }}>
              <span style={{ flex: 1, fontSize: '0.85rem' }}>{k === 'a-remplacer' ? 'À remplacer' : 'Non fonctionnelle'}</span>
              <input type="number" min="0" step="5" value={pricing.cameraDeduction[k]} onChange={(e) => setPricing({ ...pricing, cameraDeduction: { ...pricing.cameraDeduction, [k]: parseFloat(e.target.value) || 0 } })} className="rc-input" style={{ ...inputStyle(theme), width: 80, padding: '6px 8px' }} />
              <span style={{ fontSize: '0.8rem', color: theme.textMuted }}>€</span>
            </div>
          ))}
        </div>
      </Card>

      <Card theme={theme} title="Bonus facture < 2 ans">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: theme.surface, borderRadius: 8, maxWidth: 320 }}>
          <span style={{ flex: 1, fontSize: '0.85rem' }}>Multiplicateur (1.05 = +5%)</span>
          <input type="number" step="0.01" min="1" max="1.3" value={pricing.invoiceBonus} onChange={(e) => setPricing({ ...pricing, invoiceBonus: parseFloat(e.target.value) || 1 })} className="rc-input" style={{ ...inputStyle(theme), width: 80, padding: '6px 8px' }} />
        </div>
      </Card>
    </div>
  );
}

// --- Marques (avec logo image uploadable) ---
function BrandsTab({ theme, brands, setBrands }) {
  const fileInputRefs = useRef({});

  const updateBrand = (id, field, val) => {
    setBrands(brands.map(b => b.id === id ? { ...b, [field]: val } : b));
  };

  const handleFileUpload = (brandId, file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image trop lourde (max 2 Mo). Compressez-la d'abord.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => updateBrand(brandId, 'logoImage', e.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <Card theme={theme} title="Marques">
      <p style={{ fontSize: '0.85rem', color: theme.textMuted, margin: '0 0 16px' }}>
        Pour chaque marque, vous pouvez utiliser un emoji <strong>ou</strong> uploader une image de logo (PNG transparent recommandé, max 2 Mo).
        L'image, si présente, est prioritaire sur l'emoji.
      </p>
      <div style={{ display: 'grid', gap: 14 }}>
        {brands.map(b => (
          <div key={b.id} style={{ padding: 14, background: theme.surface, borderRadius: 12, border: `1px solid ${theme.primary}10` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
              {/* Aperçu logo actuel */}
              <div style={{ width: 56, height: 56, borderRadius: 10, background: '#fff', border: `1.5px solid ${theme.primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                {b.logoImage ? (
                  <img src={b.logoImage} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }} />
                ) : (
                  <span style={{ fontSize: '1.8rem' }}>{b.logo}</span>
                )}
              </div>
              <input value={b.name} onChange={(e) => updateBrand(b.id, 'name', e.target.value)} className="rc-input" style={{ ...inputStyle(theme), flex: 1, minWidth: 120 }} placeholder="Nom de la marque" />
              <input type="color" value={b.color} onChange={(e) => updateBrand(b.id, 'color', e.target.value)} style={{ width: 42, height: 42, borderRadius: 10, border: `1.5px solid ${theme.primary}25`, cursor: 'pointer' }} title="Couleur de marque" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: theme.textMuted, display: 'block', marginBottom: 6 }}>Emoji (fallback)</label>
                <input value={b.logo} onChange={(e) => updateBrand(b.id, 'logo', e.target.value)} className="rc-input" style={{ ...inputStyle(theme), fontSize: '1.1rem', textAlign: 'center' }} placeholder="🍎" />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: theme.textMuted, display: 'block', marginBottom: 6 }}>URL d'image (optionnel)</label>
                <input value={b.logoImage && b.logoImage.startsWith('http') ? b.logoImage : ''} onChange={(e) => updateBrand(b.id, 'logoImage', e.target.value)} className="rc-input" style={inputStyle(theme)} placeholder="https://..." />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: theme.textMuted, display: 'block', marginBottom: 6 }}>Uploader depuis l'appareil</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    ref={(el) => fileInputRefs.current[b.id] = el}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(b.id, e.target.files?.[0])}
                  />
                  <button
                    onClick={() => fileInputRefs.current[b.id]?.click()}
                    className="rc-btn"
                    style={{ flex: 1, padding: '9px 12px', borderRadius: 10, border: `1.5px solid ${theme.primary}30`, background: '#fff', color: theme.primary, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', fontSize: '0.85rem' }}
                  >
                    <Upload size={14} /> Choisir un fichier
                  </button>
                  {b.logoImage && (
                    <button
                      onClick={() => updateBrand(b.id, 'logoImage', '')}
                      className="rc-btn"
                      style={{ padding: '9px 12px', borderRadius: 10, border: `1.5px solid #fca5a5`, background: '#fff', color: '#dc2626', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
                      title="Retirer l'image"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}


// ================== HELPERS UI ==================
function Card({ theme, title, children }) {
  return (
    <div style={{ padding: 20, borderRadius: 18, background: '#fff', border: `1px solid ${theme.primary}15`, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
      {title && <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 14px', fontFamily: 'Manrope, sans-serif' }}>{title}</h3>}
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function inputStyle(theme) {
  return {
    width: '100%', padding: '9px 12px', borderRadius: 10,
    border: `1.5px solid ${theme.primary}25`, background: '#fff',
    fontSize: '0.92rem', color: theme.text, fontFamily: 'inherit',
  };
}

function iconBtn(theme) {
  return {
    width: 34, height: 34, borderRadius: 8, border: `1px solid ${theme.primary}20`,
    background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: theme.text, flexShrink: 0,
  };
}

// ================== FOOTER ==================
function Footer({ theme }) {
  return (
    <footer style={{ textAlign: 'center', padding: '24px 16px', borderTop: `1px solid ${theme.primary}10`, color: theme.textMuted, fontSize: '0.82rem', background: theme.surface }}>
      <div style={{ fontWeight: 700, color: theme.text, marginBottom: 4 }}>{theme.siteName}</div>
      Reprise mobile en magasin · Estimation à titre indicatif · Prix éditables via le tableau de bord
    </footer>
  );
}
