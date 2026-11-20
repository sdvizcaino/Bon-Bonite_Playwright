# bon-bonite.com · Pruebas E2E con Playwright

Automatización de 3 escenarios end-to-end sobre [www.bon-bonite.com](https://www.bon-bonite.com) con **Playwright + TypeScript** y el patrón **Page Object Model (POM)**.

| ID | Escenario | Archivo |
|---|---|---|
| ESC-01 | Registro de un usuario nuevo y acceso a Mi cuenta | `tests/registro.spec.ts` |
| ESC-02 | Modificación de nombre, apellido y teléfono en Mi cuenta → Datos (con verificación de persistencia) | `tests/editar-datos.spec.ts` |
| ESC-03 | Compra de un bolso: producto → carrito → facturación → pago, **sin confirmar la orden** | `tests/compra.spec.ts` |

## Consideraciones importantes

- Los tests corren contra el **sitio de producción**. Por eso:
  - Todos los datos son **ficticios** y se generan con [Faker](https://fakerjs.dev): cédula de 10 dígitos, nombres, correos `@yopmail.com`, teléfono y dirección de Colombia.
  - Cada test registra **su propio usuario**: no hay cuentas fijas ni credenciales en el código.
  - El escenario de compra **nunca** pulsa "REGISTRAR ORDEN": termina verificando que el botón está habilitado, así no se crean pedidos reales.
  - Se ejecuta **un test a la vez** (`workers: 1`) para no saturar el sitio.

## Requisitos

- Node.js 22 o superior
- npm

## Instalación

```bash
npm ci
npx playwright install chromium
cp .env.example .env   # opcional: solo define BASE_URL
```

## Ejecución

```bash
npm test                 # los 3 escenarios
npm run test:registro    # solo ESC-01
npm run test:datos       # solo ESC-02
npm run test:compra      # solo ESC-03
npm run test:headed      # viendo el navegador
npm run report           # abrir el reporte HTML
npm run typecheck        # verificar tipos de TypeScript
```

## Evidencias

Cada ejecución genera evidencia en `evidencias/<escenario>/`:

- **Capturas numeradas por paso** (`01_formulario_registro.png`, `02_...`). Cada campo o botón que usa el test y cada elemento que se valida queda marcado con un **recuadro rojo**.
- **Video del test** (`video_OK.webm` o `video_FAIL.webm`), también con los recuadros.
- Las capturas también se adjuntan al **reporte HTML** (`playwright-report/`).

## Estructura

```
├── .github/workflows/playwright.yml   # CI: corre la suite y publica reporte y evidencias
├── fixtures/
│   └── evidence.ts                    # extiende `test` para guardar el video de cada escenario
├── pages/                             # Page Objects (un archivo por página)
│   ├── AccountPage.ts                 # /mi-cuenta: registro e inicio de sesión
│   ├── MyAccountPage.ts               # Mi cuenta: saludo y pestañas
│   ├── AccountDetailsPage.ts          # Mi cuenta → Datos
│   ├── CategoryPage.ts                # listado de una categoría
│   ├── ProductPage.ts                 # detalle de producto
│   └── CheckoutPage.ts                # /finalizar-compra
├── tests/                             # un spec por escenario
├── utils/
│   ├── dataFactory.ts                 # datos de prueba con Faker
│   └── evidence.ts                    # recuadro rojo y capturas
└── playwright.config.ts
```

### Cómo está organizado el código (POM)

- **Page Objects** (`pages/`): cada clase declara los localizadores de su página y expone acciones con nombres claros (`register`, `addToCart`, `fillBilling`...). No tienen aserciones.
- **Specs** (`tests/`): describen el escenario con `test.step` y hacen las verificaciones con `expect`.
- **Datos** (`utils/dataFactory.ts`): un solo lugar para generar usuarios y datos de facturación.

## Integración continua

El workflow `.github/workflows/playwright.yml` se ejecuta en cada `push` o pull request a `main` y también de forma manual (**Actions → Playwright E2E → Run workflow**). Publica dos artefactos descargables: `playwright-report` y `evidencias`.

## Hallazgos durante la automatización

- En el checkout, el botón flotante de WhatsApp queda encima del checkbox "Autorizo el tratamiento de mis datos personales" y puede interceptar el clic. El test lo maneja y además verifica explícitamente que el checkbox quede marcado.
- El texto "Regístrate" de `/mi-cuenta` no es un enlace (`<a>`), sino un texto con clic, lo que afecta la accesibilidad del flujo de registro.
