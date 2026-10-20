import { abeerTradingTheme, createAbeerTradingStore } from './abeerTrading.js';
import { atelierTheme, createAtelierStore } from './atelier.js';
import { circuitTheme, createCircuitStore } from './circuit.js';
import { botanicaTheme, createBotanicaStore } from './botanica.js';
import { formFieldTheme, createFormFieldStore } from './formField.js';

// The 5 curated, distinct website templates
export const themes = [
  abeerTradingTheme,
  atelierTheme,
  circuitTheme,
  botanicaTheme,
  formFieldTheme
];

export const themeById = (id) => themes.find(t => t.id === id) || themes[0];

// Returns the 5 ready-to-run demo stores
export function getDemoStores() {
  return [
    createAbeerTradingStore(),
    createAtelierStore(),
    createCircuitStore(),
    createBotanicaStore(),
    createFormFieldStore()
  ];
}

// Builds a new store configured around the chosen template
export function buildStoreFromTemplate(themeId = 'tradehouse') {
  switch (themeId) {
    case 'tradehouse':
      return createAbeerTradingStore();
    case 'atelier':
      return createAtelierStore();
    case 'circuit':
      return createCircuitStore();
    case 'botanica':
      return createBotanicaStore();
    case 'form':
      return createFormFieldStore();
    default:
      return createAbeerTradingStore();
  }
}
