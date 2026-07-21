import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Home, LayoutDashboard, Smartphone, Battery, Camera, FileText, ChevronRight, ChevronUp, ChevronDown, Plus, Edit2, Trash2, Save, X, Palette, Type, Settings, Check, ArrowLeft, Upload, Sparkles, Lock, ExternalLink, Printer, User, Phone, Mail, History, Info } from 'lucide-react';
import { loadConfig, saveKey, subscribeConfig, firebaseReady } from './storage';

// Mot de passe d'accès au tableau de bord
const DASHBOARD_PASSWORD = 'Raphael2232';
// Mot de passe d'accès à l'historique des estimations
const HISTORY_PASSWORD = '0852';

// Logo Care (base64 PNG, fond transparent)
const LOGO_DATA_URL = 'data:image/png;base64,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WU3ZXaa4vMzm179J9+tfp/v4ExBqvE9dLtOMwQLaWd65nl7nqU1tarsSZu8MdTjrS8FlNubCIT3NTqlA2i1kZgbnEh2P5FR1bNfH2AYo1obiXIO2m6cCKtuiUddISOM6N6t7DUGhCr1NZK2bGaTTfK8UWYRIySGsz8RhOS9Vm17pqU1tatudn4hYls9ILL9Cns/IKps+iQMJccD9OSnamwC1TWpY+Wu/ET8q6rYz8hvDzrTtB4ekoXUzRI3CMpX+iJK1sySRmKAB08R3alOb2s60dxTG1heJxuFQguuP36TxsjBgBL71DqoDShw9HzNPWX9Y2yd8qt2E/GynVxXLmhi2fRQDlzFANiAJFVLxc+r6pja1qY1zMdOccGpTm9pfOXPTUzC1qU1t6vymNrWpTW3q/KY2talNber8pja1qU1t6vymNrWpTW3q/KY2talNber8pja1qU1t6vymNrWpTW3q/KY2talNber8pja1qU1t6vymNrWpTW3q/KY2talNber8pja1qU1t6vymNrWpTW3q/KY2talNber8pja1qU1t6vymNrWpTW3q/KY2talNber8pja1qU1t6vymNrWpTZ3f1KY2talNnd/Upja1qU2d39SmNrWpTZ3f1KY2talNnd/Upja1qU2d39SmNrWpTZ3f1KY2talNnd/Upja1qU2d39SmNrWpTZ3f1KY2talNnd/Upja1qU2d39SmNrWpTZ3f1KY2talNnd/Upja1qU2d39SmNrWpTZ3f1KY2talNnd/Upja1qd3c/v8uMVjOIkyDvwAAAABJRU5ErkJggg==';

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
  // ========================= SAMSUNG =========================
  // ----- Galaxy S -----
  { id: 's26-ultra', brand: 'samsung', name: 'Galaxy S26 Ultra', image: '', storage: mp({ '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 's26-plus',  brand: 'samsung', name: 'Galaxy S26+',      image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 's26',       brand: 'samsung', name: 'Galaxy S26',       image: '', storage: mp({ '128 Go': 1, '256 Go': 1, '512 Go': 1 }) },
  { id: 's25-ultra', brand: 'samsung', name: 'Galaxy S25 Ultra', image: '', storage: mp({ '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 's25-edge',  brand: 'samsung', name: 'Galaxy S25 Edge',  image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 's25-plus',  brand: 'samsung', name: 'Galaxy S25+',      image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 's25-fe',    brand: 'samsung', name: 'Galaxy S25 FE',    image: '', storage: mp({ '128 Go': 1, '256 Go': 1, '512 Go': 1 }) },
  { id: 's25',       brand: 'samsung', name: 'Galaxy S25',       image: '', storage: mp({ '128 Go': 1, '256 Go': 1, '512 Go': 1 }) },
  { id: 's24-ultra', brand: 'samsung', name: 'Galaxy S24 Ultra', image: '', storage: mp({ '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 's24-plus',  brand: 'samsung', name: 'Galaxy S24+',      image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 's24-fe',    brand: 'samsung', name: 'Galaxy S24 FE',    image: '', storage: mp({ '128 Go': 1, '256 Go': 1, '512 Go': 1 }) },
  { id: 's24',       brand: 'samsung', name: 'Galaxy S24',       image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 's23-ultra', brand: 'samsung', name: 'Galaxy S23 Ultra', image: '', storage: mp({ '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 's23-plus',  brand: 'samsung', name: 'Galaxy S23+',      image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 's23-fe',    brand: 'samsung', name: 'Galaxy S23 FE',    image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 's23',       brand: 'samsung', name: 'Galaxy S23',       image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 's22-ultra', brand: 'samsung', name: 'Galaxy S22 Ultra', image: '', storage: mp({ '128 Go': 1, '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 's22-plus',  brand: 'samsung', name: 'Galaxy S22+',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 's22',       brand: 'samsung', name: 'Galaxy S22',       image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 's21-ultra', brand: 'samsung', name: 'Galaxy S21 Ultra', image: '', storage: mp({ '128 Go': 1, '256 Go': 1, '512 Go': 1 }) },
  { id: 's21-plus',  brand: 'samsung', name: 'Galaxy S21+',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 's21-fe',    brand: 'samsung', name: 'Galaxy S21 FE',    image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 's21',       brand: 'samsung', name: 'Galaxy S21',       image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 's20-ultra', brand: 'samsung', name: 'Galaxy S20 Ultra', image: '', storage: mp({ '128 Go': 1, '512 Go': 1 }) },
  { id: 's20-plus',  brand: 'samsung', name: 'Galaxy S20+',      image: '', storage: mp({ '128 Go': 1, '512 Go': 1 }) },
  { id: 's20-fe',    brand: 'samsung', name: 'Galaxy S20 FE',    image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 's20',       brand: 'samsung', name: 'Galaxy S20',       image: '', storage: mp({ '128 Go': 1 }) },
  // ----- Galaxy Z Fold -----
  { id: 'z-fold-7',  brand: 'samsung', name: 'Galaxy Z Fold 7',  image: '', storage: mp({ '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 'z-fold-6',  brand: 'samsung', name: 'Galaxy Z Fold 6',  image: '', storage: mp({ '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 'z-fold-5',  brand: 'samsung', name: 'Galaxy Z Fold 5',  image: '', storage: mp({ '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 'z-fold-4',  brand: 'samsung', name: 'Galaxy Z Fold 4',  image: '', storage: mp({ '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 'z-fold-3',  brand: 'samsung', name: 'Galaxy Z Fold 3',  image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  // ----- Galaxy Z Flip -----
  { id: 'z-flip-7',  brand: 'samsung', name: 'Galaxy Z Flip 7',  image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'z-flip-6',  brand: 'samsung', name: 'Galaxy Z Flip 6',  image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'z-flip-5',  brand: 'samsung', name: 'Galaxy Z Flip 5',  image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'z-flip-4',  brand: 'samsung', name: 'Galaxy Z Flip 4',  image: '', storage: mp({ '128 Go': 1, '256 Go': 1, '512 Go': 1 }) },
  { id: 'z-flip-3',  brand: 'samsung', name: 'Galaxy Z Flip 3',  image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  // ----- Galaxy A -----
  { id: 'a57',  brand: 'samsung', name: 'Galaxy A57 5G', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'a56',  brand: 'samsung', name: 'Galaxy A56 5G', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'a55',  brand: 'samsung', name: 'Galaxy A55 5G', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'a54',  brand: 'samsung', name: 'Galaxy A54 5G', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'a53',  brand: 'samsung', name: 'Galaxy A53 5G', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'a52s', brand: 'samsung', name: 'Galaxy A52s 5G', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'a52',  brand: 'samsung', name: 'Galaxy A52', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'a51',  brand: 'samsung', name: 'Galaxy A51', image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'a42',  brand: 'samsung', name: 'Galaxy A42 5G', image: '', storage: mp({ '128 Go': 1 }) },
  { id: 'a41',  brand: 'samsung', name: 'Galaxy A41', image: '', storage: mp({ '64 Go': 1 }) },
  { id: 'a37',  brand: 'samsung', name: 'Galaxy A37 5G', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'a36',  brand: 'samsung', name: 'Galaxy A36 5G', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'a35',  brand: 'samsung', name: 'Galaxy A35 5G', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'a34',  brand: 'samsung', name: 'Galaxy A34 5G', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'a33',  brand: 'samsung', name: 'Galaxy A33 5G', image: '', storage: mp({ '128 Go': 1 }) },
  { id: 'a32',  brand: 'samsung', name: 'Galaxy A32', image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'a27',  brand: 'samsung', name: 'Galaxy A27 5G', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'a26',  brand: 'samsung', name: 'Galaxy A26 5G', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'a25',  brand: 'samsung', name: 'Galaxy A25 5G', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'a24',  brand: 'samsung', name: 'Galaxy A24', image: '', storage: mp({ '128 Go': 1 }) },
  { id: 'a23',  brand: 'samsung', name: 'Galaxy A23 5G', image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'a17',  brand: 'samsung', name: 'Galaxy A17', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'a16',  brand: 'samsung', name: 'Galaxy A16 5G', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'a15',  brand: 'samsung', name: 'Galaxy A15', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'a14',  brand: 'samsung', name: 'Galaxy A14', image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'a13',  brand: 'samsung', name: 'Galaxy A13', image: '', storage: mp({ '32 Go': 1, '64 Go': 1, '128 Go': 1 }) },
  { id: 'a07',  brand: 'samsung', name: 'Galaxy A07', image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'a06',  brand: 'samsung', name: 'Galaxy A06', image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'a05s', brand: 'samsung', name: 'Galaxy A05s', image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'a05',  brand: 'samsung', name: 'Galaxy A05', image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'a04s', brand: 'samsung', name: 'Galaxy A04s', image: '', storage: mp({ '32 Go': 1, '64 Go': 1 }) },
  { id: 'a04',  brand: 'samsung', name: 'Galaxy A04', image: '', storage: mp({ '32 Go': 1, '64 Go': 1 }) },
  { id: 'a03s', brand: 'samsung', name: 'Galaxy A03s', image: '', storage: mp({ '32 Go': 1, '64 Go': 1 }) },
  { id: 'a03',  brand: 'samsung', name: 'Galaxy A03', image: '', storage: mp({ '32 Go': 1, '64 Go': 1 }) },
  { id: 'a02s', brand: 'samsung', name: 'Galaxy A02s', image: '', storage: mp({ '32 Go': 1, '64 Go': 1 }) },
  // ========================= XIAOMI =========================
  // ----- Xiaomi (serie phare) -----
  { id: 'xiaomi-15t-pro',  brand: 'xiaomi', name: 'Xiaomi 15T Pro',  image: '', storage: mp({ '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 'xiaomi-15t',      brand: 'xiaomi', name: 'Xiaomi 15T',      image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'xiaomi-15-ultra', brand: 'xiaomi', name: 'Xiaomi 15 Ultra', image: '', storage: mp({ '512 Go': 1, '1 To': 1 }) },
  { id: 'xiaomi-15-pro',   brand: 'xiaomi', name: 'Xiaomi 15 Pro',   image: '', storage: mp({ '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 'xiaomi-15',       brand: 'xiaomi', name: 'Xiaomi 15',       image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'xiaomi-14t-pro',  brand: 'xiaomi', name: 'Xiaomi 14T Pro',  image: '', storage: mp({ '512 Go': 1, '1 To': 1 }) },
  { id: 'xiaomi-14t',      brand: 'xiaomi', name: 'Xiaomi 14T',      image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'xiaomi-14-ultra', brand: 'xiaomi', name: 'Xiaomi 14 Ultra', image: '', storage: mp({ '512 Go': 1, '1 To': 1 }) },
  { id: 'xiaomi-14',       brand: 'xiaomi', name: 'Xiaomi 14',       image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'xiaomi-13t-pro',  brand: 'xiaomi', name: 'Xiaomi 13T Pro',  image: '', storage: mp({ '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 'xiaomi-13t',      brand: 'xiaomi', name: 'Xiaomi 13T',      image: '', storage: mp({ '256 Go': 1 }) },
  { id: 'xiaomi-13-ultra', brand: 'xiaomi', name: 'Xiaomi 13 Ultra', image: '', storage: mp({ '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 'xiaomi-13-pro',   brand: 'xiaomi', name: 'Xiaomi 13 Pro',   image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'xiaomi-13-lite',  brand: 'xiaomi', name: 'Xiaomi 13 Lite',  image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'xiaomi-13',       brand: 'xiaomi', name: 'Xiaomi 13',       image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'xiaomi-12x',      brand: 'xiaomi', name: 'Xiaomi 12X',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'xiaomi-12-pro',   brand: 'xiaomi', name: 'Xiaomi 12 Pro',   image: '', storage: mp({ '256 Go': 1 }) },
  { id: 'xiaomi-12-lite',  brand: 'xiaomi', name: 'Xiaomi 12 Lite',  image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'xiaomi-12t-pro',  brand: 'xiaomi', name: 'Xiaomi 12T Pro',  image: '', storage: mp({ '256 Go': 1 }) },
  { id: 'xiaomi-12t',      brand: 'xiaomi', name: 'Xiaomi 12T',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'xiaomi-12',       brand: 'xiaomi', name: 'Xiaomi 12',       image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'xiaomi-11t-pro',  brand: 'xiaomi', name: 'Xiaomi 11T Pro',  image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'xiaomi-11t',      brand: 'xiaomi', name: 'Xiaomi 11T',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'xiaomi-11-lite-5g-ne', brand: 'xiaomi', name: 'Xiaomi 11 Lite 5G NE', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  // ----- Mi -----
  { id: 'mi-11-ultra',     brand: 'xiaomi', name: 'Mi 11 Ultra',     image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'mi-11-pro',       brand: 'xiaomi', name: 'Mi 11 Pro',       image: '', storage: mp({ '256 Go': 1 }) },
  { id: 'mi-11i',          brand: 'xiaomi', name: 'Mi 11i',          image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'mi-11-5g',        brand: 'xiaomi', name: 'Mi 11 5G',        image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'mi-11-lite-5g',   brand: 'xiaomi', name: 'Mi 11 Lite 5G',   image: '', storage: mp({ '128 Go': 1 }) },
  { id: 'mi-11-lite-4g',   brand: 'xiaomi', name: 'Mi 11 Lite 4G',   image: '', storage: mp({ '128 Go': 1 }) },
  { id: 'mi-10t-pro-5g',   brand: 'xiaomi', name: 'Mi 10T Pro 5G',   image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'mi-10t-5g',       brand: 'xiaomi', name: 'Mi 10T 5G',       image: '', storage: mp({ '128 Go': 1 }) },
  { id: 'mi-10t-lite-5g',  brand: 'xiaomi', name: 'Mi 10T Lite 5G',  image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'mi-10-pro-5g',    brand: 'xiaomi', name: 'Mi 10 Pro 5G',    image: '', storage: mp({ '256 Go': 1 }) },
  { id: 'mi-10-5g',        brand: 'xiaomi', name: 'Mi 10 5G',        image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'mi-10-lite-5g',   brand: 'xiaomi', name: 'Mi 10 Lite 5G',   image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'mi-9t-pro',       brand: 'xiaomi', name: 'Mi 9T Pro',       image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'mi-9t',           brand: 'xiaomi', name: 'Mi 9T',           image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'mi-9-se',         brand: 'xiaomi', name: 'Mi 9 SE',         image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'mi-9',            brand: 'xiaomi', name: 'Mi 9',            image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'mi-9-lite',       brand: 'xiaomi', name: 'Mi 9 Lite',       image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'mi-8',            brand: 'xiaomi', name: 'Mi 8',            image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'mi-8-lite',       brand: 'xiaomi', name: 'Mi 8 Lite',       image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'mi-note-10-pro',  brand: 'xiaomi', name: 'Mi Note 10 Pro',  image: '', storage: mp({ '256 Go': 1 }) },
  { id: 'mi-note-10',      brand: 'xiaomi', name: 'Mi Note 10',      image: '', storage: mp({ '128 Go': 1 }) },
  { id: 'mi-note-10-lite', brand: 'xiaomi', name: 'Mi Note 10 Lite', image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'mi-mix-3',        brand: 'xiaomi', name: 'Mi Mix 3',        image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'mi-mix-2s',       brand: 'xiaomi', name: 'Mi Mix 2S',       image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'mi-mix-2',        brand: 'xiaomi', name: 'Mi Mix 2',        image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'mi-a3',           brand: 'xiaomi', name: 'Mi A3',           image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'mi-a2-lite',      brand: 'xiaomi', name: 'Mi A2 Lite',      image: '', storage: mp({ '32 Go': 1, '64 Go': 1 }) },
  { id: 'mi-a2',           brand: 'xiaomi', name: 'Mi A2',           image: '', storage: mp({ '32 Go': 1, '64 Go': 1, '128 Go': 1 }) },
  // ----- Redmi Note -----
  { id: 'redmi-note-15-pro-plus-5g', brand: 'xiaomi', name: 'Redmi Note 15 Pro+ 5G', image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'redmi-note-15-pro-5g',      brand: 'xiaomi', name: 'Redmi Note 15 Pro 5G',  image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'redmi-note-15-pro-4g',      brand: 'xiaomi', name: 'Redmi Note 15 Pro 4G',  image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-note-15-5g',          brand: 'xiaomi', name: 'Redmi Note 15 5G',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-note-15-4g',          brand: 'xiaomi', name: 'Redmi Note 15 4G',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-note-14-pro-plus-5g', brand: 'xiaomi', name: 'Redmi Note 14 Pro+ 5G', image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'redmi-note-14-pro-5g',      brand: 'xiaomi', name: 'Redmi Note 14 Pro 5G',  image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'redmi-note-14-pro-4g',      brand: 'xiaomi', name: 'Redmi Note 14 Pro 4G',  image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-note-14-5g',          brand: 'xiaomi', name: 'Redmi Note 14 5G',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-note-14-4g',          brand: 'xiaomi', name: 'Redmi Note 14 4G',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-note-13-pro-plus-5g', brand: 'xiaomi', name: 'Redmi Note 13 Pro+ 5G', image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'redmi-note-13-pro-5g',      brand: 'xiaomi', name: 'Redmi Note 13 Pro 5G',  image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-note-13-pro-4g',      brand: 'xiaomi', name: 'Redmi Note 13 Pro 4G',  image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-note-13-5g',          brand: 'xiaomi', name: 'Redmi Note 13 5G',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-note-13-4g',          brand: 'xiaomi', name: 'Redmi Note 13 4G',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-note-12-pro-plus-5g', brand: 'xiaomi', name: 'Redmi Note 12 Pro+ 5G', image: '', storage: mp({ '256 Go': 1 }) },
  { id: 'redmi-note-12-pro-5g',      brand: 'xiaomi', name: 'Redmi Note 12 Pro 5G',  image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-note-12-pro-4g',      brand: 'xiaomi', name: 'Redmi Note 12 Pro 4G',  image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-note-12s',            brand: 'xiaomi', name: 'Redmi Note 12S',        image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-note-12-5g',          brand: 'xiaomi', name: 'Redmi Note 12 5G',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-note-12-4g',          brand: 'xiaomi', name: 'Redmi Note 12 4G',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-note-11-pro-plus-5g', brand: 'xiaomi', name: 'Redmi Note 11 Pro+ 5G', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-note-11-pro-5g',      brand: 'xiaomi', name: 'Redmi Note 11 Pro 5G',  image: '', storage: mp({ '128 Go': 1 }) },
  { id: 'redmi-note-11-pro',         brand: 'xiaomi', name: 'Redmi Note 11 Pro',     image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'redmi-note-11s-5g',         brand: 'xiaomi', name: 'Redmi Note 11S 5G',     image: '', storage: mp({ '128 Go': 1 }) },
  { id: 'redmi-note-11s',            brand: 'xiaomi', name: 'Redmi Note 11S',        image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'redmi-note-11',             brand: 'xiaomi', name: 'Redmi Note 11',         image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'redmi-note-10t',            brand: 'xiaomi', name: 'Redmi Note 10T',        image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'redmi-note-10-pro-5g',      brand: 'xiaomi', name: 'Redmi Note 10 Pro 5G',  image: '', storage: mp({ '128 Go': 1 }) },
  { id: 'redmi-note-10-pro',         brand: 'xiaomi', name: 'Redmi Note 10 Pro',     image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'redmi-note-10s',            brand: 'xiaomi', name: 'Redmi Note 10S',        image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'redmi-note-10-5g',          brand: 'xiaomi', name: 'Redmi Note 10 5G',      image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  // ----- Redmi -----
  { id: 'redmi-15c-5g',    brand: 'xiaomi', name: 'Redmi 15C 5G',    image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-15c-4g',    brand: 'xiaomi', name: 'Redmi 15C 4G',    image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-15-5g',     brand: 'xiaomi', name: 'Redmi 15 5G',     image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-15-4g',     brand: 'xiaomi', name: 'Redmi 15 4G',     image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-14c-5g',    brand: 'xiaomi', name: 'Redmi 14C 5G',    image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-14c',       brand: 'xiaomi', name: 'Redmi 14C',       image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-13c-5g',    brand: 'xiaomi', name: 'Redmi 13C 5G',    image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-13c',       brand: 'xiaomi', name: 'Redmi 13C',       image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-13',        brand: 'xiaomi', name: 'Redmi 13',        image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-12-5g',     brand: 'xiaomi', name: 'Redmi 12 5G',     image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-12-4g',     brand: 'xiaomi', name: 'Redmi 12 4G',     image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'redmi-12c',       brand: 'xiaomi', name: 'Redmi 12C',       image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'redmi-10c',       brand: 'xiaomi', name: 'Redmi 10C',       image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'redmi-10-2022',   brand: 'xiaomi', name: 'Redmi 10 (2022)', image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'redmi-10a',       brand: 'xiaomi', name: 'Redmi 10A',       image: '', storage: mp({ '32 Go': 1, '64 Go': 1 }) },
  { id: 'redmi-10',        brand: 'xiaomi', name: 'Redmi 10',        image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'redmi-9c',        brand: 'xiaomi', name: 'Redmi 9C',        image: '', storage: mp({ '32 Go': 1, '64 Go': 1, '128 Go': 1 }) },
  { id: 'redmi-9at',       brand: 'xiaomi', name: 'Redmi 9AT',       image: '', storage: mp({ '32 Go': 1 }) },
  { id: 'redmi-9a',        brand: 'xiaomi', name: 'Redmi 9A',        image: '', storage: mp({ '32 Go': 1 }) },
  { id: 'redmi-9t',        brand: 'xiaomi', name: 'Redmi 9T',        image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'redmi-9',         brand: 'xiaomi', name: 'Redmi 9',         image: '', storage: mp({ '32 Go': 1, '64 Go': 1 }) },
  { id: 'redmi-8a',        brand: 'xiaomi', name: 'Redmi 8A',        image: '', storage: mp({ '32 Go': 1, '64 Go': 1 }) },
  { id: 'redmi-8',         brand: 'xiaomi', name: 'Redmi 8',         image: '', storage: mp({ '32 Go': 1, '64 Go': 1 }) },
  { id: 'redmi-7a',        brand: 'xiaomi', name: 'Redmi 7A',        image: '', storage: mp({ '16 Go': 1, '32 Go': 1 }) },
  { id: 'redmi-7',         brand: 'xiaomi', name: 'Redmi 7',         image: '', storage: mp({ '32 Go': 1, '64 Go': 1 }) },
  { id: 'redmi-6a',        brand: 'xiaomi', name: 'Redmi 6A',        image: '', storage: mp({ '16 Go': 1, '32 Go': 1 }) },
  { id: 'redmi-6',         brand: 'xiaomi', name: 'Redmi 6',         image: '', storage: mp({ '32 Go': 1, '64 Go': 1 }) },
  { id: 'redmi-5-plus',    brand: 'xiaomi', name: 'Redmi 5 Plus',    image: '', storage: mp({ '32 Go': 1, '64 Go': 1 }) },
  { id: 'redmi-a7-pro',    brand: 'xiaomi', name: 'Redmi A7 Pro',    image: '', storage: mp({ '128 Go': 1 }) },
  { id: 'redmi-a5',        brand: 'xiaomi', name: 'Redmi A5',        image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'redmi-a3',        brand: 'xiaomi', name: 'Redmi A3',        image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  // ----- Poco -----
  { id: 'poco-f8-ultra',   brand: 'xiaomi', name: 'Poco F8 Ultra',   image: '', storage: mp({ '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 'poco-f8-pro',     brand: 'xiaomi', name: 'Poco F8 Pro',     image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'poco-f7-ultra',   brand: 'xiaomi', name: 'Poco F7 Ultra',   image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'poco-f7-pro',     brand: 'xiaomi', name: 'Poco F7 Pro',     image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'poco-f7-5g',      brand: 'xiaomi', name: 'Poco F7 5G',      image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'poco-f6-pro',     brand: 'xiaomi', name: 'Poco F6 Pro',     image: '', storage: mp({ '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 'poco-f6',         brand: 'xiaomi', name: 'Poco F6',         image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'poco-f5-pro',     brand: 'xiaomi', name: 'Poco F5 Pro',     image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'poco-f5',         brand: 'xiaomi', name: 'Poco F5',         image: '', storage: mp({ '256 Go': 1 }) },
  { id: 'poco-f4-5g',      brand: 'xiaomi', name: 'Poco F4 5G',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'poco-f3',         brand: 'xiaomi', name: 'Poco F3',         image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'poco-f2-pro',     brand: 'xiaomi', name: 'Poco F2 Pro',     image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'poco-f1',         brand: 'xiaomi', name: 'Poco F1',         image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'poco-x8-pro-max', brand: 'xiaomi', name: 'Poco X8 Pro Max', image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'poco-x8-pro',     brand: 'xiaomi', name: 'Poco X8 Pro',     image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'poco-x7-pro',     brand: 'xiaomi', name: 'Poco X7 Pro',     image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'poco-x7',         brand: 'xiaomi', name: 'Poco X7',         image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'poco-x6-pro',     brand: 'xiaomi', name: 'Poco X6 Pro',     image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'poco-x6',         brand: 'xiaomi', name: 'Poco X6',         image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'poco-x5-pro-5g',  brand: 'xiaomi', name: 'Poco X5 Pro 5G',  image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'poco-x5-5g',      brand: 'xiaomi', name: 'Poco X5 5G',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'poco-x4-pro-5g',  brand: 'xiaomi', name: 'Poco X4 Pro 5G',  image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'poco-x4-gt',      brand: 'xiaomi', name: 'Poco X4 GT',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'poco-x3-pro',     brand: 'xiaomi', name: 'Poco X3 Pro',     image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'poco-x3-nfc',     brand: 'xiaomi', name: 'Poco X3 NFC',     image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'poco-x3',         brand: 'xiaomi', name: 'Poco X3',         image: '', storage: mp({ '64 Go': 1, '128 Go': 1 }) },
  { id: 'poco-m7-plus',    brand: 'xiaomi', name: 'Poco M7 Plus',    image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'poco-m7-5g',      brand: 'xiaomi', name: 'Poco M7 5G',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'poco-m7-4g',      brand: 'xiaomi', name: 'Poco M7 4G',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'poco-m6-pro',     brand: 'xiaomi', name: 'Poco M6 Pro',     image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'poco-m6-5g',      brand: 'xiaomi', name: 'Poco M6 5G',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'poco-m6-4g',      brand: 'xiaomi', name: 'Poco M6 4G',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  // ========================= HONOR =========================
  // ----- Magic -----
  { id: 'honor-magic-7-pro',  brand: 'honor', name: 'Honor Magic 7 Pro',  image: '', storage: mp({ '512 Go': 1, '1 To': 1 }) },
  { id: 'honor-magic-7-lite', brand: 'honor', name: 'Honor Magic 7 Lite', image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'honor-magic-6-pro',  brand: 'honor', name: 'Honor Magic 6 Pro',  image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'honor-magic-6-lite', brand: 'honor', name: 'Honor Magic 6 Lite', image: '', storage: mp({ '256 Go': 1 }) },
  { id: 'honor-magic-5-pro',  brand: 'honor', name: 'Honor Magic 5 Pro',  image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'honor-magic-5-lite', brand: 'honor', name: 'Honor Magic 5 Lite', image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  // ----- Magic V (pliables) -----
  { id: 'honor-magic-v3',     brand: 'honor', name: 'Honor Magic V3',     image: '', storage: mp({ '512 Go': 1 }) },
  { id: 'honor-magic-v2',     brand: 'honor', name: 'Honor Magic V2',     image: '', storage: mp({ '512 Go': 1 }) },
  // ----- Serie numerotee -----
  { id: 'honor-400-pro',      brand: 'honor', name: 'Honor 400 Pro',      image: '', storage: mp({ '512 Go': 1 }) },
  { id: 'honor-400',          brand: 'honor', name: 'Honor 400',          image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'honor-400-lite',     brand: 'honor', name: 'Honor 400 Lite',     image: '', storage: mp({ '256 Go': 1 }) },
  { id: 'honor-200-pro',      brand: 'honor', name: 'Honor 200 Pro',      image: '', storage: mp({ '512 Go': 1 }) },
  { id: 'honor-200',          brand: 'honor', name: 'Honor 200',          image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'honor-200-lite',     brand: 'honor', name: 'Honor 200 Lite',     image: '', storage: mp({ '256 Go': 1 }) },
  { id: 'honor-90',           brand: 'honor', name: 'Honor 90',           image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'honor-90-lite',      brand: 'honor', name: 'Honor 90 Lite',      image: '', storage: mp({ '256 Go': 1 }) },
  // ----- Serie X -----
  { id: 'honor-x9c',          brand: 'honor', name: 'Honor X9c',          image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'honor-x9b',          brand: 'honor', name: 'Honor X9b',          image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'honor-x8c',          brand: 'honor', name: 'Honor X8c',          image: '', storage: mp({ '256 Go': 1 }) },
  { id: 'honor-x8b',          brand: 'honor', name: 'Honor X8b',          image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'honor-x7c',          brand: 'honor', name: 'Honor X7c',          image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'honor-x7b',          brand: 'honor', name: 'Honor X7b',          image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'honor-x6b',          brand: 'honor', name: 'Honor X6b',          image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  // ========================= OPPO =========================
  // ----- Find X -----
  { id: 'oppo-find-x8-pro',   brand: 'oppo', name: 'Oppo Find X8 Pro',   image: '', storage: mp({ '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 'oppo-find-x8',       brand: 'oppo', name: 'Oppo Find X8',       image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'oppo-find-x7-ultra', brand: 'oppo', name: 'Oppo Find X7 Ultra', image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'oppo-find-x6-pro',   brand: 'oppo', name: 'Oppo Find X6 Pro',   image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  // ----- Find N (pliables) -----
  { id: 'oppo-find-n5',       brand: 'oppo', name: 'Oppo Find N5',       image: '', storage: mp({ '512 Go': 1, '1 To': 1 }) },
  { id: 'oppo-find-n3',       brand: 'oppo', name: 'Oppo Find N3',       image: '', storage: mp({ '512 Go': 1 }) },
  // ----- Reno -----
  { id: 'oppo-reno-13-pro',   brand: 'oppo', name: 'Oppo Reno 13 Pro',   image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'oppo-reno-13',       brand: 'oppo', name: 'Oppo Reno 13',       image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'oppo-reno-12-pro',   brand: 'oppo', name: 'Oppo Reno 12 Pro',   image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'oppo-reno-12',       brand: 'oppo', name: 'Oppo Reno 12',       image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'oppo-reno-11-pro',   brand: 'oppo', name: 'Oppo Reno 11 Pro',   image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'oppo-reno-11',       brand: 'oppo', name: 'Oppo Reno 11',       image: '', storage: mp({ '256 Go': 1 }) },
  { id: 'oppo-reno-10-pro',   brand: 'oppo', name: 'Oppo Reno 10 Pro',   image: '', storage: mp({ '256 Go': 1 }) },
  { id: 'oppo-reno-10',       brand: 'oppo', name: 'Oppo Reno 10',       image: '', storage: mp({ '256 Go': 1 }) },
  // ----- Serie A -----
  { id: 'oppo-a98',           brand: 'oppo', name: 'Oppo A98',           image: '', storage: mp({ '256 Go': 1 }) },
  { id: 'oppo-a80',           brand: 'oppo', name: 'Oppo A80',           image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'oppo-a79',           brand: 'oppo', name: 'Oppo A79',           image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'oppo-a78',           brand: 'oppo', name: 'Oppo A78',           image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'oppo-a60',           brand: 'oppo', name: 'Oppo A60',           image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'oppo-a40',           brand: 'oppo', name: 'Oppo A40',           image: '', storage: mp({ '128 Go': 1 }) },
  // ========================= GOOGLE =========================
  { id: 'pixel-10-pro-fold', brand: 'google', name: 'Pixel 10 Pro Fold', image: '', storage: mp({ '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 'pixel-10-pro-xl',   brand: 'google', name: 'Pixel 10 Pro XL',   image: '', storage: mp({ '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 'pixel-10-pro',      brand: 'google', name: 'Pixel 10 Pro',      image: '', storage: mp({ '128 Go': 1, '256 Go': 1, '512 Go': 1 }) },
  { id: 'pixel-10',          brand: 'google', name: 'Pixel 10',          image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'pixel-9-pro-fold',  brand: 'google', name: 'Pixel 9 Pro Fold',  image: '', storage: mp({ '256 Go': 1, '512 Go': 1 }) },
  { id: 'pixel-9-pro-xl',    brand: 'google', name: 'Pixel 9 Pro XL',    image: '', storage: mp({ '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 'pixel-9-pro',       brand: 'google', name: 'Pixel 9 Pro',       image: '', storage: mp({ '128 Go': 1, '256 Go': 1, '512 Go': 1 }) },
  { id: 'pixel-9',           brand: 'google', name: 'Pixel 9',           image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'pixel-8-pro',       brand: 'google', name: 'Pixel 8 Pro',       image: '', storage: mp({ '128 Go': 1, '256 Go': 1, '512 Go': 1, '1 To': 1 }) },
  { id: 'pixel-8',           brand: 'google', name: 'Pixel 8',           image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'pixel-8a',          brand: 'google', name: 'Pixel 8a',          image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'pixel-7-pro',       brand: 'google', name: 'Pixel 7 Pro',       image: '', storage: mp({ '128 Go': 1, '256 Go': 1, '512 Go': 1 }) },
  { id: 'pixel-7',           brand: 'google', name: 'Pixel 7',           image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'pixel-7a',          brand: 'google', name: 'Pixel 7a',          image: '', storage: mp({ '128 Go': 1 }) },
  { id: 'pixel-6-pro',       brand: 'google', name: 'Pixel 6 Pro',       image: '', storage: mp({ '128 Go': 1, '256 Go': 1, '512 Go': 1 }) },
  { id: 'pixel-6',           brand: 'google', name: 'Pixel 6',           image: '', storage: mp({ '128 Go': 1, '256 Go': 1 }) },
  { id: 'pixel-6a',          brand: 'google', name: 'Pixel 6a',          image: '', storage: mp({ '128 Go': 1 }) },
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
  // Liste éditable des états du téléphone (dashboard)
  conditions: [
    { key: 'neuf',         label: 'Neuf',         desc: 'Jamais utilisé, scellé',   mult: 1.00 },
    { key: 'comme-neuf',   label: 'Comme neuf',   desc: 'Aucune marque',             mult: 0.90 },
    { key: 'bon',          label: 'Bon état',     desc: 'Micro-rayures',             mult: 0.80 },
    { key: 'moyen',        label: 'État moyen',   desc: 'Rayures visibles',          mult: 0.65 },
    { key: 'mauvais',      label: 'Mauvais état', desc: 'Impacts, traces',           mult: 0.45 },
    { key: 'tres-mauvais', label: 'Très mauvais', desc: 'Écran ou coque endommagé', mult: 0.25 },
  ],
  // Ancien format conservé pour rétro-compatibilité (sera ignoré si conditions[] existe)
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

// Helper : renvoie la liste actuelle des états (conditions). Utilise pricing.conditions si présent,
// sinon reconstruit depuis l'ancien format conditionMultiplier.
function getConditions(pricing) {
  if (Array.isArray(pricing?.conditions) && pricing.conditions.length > 0) return pricing.conditions;
  const cm = pricing?.conditionMultiplier || {};
  const labels = { 'neuf': 'Neuf', 'comme-neuf': 'Comme neuf', 'bon': 'Bon état', 'moyen': 'État moyen', 'mauvais': 'Mauvais état', 'tres-mauvais': 'Très mauvais' };
  return Object.keys(cm).map(k => ({ key: k, label: labels[k] || k, desc: '', mult: cm[k] }));
}


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
  printLogoUrl: '',  // logo de la fiche imprimable / PDF (vide = logo Care par défaut)
  fontSize: 16,
  dashboardPassword: 'Raphael2232',  // modifiable dans le dashboard, onglet Réglages
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
    const conds = getConditions(pricing);
    const cond = conds.find(c => c.key === evaluation.condition);
    const mult = cond ? cond.mult : (pricing.conditionMultiplier?.[evaluation.condition] ?? 1);
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
// Listes initiales boutiques et vendeurs
const INITIAL_SHOPS = ['Brignoles', 'Hyères', 'Cogolin', 'Saint Raphaël', 'Vitrolles', 'Le Pontet'];
const INITIAL_SELLERS = ['David', 'Yannis', 'Sebastien', 'Florent', 'Quentin K', 'Michael', 'Antho', 'Romain', 'Damien', 'Gillou', 'Leo', 'Anouar', 'Adrien', 'Yasmine', 'Julia', 'Sam', 'Cindy', 'Johan'];

export default function RenkiCash() {
  const [view, setView] = useState('home');
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [brands, setBrands] = useState(INITIAL_BRANDS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [pricing, setPricing] = useState(INITIAL_PRICING);
  const [shops, setShops] = useState(INITIAL_SHOPS);
  const [sellers, setSellers] = useState(INITIAL_SELLERS);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [evaluation, setEvaluation] = useState({
    condition: null, battery: null, camera: null, invoice: null,
  });
  const [finalCalc, setFinalCalc] = useState(null);
  const [competitorPrice, setCompetitorPrice] = useState('');
  const [dashboardUnlocked, setDashboardUnlocked] = useState(false);
  const [historyUnlocked, setHistoryUnlocked] = useState(false);
  const [history, setHistory] = useState([]);
  const [customer, setCustomer] = useState({ firstName: '', lastName: '', phone: '', email: '', shop: '', seller: '' });
  const hydrated = useRef(false);

  const applyConfig = (cfg) => {
    if (!cfg) return;
    if (cfg.theme) setTheme({ ...DEFAULT_THEME, ...cfg.theme });
    if (cfg.products) setProducts(cfg.products);
    if (cfg.brands) setBrands(cfg.brands);
    if (cfg.pricing) setPricing(cfg.pricing);
    if (cfg.history) setHistory(cfg.history);
    if (cfg.shops) setShops(cfg.shops);
    if (cfg.sellers) setSellers(cfg.sellers);
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
  useEffect(() => { if (hydrated.current) saveKey('history', history); }, [history]);
  useEffect(() => { if (hydrated.current) saveKey('shops', shops); }, [shops]);
  useEffect(() => { if (hydrated.current) saveKey('sellers', sellers); }, [sellers]);

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
    setCustomer({ firstName: '', lastName: '', phone: '', email: '', shop: '', seller: '' });
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
      .rc-grid-products { grid-template-columns: repeat(2, 1fr) !important; }
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
      {/* Bandeau d'info : tout en haut du site, défile avec la page */}
      <InfoBanner theme={theme} />
      {/* Header */}
      <Header theme={theme} view={view} setView={setView} goHome={goHome} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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
        {view === 'product' && selectedProduct && <ProductView theme={theme} product={selectedProduct} brand={brands.find(b => b.id === selectedProduct.brand)} selectedStorage={selectedStorage} setSelectedStorage={setSelectedStorage} competitorPrice={competitorPrice} setCompetitorPrice={setCompetitorPrice} evaluation={evaluation} setEvaluation={setEvaluation} pricing={pricing} evaluationComplete={evaluationComplete} currentCalc={currentCalc} history={history} onValidate={(boost) => {
          // Applique le boost reprise au prix final + à la revente conseillée
          const b = boost || 0;
          const finalized = b > 0
            ? {
                ...currentCalc,
                price: currentCalc.price + b,
                resaleMin: currentCalc.resaleMin + b,
                resaleMax: currentCalc.resaleMax + b,
                boost: b,
                breakdown: [...(currentCalc.breakdown || []), { label: `Boost reprise (+${b} €)`, value: b, type: 'bonus' }],
              }
            : currentCalc;
          setFinalCalc(finalized);
          setView('customer');
        }} onBack={() => setView('brand')} />}
        {view === 'customer' && finalCalc && <CustomerView theme={theme} customer={customer} setCustomer={setCustomer} shops={shops} sellers={sellers} onBack={() => setView('product')} onConfirm={() => {
          // Enregistrer dans l'historique
          const entry = {
            id: 'est-' + Date.now(),
            date: new Date().toISOString(),
            customer: { ...customer },
            product: { id: selectedProduct.id, name: selectedProduct.name, brand: selectedProduct.brand },
            storage: selectedStorage,
            evaluation: { ...evaluation },
            calc: { price: finalCalc.price, breakdown: finalCalc.breakdown, resaleMin: finalCalc.resaleMin, resaleMax: finalCalc.resaleMax },
          };
          setHistory([entry, ...history]);
          setView('result');
        }} />}
        {view === 'result' && finalCalc && <ResultView theme={theme} product={selectedProduct} storage={selectedStorage} calc={finalCalc} evaluation={evaluation} customer={customer} brand={brands.find(b => b.id === selectedProduct.brand)} pricing={pricing} onRestart={goHome} />}
        {view === 'dashboard' && (dashboardUnlocked
          ? <Dashboard theme={theme} setTheme={setTheme} brands={brands} setBrands={setBrands} products={products} setProducts={setProducts} pricing={pricing} setPricing={setPricing} shops={shops} setShops={setShops} sellers={sellers} setSellers={setSellers} onLock={() => setDashboardUnlocked(false)} />
          : <DashboardLogin theme={theme} onUnlock={() => setDashboardUnlocked(true)} />
        )}
        {view === 'info' && <InfoView theme={theme} />}
        {view === 'history' && (historyUnlocked
          ? <HistoryView theme={theme} history={history} setHistory={setHistory} products={products} brands={brands} pricing={pricing} shops={shops} onLock={() => setHistoryUnlocked(false)} />
          : <HistoryLogin theme={theme} onUnlock={() => setHistoryUnlocked(true)} />
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
    <div style={{ background: theme.secondary, color: '#fff', overflow: 'hidden', borderBottom: `2px solid ${theme.primary}` }}>
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
    <header style={{ background: '#fff', borderBottom: `1px solid ${theme.primary}15`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div onClick={goHome} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}>
          <img src={theme.logoUrl || LOGO_DATA_URL} alt="Care Reprise" style={{ height: 40, width: 'auto' }} />
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
          <NavBtn theme={theme} active={view === 'info'} onClick={() => setView('info')} icon={<Info size={18} />} label="Infos" />
          <NavBtn theme={theme} active={view === 'history'} onClick={() => setView('history')} icon={<History size={18} />} label="Historique" />
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
function ProductView({ theme, product, brand, selectedStorage, setSelectedStorage, competitorPrice, setCompetitorPrice, evaluation, setEvaluation, pricing, evaluationComplete, currentCalc, history, onValidate, onBack }) {
  const storageOptions = product.storage || [];
  const [boost, setBoost] = useState(0);
  const [recentOpen, setRecentOpen] = useState(true); // ouvert par défaut

  // 3 dernières estimations pour CE modèle, du plus récent au plus ancien
  const recentEsts = (history || [])
    .filter(e => e.product?.id === product.id)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 3);
  useEffect(() => {
    if (!selectedStorage && storageOptions[0]) setSelectedStorage(storageOptions[0]);
  }, [product]);
  // Réinitialiser le boost si on change de produit (sécurité)
  useEffect(() => { setBoost(0); }, [product?.id]);

  const discountPct = Math.round(pricing.competitorDiscount * 100);

  return (
    <div className="rc-fade">
      <button className="rc-btn" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: theme.textMuted, cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: 16 }}>
        <ArrowLeft size={16} /> Retour
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 20 }}>

        {/* ===== BANDEAU DERNIÈRES ESTIMATIONS ===== */}
        {recentEsts.length > 0 && (() => {
          const condLabels = Object.fromEntries(getConditions(pricing).map(c => [c.key, c.label]));
          const battLabels = { 'fonctionnelle': '✅', 'a-remplacer': '⚠️', 'non-fonctionnelle': '❌' };
          const fmtDate = (iso) => {
            try {
              const d = new Date(iso);
              const today = new Date();
              const isToday = d.toDateString() === today.toDateString();
              const dateStr = isToday ? "Aujourd'hui" : d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
              const timeStr = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
              return `${dateStr} à ${timeStr}`;
            } catch { return iso; }
          };
          const last = recentEsts[0];
          const lastDate = fmtDate(last.date);

          return (
            <div style={{ borderRadius: 14, overflow: 'hidden', border: `1.5px solid ${theme.primary}25`, background: '#fff' }}>
              {/* Barre titre cliquable */}
              <button
                onClick={() => setRecentOpen(o => !o)}
                className="rc-btn"
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', border: 'none', background: theme.primaryLight, cursor: 'pointer', textAlign: 'left' }}
              >
                <span style={{ fontSize: '1rem' }}>🕐</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: theme.primaryDark }}>
                    {recentEsts.length} estimation{recentEsts.length > 1 ? 's' : ''} récente{recentEsts.length > 1 ? 's' : ''} sur ce modèle
                  </span>
                  {!recentOpen && (
                    <span style={{ fontSize: '0.8rem', color: theme.textMuted, marginLeft: 10 }}>
                      Dernière : <strong>{last.calc?.price + (last.calc?.boost || 0)} €</strong> — {lastDate}
                    </span>
                  )}
                </div>
                <ChevronDown size={16} style={{ color: theme.primary, flexShrink: 0, transform: recentOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {/* Contenu déroulant */}
              {recentOpen && (
                <div style={{ padding: '12px 16px', display: 'grid', gap: 8 }}>
                  {recentEsts.map((e, i) => {
                    const price = (e.calc?.price || 0);
                    const boost = e.calc?.boost || 0;
                    const total = price;
                    return (
                      <div key={e.id} style={{
                        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8,
                        padding: '10px 14px', borderRadius: 10,
                        background: i === 0 ? theme.primaryLight : theme.surface,
                        border: `1px solid ${i === 0 ? theme.primary + '30' : theme.primary + '10'}`,
                      }}>
                        {/* Prix */}
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: theme.primaryDark, fontFamily: 'Manrope, sans-serif', minWidth: 70 }}>
                          {total} €
                          {boost > 0 && <span style={{ fontSize: '0.72rem', fontWeight: 600, color: theme.primary, marginLeft: 4 }}>+{boost}€ boost</span>}
                        </div>
                        {/* Capacité */}
                        {e.storage && (
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: '#fff', border: `1px solid ${theme.primary}20`, color: theme.text }}>
                            {e.storage}
                          </span>
                        )}
                        {/* État */}
                        {e.evaluation?.condition && (
                          <span style={{ fontSize: '0.78rem', color: theme.textMuted }}>
                            {condLabels[e.evaluation.condition] || e.evaluation.condition}
                          </span>
                        )}
                        {/* Batterie */}
                        {e.evaluation?.battery && (
                          <span title={`Batterie : ${e.evaluation.battery}`} style={{ fontSize: '0.85rem' }}>
                            {battLabels[e.evaluation.battery] || ''}
                          </span>
                        )}
                        {/* Facture */}
                        {e.evaluation?.invoice === 'oui' && (
                          <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 999, background: '#dcfce7', color: '#15803d', fontWeight: 700 }}>Facture ✓</span>
                        )}
                        {/* Boutique / vendeur */}
                        {e.customer?.shop && (
                          <span style={{ fontSize: '0.75rem', color: theme.textMuted, marginLeft: 'auto' }}>🏪 {e.customer.shop}</span>
                        )}
                        {e.customer?.seller && (
                          <span style={{ fontSize: '0.75rem', color: theme.textMuted }}>👤 {e.customer.seller}</span>
                        )}
                        {/* Date */}
                        <span style={{ fontSize: '0.72rem', color: theme.textMuted, whiteSpace: 'nowrap', marginLeft: e.customer?.shop ? 0 : 'auto' }}>
                          {i === 0 && <strong style={{ color: theme.primary }}>↑ Dernière — </strong>}
                          {fmtDate(e.date)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* Header produit */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 18, borderRadius: 18, background: theme.surface, border: `1px solid ${theme.primary}15` }}>
          <div style={{ width: 96, height: 96, borderRadius: 14, background: `linear-gradient(135deg, ${theme.primaryLight} 0%, #fff 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {product.image ? <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} /> : <span style={{ fontSize: '2.2rem' }}>{brand?.logo}</span>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: theme.primary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{brand?.name}</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '4px 0', fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.01em' }}>{product.name}</h2>
            <div style={{ fontSize: '0.88rem', color: theme.textMuted }}>Renseignez les critères pour obtenir votre prix</div>
            {/* Lien vérification IMEI */}
            <a href="https://www.imei.info/fr/" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, fontSize: '0.78rem', fontWeight: 700, color: '#dc2626', textDecoration: 'none', padding: '4px 10px', borderRadius: 999, border: '1.5px solid #dc262620', background: '#fef2f2' }}>
              🔍 Vérifier si le téléphone n'est pas volé (IMEI)
            </a>
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
            {/* Boutons pour consulter le prix chez les concurrents (s'adaptent au modèle + capacité) */}
            {(() => {
              const q = encodeURIComponent(`${product.name}${selectedStorage ? ' ' + selectedStorage : ''}`);
              const sites = [
                { name: 'Back Market',    color: '#1D2D5C', url: `https://www.backmarket.fr/fr-fr/search?q=${q}` },
                { name: 'Easy Cash',      color: '#E2001A', url: `https://bons-plans.easycash.fr/telephonie` },
                { name: 'AsGoodAsNew',    color: '#2E7D32', url: `https://asgoodasnew.fr/` },
                { name: 'Google',         color: '#4285F4', url: `https://www.google.com/search?q=${q}+reconditionn%C3%A9+prix` },
              ];
              return (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: '0.78rem', color: theme.textMuted, fontWeight: 600, marginBottom: 6 }}>Consulter le prix en ligne (s'ouvre dans un nouvel onglet) :</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {sites.map(s => (
                      <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 13px', borderRadius: 10, border: `1.5px solid ${s.color}30`, background: '#fff', color: s.color, fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}>
                        <ExternalLink size={14} /> {s.name}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })()}
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
            {getConditions(pricing).map(opt => (
              <CriteriaBtn key={opt.key} theme={theme} selected={evaluation.condition === opt.key} onClick={() => setEvaluation({ ...evaluation, condition: opt.key })} label={opt.label} desc={opt.desc} />
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
                <div style={{ fontSize: '0.85rem', opacity: 0.9, fontWeight: 600 }}>Prix de rachat {boost > 0 && <span style={{ fontWeight: 700 }}>(boost +{boost} €)</span>}</div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {currentCalc.price + boost} €
                </div>
              </div>
              <button
                className="rc-btn"
                onClick={() => onValidate(boost)}
                style={{ padding: '14px 26px', borderRadius: 12, border: 'none', background: '#fff', color: theme.primaryDark, fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
              >
                Valider la reprise <ChevronRight size={18} />
              </button>
            </div>

            {/* Boost reprise — boutons pour ajouter un bonus avant validation */}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.25)' }}>
              <div style={{ fontSize: '0.85rem', opacity: 0.9, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={15} /> Boost reprise
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[5, 10, 20, 30].map((b) => {
                  const active = boost === b;
                  return (
                    <button
                      key={b}
                      className="rc-btn"
                      onClick={() => setBoost(active ? 0 : b)}
                      style={{
                        padding: '8px 16px', borderRadius: 999,
                        border: `2px solid ${active ? '#fff' : 'rgba(255,255,255,0.4)'}`,
                        background: active ? '#fff' : 'transparent',
                        color: active ? theme.primaryDark : '#fff',
                        fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      +{b} €
                    </button>
                  );
                })}
                {boost > 0 && (
                  <button
                    className="rc-btn"
                    onClick={() => setBoost(0)}
                    style={{ padding: '8px 14px', borderRadius: 999, border: 'none', background: 'transparent', color: '#fff', opacity: 0.85, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    ✕ Annuler
                  </button>
                )}
              </div>
            </div>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', opacity: 0.9, fontWeight: 600 }}>Prix de revente conseillé :</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif' }}>{currentCalc.resaleMin + boost} € – {currentCalc.resaleMax + boost} €</span>
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

// ================== CUSTOMER VIEW (saisie infos client avant validation) ==================
function CustomerView({ theme, customer, setCustomer, shops, sellers, onBack, onConfirm }) {
  const [errors, setErrors] = useState({});
  const [newShop, setNewShop] = useState('');
  const [newSeller, setNewSeller] = useState('');
  const upd = (k, v) => { setCustomer({ ...customer, [k]: v }); setErrors({ ...errors, [k]: false }); };

  const submit = () => {
    const errs = {};
    if (!customer.firstName.trim()) errs.firstName = true;
    if (!customer.lastName.trim()) errs.lastName = true;
    if (!customer.phone.trim()) errs.phone = true;
    if (!customer.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) errs.email = true;
    if (!customer.shop) errs.shop = true;
    if (!customer.seller) errs.seller = true;
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onConfirm();
  };

  const inputS = (err) => ({
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: `1.5px solid ${err ? '#dc2626' : theme.primary + '25'}`,
    background: '#fff', fontSize: '1rem', color: theme.text,
  });

  // Style beau select
  const selectS = (err) => ({
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: `1.5px solid ${err ? '#dc2626' : theme.primary + '30'}`,
    background: '#fff', fontSize: '1rem', color: customer.shop || customer.seller ? theme.text : theme.textMuted,
    appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
    paddingRight: 36,
  });

  return (
    <div className="rc-fade" style={{ maxWidth: 560, margin: '0 auto' }}>
      <button className="rc-btn" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: theme.textMuted, cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: 16 }}>
        <ArrowLeft size={16} /> Retour
      </button>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: theme.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <User size={26} style={{ color: theme.primary }} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, fontFamily: 'Manrope, sans-serif' }}>Informations de la reprise</h2>
        <p style={{ color: theme.textMuted, margin: '6px 0 0', fontSize: '0.9rem' }}>Tous les champs sont obligatoires pour finaliser l'offre.</p>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        {/* Section boutique + vendeur */}
        <div style={{ padding: 20, borderRadius: 16, background: `linear-gradient(135deg, ${theme.primaryLight} 0%, #ffffff 100%)`, border: `1.5px solid ${theme.primary}30` }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: theme.primaryDark, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            🏪 Magasin et vendeur
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {/* Boutique */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: 6, color: theme.text }}>
                🏪 Boutique *
              </label>
              <div style={{ position: 'relative' }}>
                <select value={customer.shop || ''} onChange={(e) => upd('shop', e.target.value)} style={{ ...selectS(errors.shop), color: customer.shop ? theme.text : '#94a3b8' }}>
                  <option value="" disabled>Choisir la boutique…</option>
                  {(shops || []).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {errors.shop && <span style={{ color: '#dc2626', fontSize: '0.78rem', fontWeight: 600 }}>Requis</span>}
            </div>
            {/* Vendeur */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: 6, color: theme.text }}>
                👤 Vendeur *
              </label>
              <div style={{ position: 'relative' }}>
                <select value={customer.seller || ''} onChange={(e) => upd('seller', e.target.value)} style={{ ...selectS(errors.seller), color: customer.seller ? theme.text : '#94a3b8' }}>
                  <option value="" disabled>Choisir le vendeur…</option>
                  {(sellers || []).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {errors.seller && <span style={{ color: '#dc2626', fontSize: '0.78rem', fontWeight: 600 }}>Requis</span>}
            </div>
          </div>
        </div>

        {/* Section client */}
        <div style={{ padding: 20, borderRadius: 16, background: '#fff', border: `1px solid ${theme.primary}15` }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: theme.primaryDark, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            👤 Coordonnées du client
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>Prénom *</label>
                <input value={customer.firstName} onChange={(e) => upd('firstName', e.target.value)} className="rc-input" style={inputS(errors.firstName)} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: 6 }}>Nom *</label>
                <input value={customer.lastName} onChange={(e) => upd('lastName', e.target.value)} className="rc-input" style={inputS(errors.lastName)} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: 6 }}><Phone size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Téléphone *</label>
              <input value={customer.phone} onChange={(e) => upd('phone', e.target.value)} placeholder="06 12 34 56 78" className="rc-input" style={inputS(errors.phone)} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: 6 }}><Mail size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Email *</label>
              <input value={customer.email} onChange={(e) => upd('email', e.target.value)} type="email" placeholder="client@exemple.fr" className="rc-input" style={inputS(errors.email)} />
            </div>
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: 0, fontWeight: 600, textAlign: 'center' }}>Merci de remplir correctement tous les champs.</p>
        )}
        <button className="rc-btn" onClick={submit} style={{ padding: '14px', borderRadius: 12, border: 'none', background: theme.primary, color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Confirmer et générer la fiche <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ================== FICHE A4 : Impression + Téléchargement PDF (fenêtre dédiée) ==================
// Ouvre une nouvelle fenêtre avec la fiche A4 finalisée. L'utilisateur a 2 choix :
//   • Bouton "Imprimer" → window.print() (avec petit délai pour fiabilité)
//   • Bouton "Télécharger PDF" → html2pdf.js chargé depuis CDN, génère et télécharge le PDF
// Le téléchargement PDF est la solution la plus fiable sur Windows Chrome.
function printInvoiceSheet({ theme, product, brand, storage, calc, evaluation, customer, date, pricing }) {
  const conds = getConditions(pricing);
  const condMap = Object.fromEntries(conds.map(c => [c.key, c.label]));
  const battLabels = { 'fonctionnelle': 'Fonctionnelle', 'a-remplacer': 'À remplacer', 'non-fonctionnelle': 'Non fonctionnelle' };
  const ref = date ? new Date(date) : new Date();
  const validUntil = new Date(ref.getTime() + 15 * 24 * 3600 * 1000);
  const fmt = (d) => d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const esc = (s) => String(s ?? '').replace(/[&<>"\']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const primary = theme?.primary || '#00B8D4';
  const primaryDark = theme?.primaryDark || '#007a8c';
  const primaryLight = theme?.primaryLight || '#e0f7fa';
  const logoSrc = theme?.printLogoUrl && theme.printLogoUrl.trim() ? theme.printLogoUrl.trim() : LOGO_DATA_URL;
  const cleanName = (customer?.lastName + '_' + customer?.firstName).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40) || 'client';
  const filename = `fiche-reprise_${cleanName}_${fmt(ref).replace(/\//g, '-')}.pdf`;

  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Fiche de reprise - ${esc(customer?.lastName || '')} ${esc(customer?.firstName || '')}</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #eef2f5; font-family: -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color: #1a2235; }

  .toolbar { position: sticky; top: 0; background: #fff; border-bottom: 1px solid #e2e8f0; padding: 14px 24px; display: flex; gap: 10px; justify-content: center; align-items: center; z-index: 100; box-shadow: 0 1px 4px rgba(0,0,0,0.04); flex-wrap: wrap; }
  .toolbar button { padding: 10px 22px; border-radius: 10px; border: none; font-weight: 700; font-size: 0.95rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-family: inherit; }
  .toolbar button:disabled { opacity: 0.5; cursor: wait; }
  .btn-pdf { background: ${primary}; color: #fff; }
  .btn-pdf:hover:not(:disabled) { background: ${primaryDark}; }
  .btn-print { background: #fff; color: ${primaryDark}; border: 1.5px solid ${primary}; }
  .btn-print:hover:not(:disabled) { background: ${primaryLight}; }
  .btn-close { background: #fff; color: #64748b; border: 1.5px solid #e2e8f0; }

  .page-wrap { display: flex; justify-content: center; padding: 28px 20px; }
  .sheet { width: 210mm; max-width: 100%; background: #fff; padding: 18mm 18mm; box-shadow: 0 6px 24px rgba(0,0,0,0.08); border-radius: 4px; }

  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid ${primary}; padding-bottom: 14px; margin-bottom: 22px; }
  .header .logo { height: 56px; width: auto; max-width: 280px; object-fit: contain; }
  .header .right { text-align: right; }
  .header .right .title-line { font-size: 14pt; font-weight: 700; color: ${primaryDark}; margin-bottom: 4px; }
  .header .right .dates { font-size: 10pt; color: #475569; line-height: 1.5; }
  .header .right .dates strong { color: #1a2235; }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 18px; }
  .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; }
  .card h3 { font-size: 9.5pt; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 0.08em; color: ${primaryDark}; font-weight: 800; }
  .card table { width: 100%; border-collapse: collapse; font-size: 10.5pt; }
  .card td { padding: 4px 0; vertical-align: top; }
  .card td.lbl { color: #64748b; width: 45%; }
  .card td.val { font-weight: 600; color: #1a2235; }

  .price-box { padding: 22px 18px; background: ${primaryLight}; border: 2.5px solid ${primary}; border-radius: 14px; text-align: center; margin-bottom: 18px; }
  .price-box .lbl { font-size: 10pt; font-weight: 700; color: ${primaryDark}; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
  .price-box .amt { font-size: 38pt; font-weight: 800; color: ${primaryDark}; line-height: 1; letter-spacing: -0.02em; }
  .price-box .sub { font-size: 10pt; color: #475569; margin-top: 6px; }

  .validity { padding: 12px 16px; background: #fff7ed; border: 1.5px solid #fdba74; border-radius: 10px; font-size: 10.5pt; text-align: center; margin-bottom: 22px; color: #9a3412; font-weight: 600; }

  .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 32px; }
  .signatures .col { text-align: center; }
  .signatures .col .label { color: #64748b; font-size: 10pt; margin-bottom: 56px; font-weight: 600; }
  .signatures .col .line { border-top: 1.5px solid #94a3b8; margin: 0 12px; }

  .footer { margin-top: 22px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 8.5pt; color: #94a3b8; text-align: center; }

  @media print {
    @page { size: A4; margin: 10mm; }
    html, body { background: #fff !important; }
    .toolbar { display: none !important; }
    .page-wrap { padding: 0 !important; }
    .sheet { box-shadow: none !important; border-radius: 0 !important; padding: 0 !important; width: auto !important; }
    .card, .price-box, .validity, .signatures { break-inside: avoid; }
  }
</style></head>
<body>
  <div class="toolbar">
    <button class="btn-pdf" id="btnPdf" onclick="downloadPdf()">📄 Télécharger en PDF</button>
    <button class="btn-print" id="btnPrint" onclick="doPrint()">🖨 Imprimer</button>
    <button class="btn-close" onclick="window.close()">Fermer</button>
  </div>

  <div class="page-wrap">
    <div class="sheet" id="sheet">
      <div class="header">
        <img class="logo" id="logoImg" src="${logoSrc}" alt="Logo" crossorigin="anonymous" />
        <div class="right">
          <div class="title-line">Offre de rachat</div>
          <div class="dates">
            <div><strong>Émise le :</strong> ${fmt(ref)}</div>
            <div><strong>Valable jusqu'au :</strong> ${fmt(validUntil)}</div>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <h3>Informations client</h3>
          <table><tbody>
            <tr><td class="lbl">Prénom</td><td class="val">${esc(customer?.firstName)}</td></tr>
            <tr><td class="lbl">Nom</td><td class="val">${esc(customer?.lastName)}</td></tr>
            <tr><td class="lbl">Téléphone</td><td class="val">${esc(customer?.phone)}</td></tr>
            <tr><td class="lbl">Email</td><td class="val">${esc(customer?.email)}</td></tr>
            ${customer?.shop ? `<tr><td class="lbl">Boutique</td><td class="val">${esc(customer.shop)}</td></tr>` : ''}
            ${customer?.seller ? `<tr><td class="lbl">Vendeur</td><td class="val">${esc(customer.seller)}</td></tr>` : ''}
          </tbody></table>
        </div>

        <div class="card">
          <h3>Appareil repris</h3>
          <table><tbody>
            <tr><td class="lbl">Marque</td><td class="val">${esc(brand?.name || '')}</td></tr>
            <tr><td class="lbl">Modèle</td><td class="val">${esc(product?.name)}</td></tr>
            <tr><td class="lbl">Capacité</td><td class="val">${esc(storage)}</td></tr>
            <tr><td class="lbl">État général</td><td class="val">${esc(condMap[evaluation?.condition] || '—')}</td></tr>
            <tr><td class="lbl">Batterie</td><td class="val">${esc(battLabels[evaluation?.battery] || '—')}</td></tr>
            <tr><td class="lbl">Caméra</td><td class="val">${esc(battLabels[evaluation?.camera] || '—')}</td></tr>
            <tr><td class="lbl">Facture &lt; 2 ans</td><td class="val">${evaluation?.invoice === 'oui' ? 'Oui' : 'Non'}</td></tr>
          </tbody></table>
        </div>
      </div>

      <div class="price-box">
        <div class="lbl">Montant proposé pour la reprise</div>
        <div class="amt">${esc(calc?.price)} €</div>
        <div class="sub">Net à verser au client lors de la finalisation de la reprise</div>
      </div>

      <div class="validity">
        ⚠ Cette offre de rachat est valable uniquement <strong>15 jours</strong>, jusqu'au <strong>${fmt(validUntil)}</strong>.
      </div>

      <div class="signatures">
        <div class="col">
          <div class="label">Signature du client<br/><span style="font-weight: 400; font-size: 9pt;">(précédée de "Bon pour accord")</span></div>
          <div class="line"></div>
        </div>
        <div class="col">
          <div class="label">Cachet et signature<br/><span style="font-weight: 400; font-size: 9pt;">du magasin</span></div>
          <div class="line"></div>
        </div>
      </div>

      <div class="footer">
        Document généré par Care Reprise — Offre indicative sous réserve de vérification de l'appareil au moment de la reprise.
      </div>
    </div>
  </div>

  <script>
    function doPrint() {
      setTimeout(function(){ window.print(); }, 150);
    }
    function downloadPdf() {
      var btn = document.getElementById('btnPdf');
      btn.disabled = true;
      btn.textContent = '⏳ Génération du PDF...';
      var sheet = document.getElementById('sheet');
      var opt = {
        margin: [10, 10, 10, 10],
        filename: '${filename}',
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
      };
      if (typeof html2pdf === 'undefined') {
        alert('La bibliothèque PDF est en cours de chargement. Réessayez dans quelques secondes.');
        btn.disabled = false; btn.textContent = '📄 Télécharger en PDF';
        return;
      }
      html2pdf().from(sheet).set(opt).save().then(function(){
        btn.disabled = false;
        btn.textContent = '📄 Télécharger en PDF';
      }).catch(function(err){
        console.error(err);
        alert('Erreur lors de la génération du PDF. Essayez le bouton Imprimer.');
        btn.disabled = false;
        btn.textContent = '📄 Télécharger en PDF';
      });
    }
  </script>
</body></html>`;

  const w = window.open('', '_blank', 'width=920,height=1000');
  if (!w) { alert("La fenêtre a été bloquée par votre navigateur. Autorisez les pop-ups pour ce site puis réessayez."); return; }
  w.document.open(); w.document.write(html); w.document.close();
}

// ================== RESULT VIEW (aperçu écran + bouton imprimer) ==================
function ResultView({ theme, product, storage, calc, evaluation, customer, brand, pricing, onRestart }) {
  const condMap = Object.fromEntries(getConditions(pricing).map(c => [c.key, c.label]));
  const battLabels = { 'fonctionnelle': 'Fonctionnelle', 'a-remplacer': 'À remplacer', 'non-fonctionnelle': 'Non fonctionnelle' };
  const today = new Date();
  const validUntil = new Date(today.getTime() + 15 * 24 * 3600 * 1000);
  const fmt = (d) => d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const handlePrint = () => printInvoiceSheet({ theme, product, brand, storage, calc, evaluation, customer, pricing });

  return (
    <div className="rc-fade" style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: theme.success + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <Check size={32} style={{ color: theme.success }} strokeWidth={3} />
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, fontFamily: 'Manrope, sans-serif' }}>Reprise validée</h2>
        <p style={{ color: theme.textMuted, margin: '6px 0 0' }}>Imprimez la fiche pour la remettre au client.</p>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <button className="rc-btn" onClick={handlePrint} style={{ flex: 1, minWidth: 200, padding: '14px', borderRadius: 12, border: 'none', background: theme.primary, color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Printer size={18} /> Imprimer la fiche A4
        </button>
        <button className="rc-btn" onClick={onRestart} style={{ flex: 1, minWidth: 200, padding: '14px', borderRadius: 12, border: `1.5px solid ${theme.primary}`, background: '#fff', color: theme.primary, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
          Nouvelle estimation
        </button>
      </div>

      {/* Aperçu écran (ce que contient la fiche imprimée) */}
      <div style={{ background: '#fff', padding: 28, borderRadius: 16, border: `1px solid ${theme.primary}15`, color: '#000', fontFamily: theme.fontFamily }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${theme.primary}`, paddingBottom: 14, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: theme.primaryDark, fontFamily: 'Manrope, sans-serif' }}>{theme.siteName || 'Care Reprise'}</div>
            <div style={{ fontSize: '0.85rem', color: '#555' }}>Offre de rachat de smartphone</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
            <div><strong>Date :</strong> {fmt(today)}</div>
            <div><strong>Valable jusqu'au :</strong> {fmt(validUntil)}</div>
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.primaryDark }}>Client</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <tbody>
              <tr><td style={{ padding: '5px 0', color: '#555', width: 140 }}>Nom et prénom</td><td style={{ fontWeight: 600 }}>{customer?.firstName} {customer?.lastName}</td></tr>
              <tr><td style={{ padding: '5px 0', color: '#555' }}>Téléphone</td><td style={{ fontWeight: 600 }}>{customer?.phone}</td></tr>
              <tr><td style={{ padding: '5px 0', color: '#555' }}>Email</td><td style={{ fontWeight: 600 }}>{customer?.email}</td></tr>
            </tbody>
          </table>
        </div>
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.primaryDark }}>Récapitulatif de l'évaluation</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <tbody>
              <tr><td style={{ padding: '5px 0', color: '#555', width: 180 }}>Marque</td><td style={{ fontWeight: 600 }}>{brand?.name || ''}</td></tr>
              <tr><td style={{ padding: '5px 0', color: '#555' }}>Modèle</td><td style={{ fontWeight: 600 }}>{product.name} ({storage})</td></tr>
              <tr><td style={{ padding: '5px 0', color: '#555' }}>État général</td><td style={{ fontWeight: 600 }}>{condMap[evaluation.condition] || "—"}</td></tr>
              <tr><td style={{ padding: '5px 0', color: '#555' }}>Batterie</td><td style={{ fontWeight: 600 }}>{battLabels[evaluation.battery]}</td></tr>
              <tr><td style={{ padding: '5px 0', color: '#555' }}>Caméra</td><td style={{ fontWeight: 600 }}>{battLabels[evaluation.camera]}</td></tr>
              <tr><td style={{ padding: '5px 0', color: '#555' }}>Facture {'<'} 2 ans</td><td style={{ fontWeight: 600 }}>{evaluation.invoice === 'oui' ? 'Oui' : 'Non'}</td></tr>
            </tbody>
          </table>
        </div>
        <div style={{ padding: 18, background: theme.primaryLight, border: `2px solid ${theme.primary}`, borderRadius: 12, textAlign: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: theme.primaryDark, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Montant proposé pour la reprise</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: theme.primaryDark, fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: 4 }}>{calc.price} €</div>
        </div>
        <div style={{ padding: 12, background: '#fff7ed', border: '1.5px solid #fdba74', borderRadius: 8, fontSize: '0.88rem', textAlign: 'center', color: '#9a3412', fontWeight: 600 }}>
          ⚠ Cette offre de rachat est valable uniquement <strong>15 jours</strong>, soit jusqu'au <strong>{fmt(validUntil)}</strong>.
        </div>
      </div>
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

// ================== INFO VIEW (informations reprise mobile) ==================
function InfoView({ theme }) {
  const Card = ({ icon, title, color, children }) => (
    <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${color}20`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{icon}</div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, fontFamily: 'Manrope, sans-serif', color: '#1a2235' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
  const Item = ({ icon, title, desc, color = theme.primary }) => (
    <div style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ fontSize: '1.3rem', flexShrink: 0, marginTop: 2 }}>{icon}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a2235', marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );

  return (
    <div className="rc-fade" style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Héro */}
      <div style={{ borderRadius: 20, background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`, padding: '32px 28px', marginBottom: 24, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: -20, fontSize: '8rem', opacity: 0.08, lineHeight: 1 }}>📱</div>
        <div style={{ fontSize: '2rem', marginBottom: 8 }}>📋</div>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, margin: '0 0 8px', fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}>Informations sur la reprise mobile</h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem', lineHeight: 1.5 }}>
          Tout ce que vous devez savoir pour vendre votre téléphone en toute sérénité et légalité.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>

        {/* Documents obligatoires */}
        <Card icon="🪪" title="Documents obligatoires à apporter" color={theme.primary}>
          <Item
            icon="🪪"
            title="Pièce d'identité en cours de validité"
            desc="Carte nationale d'identité ou passeport obligatoire. Requis par la loi pour toute transaction de rachat (obligation de registre de police). Sans pièce d'identité, aucune reprise ne peut être effectuée."
          />
          <Item
            icon="🧾"
            title="Facture d'achat (téléphones de moins de 2 ans)"
            desc="Si votre téléphone a été acheté il y a moins de 2 ans, la facture d'achat originale est indispensable. Voir explication détaillée ci-dessous."
          />
          <Item
            icon="🏦"
            title="RIB (Relevé d'Identité Bancaire)"
            desc="Nécessaire pour le versement du montant de la reprise par virement bancaire sécurisé. Le paiement en espèces reste possible selon les montants et la réglementation en vigueur."
          />
        </Card>

        {/* Pourquoi la facture */}
        <Card icon="⚠️" title="Pourquoi la facture est obligatoire pour les téléphones de moins de 2 ans" color="#f59e0b">
          <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <p style={{ margin: '0 0 10px', fontSize: '0.9rem', lineHeight: 1.6, color: '#92400e', fontWeight: 600 }}>
              ⚠️ Un téléphone acheté sous contrat opérateur n'appartient pas encore pleinement à son porteur.
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.6, color: '#78350f' }}>
              Lorsqu'un téléphone est acquis dans le cadre d'un abonnement avec engagement (24 mois), une partie du prix est subventionnée par l'opérateur. Si les mensualités ne sont pas toutes réglées, l'appareil peut techniquement être considéré comme n'appartenant pas totalement au client.
            </p>
          </div>
          <Item
            icon="🔒"
            title="Risque de blocage par l'opérateur"
            desc="Un téléphone encore sous contrat peut être bloqué à distance par l'opérateur (via l'IMEI) en cas d'impayés ou de litige. Cela rendrait l'appareil inutilisable après la reprise, causant un préjudice au magasin."
          />
          <Item
            icon="⚖️"
            title="Protection juridique du magasin et du client"
            desc="La facture prouve que l'appareil a bien été acheté par la personne qui le vend et qu'il est libre de tout engagement contractuel en cours. Sans cette preuve, la reprise engage la responsabilité des deux parties."
          />
          <Item
            icon="📱"
            title="Comment savoir si votre téléphone est encore sous contrat ?"
            desc="Vérifiez votre contrat opérateur ou contactez votre service client. Si vous payez encore des mensualités pour votre téléphone, il est probablement encore sous engagement. Attendez la fin du contrat avant de procéder à la reprise."
          />
        </Card>

        {/* Cadre légal */}
        <Card icon="⚖️" title="Cadre légal de la reprise de téléphones" color="#8b5cf6">
          <Item
            icon="📜"
            title="Obligation de registre de police (Art. L321-7 Code de commerce)"
            desc="Tout professionnel achetant des objets d'occasion à des particuliers doit tenir un registre de police. Chaque transaction est enregistrée avec l'identité du vendeur et les caractéristiques de l'appareil (IMEI inclus). Ce registre est transmis aux autorités et conservé 5 ans minimum."
          />
          <Item
            icon="🚫"
            title="Recel d'objet volé (Art. 321-1 Code pénal)"
            desc="Acheter ou détenir un bien dont on sait ou aurait dû savoir qu'il est le produit d'un crime ou délit est punissable de 5 ans d'emprisonnement et 375 000 € d'amende. Vérifier l'IMEI et demander les documents est une protection légale essentielle."
          />
          <Item
            icon="🔍"
            title="Vérification IMEI obligatoire"
            desc="L'IMEI (numéro unique à 15 chiffres) permet de vérifier si un téléphone est déclaré volé ou perdu. Les professionnels de la reprise ont l'obligation morale et pratique de vérifier ce statut avant toute transaction."
          />
          <Item
            icon="👤"
            title="Âge minimum du vendeur"
            desc="Le vendeur doit être majeur (18 ans) ou accompagné d'un représentant légal. Une pièce d'identité valide est systématiquement exigée et copiée dans le registre de police."
          />
        </Card>

        {/* Vérification IMEI */}
        <Card icon="🔍" title="Vérifier l'IMEI avant la reprise" color="#dc2626">
          <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <p style={{ margin: '0 0 8px', fontSize: '0.9rem', fontWeight: 700, color: '#991b1b' }}>
              🔍 Comment trouver l'IMEI d'un téléphone ?
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#7f1d1d', lineHeight: 1.6 }}>
              Composez <strong>*#06#</strong> sur le clavier du téléphone, ou accédez à <strong>Paramètres → À propos du téléphone</strong>. L'IMEI est un numéro unique de 15 chiffres.
            </p>
          </div>
          <Item
            icon="✅"
            title="Site de vérification recommandé : imei.info"
            desc="Service 100% gratuit, base de données mondiale (110+ millions d'IMEI), toutes marques compatibles. Vérifie le statut blacklist (volé/perdu), le simlock, la garantie constructeur et l'authenticité de l'appareil."
          />
          <div style={{ marginTop: 12 }}>
            <a href="https://www.imei.info/fr/" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, background: '#dc2626', color: '#fff', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}>
              🔍 Vérifier un IMEI maintenant sur imei.info
              <ExternalLink size={15} />
            </a>
          </div>
        </Card>

        {/* Bon à savoir */}
        <Card icon="💡" title="Bon à savoir" color="#10b981">
          <Item
            icon="💰"
            title="Le prix de reprise est indicatif"
            desc="L'offre affichée sur ce site est basée sur les prix du marché du reconditionné. Elle peut être ajustée après vérification physique de l'appareil en magasin (rayures non déclarées, batterie dégradée, accessoires manquants…)."
          />
          <Item
            icon="📅"
            title="Validité de l'offre : 15 jours"
            desc="L'offre de reprise générée est valable 15 jours à compter de la date d'estimation. Passé ce délai, une nouvelle évaluation sera nécessaire car les prix du marché évoluent."
          />
          <Item
            icon="🔄"
            title="État de l'appareil au moment de la reprise"
            desc="L'état déclaré lors de l'estimation en ligne sera vérifié en magasin. Toute différence (écran fissuré non déclaré, caméra défectueuse…) entraînera une révision du prix."
          />
          <Item
            icon="🌱"
            title="Économie circulaire et impact environnemental"
            desc="En reprenant votre téléphone, vous contribuez à réduire les déchets électroniques. Un smartphone reconditionné génère 87% d'émissions de CO₂ en moins qu'un appareil neuf. Merci pour votre geste éco-responsable."
          />
        </Card>

      </div>
    </div>
  );
}

// ================== HISTORY LOGIN (code séparé 0852) ==================
function HistoryLogin({ theme, onUnlock }) {
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(false);
  const tryUnlock = () => {
    if (pwd === HISTORY_PASSWORD) { setError(false); onUnlock(); }
    else { setError(true); }
  };
  return (
    <div className="rc-fade" style={{ maxWidth: 420, margin: '40px auto', padding: 28, borderRadius: 20, background: '#fff', border: `1px solid ${theme.primary}15`, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: theme.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <History size={26} style={{ color: theme.primary }} />
      </div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 6px', fontFamily: 'Manrope, sans-serif' }}>Historique des estimations</h2>
      <p style={{ color: theme.textMuted, fontSize: '0.9rem', margin: '0 0 20px' }}>Entrez le code d'accès à l'historique.</p>
      <input
        type="password"
        value={pwd}
        onChange={(e) => { setPwd(e.target.value); setError(false); }}
        onKeyDown={(e) => { if (e.key === 'Enter') tryUnlock(); }}
        placeholder="Code"
        autoFocus
        className="rc-input"
        style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${error ? '#dc2626' : theme.primary + '30'}`, background: theme.surface, fontSize: '1rem', color: theme.text, marginBottom: 12, textAlign: 'center' }}
      />
      {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: '0 0 12px', fontWeight: 600 }}>Code incorrect</p>}
      <button className="rc-btn" onClick={tryUnlock} style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: theme.primary, color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
        Déverrouiller
      </button>
    </div>
  );
}

// ================== HISTORY VIEW (liste des estimations + recherche + réimpression) ==================
function HistoryView({ theme, history, setHistory, products, brands, pricing, shops, onLock }) {
  const [q, setQ] = useState('');
  const [filterShop, setFilterShop] = useState('');
  const query = q.trim().toLowerCase();

  const sorted = [...history].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const filtered = sorted.filter(e => {
    if (filterShop && e.customer?.shop !== filterShop) return false;
    if (!query) return true;
    const c = e.customer || {};
    const hay = [c.firstName, c.lastName, c.phone, c.email, e.product?.name, c.shop, c.seller].filter(Boolean).join(' ').toLowerCase();
    return hay.includes(query);
  });

  const condLabels = Object.fromEntries(getConditions(pricing).map(c => [c.key, c.label]));
  const fmtDate = (iso) => { try { const d = new Date(iso); return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); } catch (e) { return iso; } };

  const deleteEntry = (id) => { if (window.confirm('Supprimer cette estimation de l\'historique ?')) setHistory(history.filter(e => e.id !== id)); };

  // Réimprimer une fiche depuis l'historique : reconstitue les données et ouvre la fenêtre d'impression
  const reprint = (e) => {
    const prod = (products || []).find(p => p.id === e.product?.id) || { name: e.product?.name };
    const br = (brands || []).find(b => b.id === e.product?.brand) || { name: e.product?.brand };
    printInvoiceSheet({
      theme,
      product: prod,
      brand: br,
      storage: e.storage,
      calc: e.calc,
      evaluation: e.evaluation,
      customer: e.customer,
      date: e.date, // la fiche garde la date d'origine + validité de 15j à partir de là
      pricing,
    });
  };

  return (
    <div className="rc-fade">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <History size={26} style={{ color: theme.primary }} />
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, fontFamily: 'Manrope, sans-serif' }}>Historique des estimations</h2>
        <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: theme.textMuted, fontWeight: 600 }}>{history.length} estimation{history.length > 1 ? 's' : ''}</span>
        <button className="rc-btn" onClick={onLock} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${theme.primary}25`, background: '#fff', color: theme.textMuted, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
          <Lock size={15} /> Verrouiller
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
        {/* Filtre par boutique */}
        <div style={{ position: 'relative', minWidth: 180 }}>
          <select
            value={filterShop}
            onChange={(e) => setFilterShop(e.target.value)}
            style={{ width: '100%', padding: '11px 36px 11px 14px', borderRadius: 10, border: `1.5px solid ${theme.primary}25`, background: '#fff', fontSize: '0.92rem', color: filterShop ? theme.text : theme.textMuted, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
          >
            <option value="">🏪 Toutes les boutiques</option>
            {(shops || []).map(s => <option key={s} value={s}>🏪 {s}</option>)}
          </select>
        </div>
        {/* Recherche texte */}
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: theme.textMuted }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nom, téléphone, email, modèle, vendeur..."
            className="rc-input"
            style={{ width: '100%', padding: '11px 14px 11px 38px', borderRadius: 10, border: `1.5px solid ${theme.primary}25`, background: '#fff', fontSize: '0.92rem', color: theme.text }}
          />
        </div>
        {(filterShop || q) && (
          <button onClick={() => { setFilterShop(''); setQ(''); }} className="rc-btn"
            style={{ padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${theme.primary}20`, background: '#fff', color: theme.textMuted, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            ✕ Effacer
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: theme.textMuted, background: '#fff', borderRadius: 12, border: `1px dashed ${theme.primary}20` }}>
          {history.length === 0 ? 'Aucune estimation enregistrée pour le moment.' : 'Aucun résultat pour votre recherche.'}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {filtered.map((e) => {
            const c = e.customer || {};
            return (
              <div key={e.id} style={{ padding: 14, borderRadius: 12, background: '#fff', border: `1px solid ${theme.primary}15`, display: 'grid', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif' }}>{c.firstName} {c.lastName}</div>
                    <div style={{ fontSize: '0.82rem', color: theme.textMuted }}>{fmtDate(e.date)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.primaryDark, fontFamily: 'Manrope, sans-serif', lineHeight: 1 }}>{e.calc?.price} €</div>
                    <div style={{ fontSize: '0.78rem', color: theme.textMuted, marginTop: 2 }}>prix de rachat</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: '0.85rem', color: theme.text, paddingTop: 6, borderTop: '1px solid #f1f5f9' }}>
                  <span><strong>{e.product?.name}</strong> ({e.storage})</span>
                  <span style={{ color: theme.textMuted }}>État : {condLabels[e.evaluation?.condition] || '—'}</span>
                  {c.shop && <span style={{ color: theme.primary, fontWeight: 700, background: theme.primaryLight, padding: '2px 8px', borderRadius: 999, fontSize: '0.78rem' }}>🏪 {c.shop}</span>}
                  {c.seller && <span style={{ color: theme.primaryDark, fontWeight: 600 }}>👤 {c.seller}</span>}
                  {c.phone && <span style={{ color: theme.textMuted }}><Phone size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />{c.phone}</span>}
                  {c.email && <span style={{ color: theme.textMuted }}><Mail size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />{c.email}</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button className="rc-btn" onClick={() => reprint(e)} title="Réimprimer" style={{ padding: '6px 12px', borderRadius: 8, border: `1.5px solid ${theme.primary}30`, background: '#fff', color: theme.primary, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Printer size={13} /> Réimprimer
                  </button>
                  <button className="rc-btn" onClick={() => deleteEntry(e.id)} title="Supprimer" style={{ padding: '4px 8px', borderRadius: 8, border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Trash2 size={13} /> Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ================== DASHBOARD LOGIN (protection par mot de passe) ==================
function DashboardLogin({ theme, onUnlock }) {
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(false);

  const tryUnlock = () => {
    const expected = theme.dashboardPassword || DASHBOARD_PASSWORD;
    if (pwd === expected) { setError(false); onUnlock(); }
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
function Dashboard({ theme, setTheme, brands, setBrands, products, setProducts, pricing, setPricing, shops, setShops, sellers, setSellers, onLock }) {
  const [tab, setTab] = useState('appearance');

  const tabs = [
    { id: 'appearance', label: 'Apparence', icon: <Palette size={16} /> },
    { id: 'typography', label: 'Typographie', icon: <Type size={16} /> },
    { id: 'products', label: 'Produits', icon: <Smartphone size={16} /> },
    { id: 'pricing', label: 'Formule de rachat', icon: <Settings size={16} /> },
    { id: 'brands', label: 'Marques', icon: <Sparkles size={16} /> },
    { id: 'team', label: 'Boutiques & Équipe', icon: <User size={16} /> },
    { id: 'settings', label: 'Réglages', icon: <Lock size={16} /> },
  ];

  return (
    <div className="rc-fade">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <LayoutDashboard size={26} style={{ color: theme.primary }} />
        <h2 style={{ fontSize: '1.7rem', fontWeight: 800, margin: 0, fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}>Tableau de bord</h2>
        <span style={{ marginLeft: 'auto', fontSize: '0.74rem', fontWeight: 700, padding: '5px 12px', borderRadius: 999, color: firebaseReady ? '#0f766e' : '#b45309', background: firebaseReady ? '#ccfbf1' : '#fef3c7' }}>
          {firebaseReady ? '● Données partagées en ligne' : '● Mode local (Firebase non configuré)'}
        </span>
        <button className="rc-btn" onClick={onLock} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${theme.primary}25`, background: '#fff', color: theme.textMuted, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
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
        {tab === 'team' && <TeamTab theme={theme} shops={shops} setShops={setShops} sellers={sellers} setSellers={setSellers} />}
        {tab === 'settings' && <SettingsTab theme={theme} setTheme={setTheme} />}
      </div>
    </div>
  );
}

// --- Boutiques & Équipe ---
function TeamTab({ theme, shops, setShops, sellers, setSellers }) {
  const [newShop, setNewShop] = useState('');
  const [newSeller, setNewSeller] = useState('');

  const addShop = () => {
    const v = newShop.trim();
    if (!v || shops.includes(v)) { setNewShop(''); return; }
    setShops([...shops, v]);
    setNewShop('');
  };
  const removeShop = (s) => { if (window.confirm(`Supprimer la boutique "${s}" ?`)) setShops(shops.filter(x => x !== s)); };

  const addSeller = () => {
    const v = newSeller.trim();
    if (!v || sellers.includes(v)) { setNewSeller(''); return; }
    setSellers([...sellers, v]);
    setNewSeller('');
  };
  const removeSeller = (s) => { if (window.confirm(`Supprimer le vendeur "${s}" ?`)) setSellers(sellers.filter(x => x !== s)); };

  const ListItem = ({ value, onRemove }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, background: theme.surface, border: `1px solid ${theme.primary}10` }}>
      <span style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem' }}>{value}</span>
      <button onClick={onRemove} className="rc-btn" title="Supprimer" style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
        <Trash2 size={13} />
      </button>
    </div>
  );

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* Boutiques */}
      <Card theme={theme} title="🏪 Boutiques">
        <p style={{ fontSize: '0.85rem', color: theme.textMuted, margin: '0 0 14px' }}>
          Les boutiques disponibles dans le menu déroulant lors de la validation d'une reprise.
        </p>
        <div style={{ display: 'grid', gap: 8, marginBottom: 14 }}>
          {shops.map(s => <ListItem key={s} value={s} onRemove={() => removeShop(s)} />)}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={newShop}
            onChange={(e) => setNewShop(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addShop(); } }}
            placeholder="Nom de la nouvelle boutique…"
            className="rc-input"
            style={{ ...inputStyle(theme), flex: 1 }}
          />
          <button onClick={addShop} className="rc-btn" style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: theme.primary, color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            <Plus size={15} /> Ajouter
          </button>
        </div>
      </Card>

      {/* Vendeurs */}
      <Card theme={theme} title="👤 Vendeurs">
        <p style={{ fontSize: '0.85rem', color: theme.textMuted, margin: '0 0 14px' }}>
          Les vendeurs disponibles dans le menu déroulant lors de la validation d'une reprise.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8, marginBottom: 14 }}>
          {sellers.map(s => <ListItem key={s} value={s} onRemove={() => removeSeller(s)} />)}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={newSeller}
            onChange={(e) => setNewSeller(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSeller(); } }}
            placeholder="Prénom du vendeur…"
            className="rc-input"
            style={{ ...inputStyle(theme), flex: 1 }}
          />
          <button onClick={addSeller} className="rc-btn" style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: theme.primary, color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            <Plus size={15} /> Ajouter
          </button>
        </div>
      </Card>
    </div>
  );
}

// --- Réglages (nom du site + mot de passe) ---
function SettingsTab({ theme, setTheme }) {
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const savePassword = () => {
    if (newPwd.length < 4) { setError('Le mot de passe doit faire au moins 4 caractères.'); return; }
    if (newPwd !== confirmPwd) { setError('Les deux mots de passe ne correspondent pas.'); return; }
    setTheme({ ...theme, dashboardPassword: newPwd });
    setError(''); setSaved(true);
    setNewPwd(''); setConfirmPwd('');
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card theme={theme} title="Nom du site">
        <Field label="Nom affiché dans l'en-tête et le pied de page">
          <input className="rc-input" type="text" value={theme.siteName} onChange={(e) => setTheme({ ...theme, siteName: e.target.value })} style={inputStyle(theme)} />
        </Field>
      </Card>

      <Card theme={theme} title="Mot de passe du tableau de bord">
        <p style={{ fontSize: '0.85rem', color: theme.textMuted, margin: '0 0 14px' }}>
          Ce mot de passe protège l'accès au tableau de bord. Choisissez-en un nouveau ci-dessous.
        </p>
        <Field label="Nouveau mot de passe">
          <input className="rc-input" type="password" value={newPwd} onChange={(e) => { setNewPwd(e.target.value); setError(''); }} placeholder="Nouveau mot de passe" style={inputStyle(theme)} />
        </Field>
        <Field label="Confirmer le nouveau mot de passe">
          <input className="rc-input" type="password" value={confirmPwd} onChange={(e) => { setConfirmPwd(e.target.value); setError(''); }} placeholder="Retapez le mot de passe" style={inputStyle(theme)} />
        </Field>
        {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: '0 0 12px', fontWeight: 600 }}>{error}</p>}
        {saved && <p style={{ color: theme.success, fontSize: '0.85rem', margin: '0 0 12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}><Check size={15} /> Mot de passe enregistré.</p>}
        <button onClick={savePassword} className="rc-btn" style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: theme.primary, color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Save size={16} /> Modifier le mot de passe
        </button>
      </Card>
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

        <Field label="Logo de la fiche PDF / impression (haut du document A4)">
          <p style={{ fontSize: '0.82rem', color: theme.textMuted, margin: '0 0 8px' }}>
            Ce logo apparaît en haut à gauche de chaque fiche imprimée ou téléchargée en PDF.
            Laisser vide pour utiliser le logo Care par défaut.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <input
              className="rc-input"
              type="text"
              placeholder="URL https://... ou laisser vide"
              value={theme.printLogoUrl || ''}
              onChange={(e) => setTheme({ ...theme, printLogoUrl: e.target.value })}
              style={{ ...inputStyle(theme), flex: 1, minWidth: 200 }}
            />
            <label className="rc-btn" style={{ padding: '9px 14px', borderRadius: 10, border: `1.5px solid ${theme.primary}30`, background: '#fff', color: theme.primary, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Upload size={14} /> Téléverser une image
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 500 * 1024) { alert('Image trop lourde (max 500 Ko). Réduisez sa taille.'); return; }
                  const reader = new FileReader();
                  reader.onload = () => setTheme({ ...theme, printLogoUrl: reader.result });
                  reader.readAsDataURL(file);
                  e.target.value = '';
                }}
              />
            </label>
            {theme.printLogoUrl && (
              <button
                onClick={() => setTheme({ ...theme, printLogoUrl: '' })}
                className="rc-btn"
                style={{ padding: '9px 14px', borderRadius: 10, border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
              >
                <Trash2 size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Retirer
              </button>
            )}
          </div>
          {theme.printLogoUrl && (
            <div style={{ padding: 12, background: '#fff', borderRadius: 10, border: `1px dashed ${theme.primary}30`, textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: theme.textMuted, marginBottom: 6 }}>Aperçu du logo PDF :</div>
              <img src={theme.printLogoUrl} alt="logo PDF" style={{ height: 50, maxWidth: '100%', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
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
  const [dragId, setDragId] = useState(null);   // produit en cours de glissement
  const [overId, setOverId] = useState(null);   // produit survolé

  const handleSave = (prod) => {
    if (editing) setProducts(products.map(p => p.id === prod.id ? prod : p));
    else setProducts([...products, prod]);
    setEditing(null); setCreating(false);
  };
  const handleDelete = (id) => {
    if (window.confirm('Supprimer définitivement ce produit ?')) setProducts(products.filter(p => p.id !== id));
  };

  // Déplace un produit vers le haut/bas À L'INTÉRIEUR de sa marque (flèches).
  const moveWithinBrand = (productId, direction) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const sameBrandIndices = products
      .map((p, i) => ({ p, i }))
      .filter(x => x.p.brand === product.brand)
      .map(x => x.i);
    const posInBrand = sameBrandIndices.findIndex(i => products[i].id === productId);
    const targetPos = posInBrand + direction;
    if (targetPos < 0 || targetPos >= sameBrandIndices.length) return;
    const idxA = sameBrandIndices[posInBrand];
    const idxB = sameBrandIndices[targetPos];
    const next = [...products];
    [next[idxA], next[idxB]] = [next[idxB], next[idxA]];
    setProducts(next);
  };

  // Réordonne par glisser-déposer : place le produit "sourceId" juste avant "targetId"
  // (uniquement si même marque), en réordonnant le tableau global.
  const reorderByDrag = (sourceId, targetId) => {
    if (!sourceId || !targetId || sourceId === targetId) return;
    const src = products.find(p => p.id === sourceId);
    const tgt = products.find(p => p.id === targetId);
    if (!src || !tgt || src.brand !== tgt.brand) return; // pas de déplacement entre marques
    const next = products.filter(p => p.id !== sourceId);
    const targetIndex = next.findIndex(p => p.id === targetId);
    next.splice(targetIndex, 0, src);
    setProducts(next);
  };

  if (editing || creating) {
    return <ProductEditor theme={theme} brands={brands} product={editing} onSave={handleSave} onCancel={() => { setEditing(null); setCreating(false); }} />;
  }

  const query = q.trim().toLowerCase();

  return (
    <Card theme={theme} title={`Produits (${products.length})`}>
      <p style={{ fontSize: '0.85rem', color: theme.textMuted, margin: '0 0 14px' }}>
        Les modèles sont regroupés par marque. Glissez-déposez une ligne (poignée ⋮⋮ à gauche) ou utilisez les flèches pour réorganiser l'ordre d'affichage. Le réordonnancement reste à l'intérieur de chaque marque.
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
                    <div
                      key={p.id}
                      draggable={query === ''}
                      onDragStart={(e) => { if (query !== '') return; setDragId(p.id); e.dataTransfer.effectAllowed = 'move'; }}
                      onDragOver={(e) => { if (query !== '') return; e.preventDefault(); if (overId !== p.id) setOverId(p.id); }}
                      onDrop={(e) => { if (query !== '') return; e.preventDefault(); reorderByDrag(dragId, p.id); setDragId(null); setOverId(null); }}
                      onDragEnd={() => { setDragId(null); setOverId(null); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 10,
                        background: theme.surface,
                        border: `1px solid ${overId === p.id && dragId && dragId !== p.id ? theme.primary : theme.primary + '10'}`,
                        boxShadow: overId === p.id && dragId && dragId !== p.id ? `0 -2px 0 ${theme.primary} inset` : 'none',
                        opacity: dragId === p.id ? 0.4 : 1,
                        transition: 'opacity 0.15s, border-color 0.15s',
                      }}
                    >
                      {/* Poignée de glissement */}
                      <span title="Glisser pour déplacer" style={{ cursor: query === '' ? 'grab' : 'default', color: theme.textMuted, fontSize: '1.1rem', lineHeight: 1, userSelect: 'none', letterSpacing: '-2px', padding: '0 2px', opacity: query === '' ? 1 : 0.3 }}>⋮⋮</span>
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

  // --- Sélecteur multiple de capacités ---
  const [customCap, setCustomCap] = useState('');
  // Capacités proposées par défaut (l'ordre sert au tri d'affichage)
  const COMMON_CAPS = ['16 Go', '32 Go', '64 Go', '128 Go', '256 Go', '512 Go', '1 To', '2 To'];
  const capOrder = (c) => { const i = COMMON_CAPS.indexOf(c); return i === -1 ? 999 : i; };
  const toggleCap = (cap) => {
    const has = form.storage.includes(cap);
    const next = has ? form.storage.filter(c => c !== cap) : [...form.storage, cap];
    next.sort((a, b) => capOrder(a) - capOrder(b));
    setForm({ ...form, storage: next });
  };
  const addCustomCap = () => {
    const v = customCap.trim();
    if (!v || form.storage.includes(v)) { setCustomCap(''); return; }
    const next = [...form.storage, v].sort((a, b) => capOrder(a) - capOrder(b));
    setForm({ ...form, storage: next });
    setCustomCap('');
  };
  // Valeurs proposées = communes + celles déjà présentes hors-liste (pour les recocher facilement)
  const proposedCaps = [...new Set([...COMMON_CAPS, ...form.storage])].sort((a, b) => capOrder(a) - capOrder(b));

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
        {/* Sélection actuelle (puces removables) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 12, borderRadius: 10, background: theme.primaryLight, border: `1.5px solid ${theme.primary}30`, minHeight: 44, alignItems: 'center', marginBottom: 12 }}>
          {form.storage.length === 0 && (
            <span style={{ fontSize: '0.85rem', color: theme.textMuted }}>Aucune capacité sélectionnée — choisissez-en ci-dessous.</span>
          )}
          {form.storage.map((cap) => (
            <span key={cap} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 999, background: theme.primary, color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>
              {cap}
              <button onClick={() => toggleCap(cap)} title="Retirer" className="rc-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.25)', color: '#fff', cursor: 'pointer', padding: 0 }}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>

        {/* Valeurs proposées (cliquables) */}
        <div style={{ fontSize: '0.78rem', color: theme.textMuted, fontWeight: 600, marginBottom: 6 }}>Cliquez pour ajouter ou retirer :</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {proposedCaps.map((cap) => {
            const selected = form.storage.includes(cap);
            return (
              <button key={cap} onClick={() => toggleCap(cap)} className="rc-btn" style={{
                padding: '7px 13px', borderRadius: 999, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                border: `1.5px solid ${selected ? theme.primary : theme.primary + '25'}`,
                background: selected ? theme.primary : '#fff',
                color: selected ? '#fff' : theme.text,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                {selected && <Check size={13} />} {cap}
              </button>
            );
          })}
        </div>

        {/* Ajouter une valeur personnalisée */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            value={customCap}
            onChange={(e) => setCustomCap(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomCap(); } }}
            placeholder="Autre capacité (ex : 768 Go)"
            className="rc-input"
            style={{ ...inputStyle(theme), maxWidth: 220 }}
          />
          <button onClick={addCustomCap} className="rc-btn" style={{ padding: '9px 14px', borderRadius: 10, border: `1.5px dashed ${theme.primary}40`, background: 'transparent', color: theme.primary, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={14} /> Ajouter
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

      <Card theme={theme} title="États du téléphone (label, description, coefficient)">
        <p style={{ fontSize: '0.85rem', color: theme.textMuted, margin: '0 0 12px' }}>
          Coefficient appliqué au prix après décote concurrent. 1.00 = aucune réduction · 0.50 = -50%. Vous pouvez modifier, ajouter ou supprimer des états.
        </p>
        {(() => {
          const conds = getConditions(pricing);
          const updateCond = (i, field, value) => {
            const next = [...conds];
            next[i] = { ...next[i], [field]: value };
            setPricing({ ...pricing, conditions: next });
          };
          const deleteCond = (i) => {
            if (!window.confirm(`Supprimer l'état "${conds[i].label}" ?`)) return;
            setPricing({ ...pricing, conditions: conds.filter((_, idx) => idx !== i) });
          };
          const addCond = () => {
            const key = 'etat-' + Date.now();
            setPricing({ ...pricing, conditions: [...conds, { key, label: 'Nouvel état', desc: '', mult: 0.5 }] });
          };
          return (
            <div style={{ display: 'grid', gap: 8 }}>
              {conds.map((c, i) => (
                <div key={c.key} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 80px 36px', gap: 8, alignItems: 'center', padding: 10, background: theme.surface, borderRadius: 10, border: `1px solid ${theme.primary}10` }}>
                  <input
                    value={c.label}
                    onChange={(e) => updateCond(i, 'label', e.target.value)}
                    placeholder="Libellé (ex : Bon état)"
                    className="rc-input"
                    style={{ ...inputStyle(theme), padding: '7px 10px', fontSize: '0.88rem', fontWeight: 600 }}
                  />
                  <input
                    value={c.desc || ''}
                    onChange={(e) => updateCond(i, 'desc', e.target.value)}
                    placeholder="Description (ex : Micro-rayures)"
                    className="rc-input"
                    style={{ ...inputStyle(theme), padding: '7px 10px', fontSize: '0.82rem' }}
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1.2"
                    value={c.mult}
                    onChange={(e) => updateCond(i, 'mult', parseFloat(e.target.value) || 0)}
                    className="rc-input"
                    style={{ ...inputStyle(theme), padding: '7px 10px', fontSize: '0.88rem', fontWeight: 700, textAlign: 'center' }}
                  />
                  <button
                    onClick={() => deleteCond(i)}
                    title="Supprimer cet état"
                    className="rc-btn"
                    style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              <button
                onClick={addCond}
                className="rc-btn"
                style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px dashed ${theme.primary}40`, background: 'transparent', color: theme.primary, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <Plus size={14} /> Ajouter un état
              </button>
            </div>
          );
        })()}
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
