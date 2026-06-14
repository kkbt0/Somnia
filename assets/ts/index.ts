import AsyncAlpine from 'async-alpine';
import Alpine from 'alpinejs';
import Swup from 'swup';
import SwupScrollPlugin from '@swup/scroll-plugin';
import mediumZoom from 'medium-zoom';

import SOMNIA_LIBS from './src/variable.js';
import Somnia from './src/main.js';
import { component, somniaData } from './src/components.js';

const window = globalThis as any;
window.SOMNIA_LIBS = SOMNIA_LIBS;
window.Somnia = Somnia;
window.component = component;
window.somniaData = somniaData;
window.mediumZoom = mediumZoom;

Alpine.plugin(AsyncAlpine);
window.Alpine = Alpine;
Alpine.store('somnia', {
    theme: localStorage.getItem('theme') || 'system',
    isDark: document.documentElement.classList.contains('dark'),
});
Alpine.plugin((Somnia as any).SomniaPlugin);

function SomniaInit() {
    (Somnia as any).PageInitCustom();
    Somnia.swupPageInitMediumZoom();
    (Somnia as any).swupPageInitCustom();
    const swup = new Swup({
        containers: ['#content-wrapper'],
        // native: true,
        plugins: [
            new SwupScrollPlugin(),
        ]
    });
    swup.hooks.on('page:view', () => {
        Somnia.swupPageInitMediumZoom();
        (Somnia as any).swupPageInitCustom();
    });
    Alpine.start();
}

// custom.js 触发
window.SomniaInit = SomniaInit;
document.addEventListener('somnia:run', SomniaInit, { once: true });