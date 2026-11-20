import { Locator, Page, TestInfo } from '@playwright/test';

/**
 * Dibuja un recuadro rojo alrededor del elemento que el test está usando.
 * El recuadro queda visible en el video y en las capturas de evidencia.
 *
 * Algunos campos del sitio están ocultos detrás de un diseño propio
 * (listas select2 o checkboxes personalizados). En esos casos se marca
 * el elemento visible que los representa.
 */
export async function highlight(locator: Locator): Promise<void> {
  await locator.evaluate((element: HTMLElement) => {
    let target: HTMLElement = element;

    const isHidden = element.offsetParent === null || element.classList.contains('select2-hidden-accessible');
    if (isHidden) {
      const select2Box = element.nextElementSibling as HTMLElement | null;
      const label = element.closest('label') as HTMLElement | null;
      target = (select2Box?.classList.contains('select2') ? select2Box : label) ?? element;
    }

    target.style.outline = '3px solid red';
    target.style.outlineOffset = '2px';
  });
}

/** Número de captura por test, para que las imágenes queden en orden. */
let screenshotCounter = 0;

export function resetEvidenceCounter(): void {
  screenshotCounter = 0;
}

/**
 * Toma una captura de la pantalla actual, la guarda en
 * evidencias/<escenario>/NN_<nombre>.png y la adjunta al reporte HTML.
 * Con fullPage = true captura la página completa (útil en formularios largos).
 */
export async function takeEvidence(page: Page, testInfo: TestInfo, name: string, fullPage = false): Promise<void> {
  screenshotCounter += 1;
  const scenario = getScenarioId(testInfo);
  const fileName = `${String(screenshotCounter).padStart(2, '0')}_${name}.png`;
  const path = `evidencias/${scenario}/${fileName}`;

  await page.screenshot({
    path,
    fullPage,
    // En capturas de página completa, el menú superior fijo aparecería repetido en
    // medio de la imagen tapando campos. Se vuelve estático solo durante la captura.
    style: fullPage ? 'header { position: static !important; }' : undefined,
  });
  await testInfo.attach(fileName, { path, contentType: 'image/png' });
}

/** Toma el ID del escenario desde el título del describe, por ejemplo "ESC-01". */
export function getScenarioId(testInfo: TestInfo): string {
  const match = testInfo.titlePath.join(' ').match(/ESC-\d+/);
  return match ? match[0] : 'sin-escenario';
}
