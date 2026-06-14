import Swup from 'swup';
import AsyncAlpine from 'async-alpine';
import Alpine from 'alpinejs';

const window = globalThis as any;

const swup = new Swup();

Alpine.plugin(AsyncAlpine);
window.Alpine = Alpine;

Alpine.start();