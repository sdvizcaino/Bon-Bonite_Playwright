import { faker } from '@faker-js/faker';

/** Datos de un usuario ficticio para registrarse en bon-bonite.com. */
export interface TestUser {
  cedula: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/** Datos de facturación ficticios con formato de Colombia. */
export interface BillingData {
  phone: string;
  state: string;
  city: string;
  address: string;
  postcode: string;
}

/** Quita tildes y caracteres especiales para usar el texto en un email. */
function toEmailSafe(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z]/g, '')
    .toLowerCase();
}

/** Crea un usuario nuevo y único: cédula de 10 dígitos y email @yopmail.com. */
export function createUser(): TestUser {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const uniqueSuffix = faker.string.alphanumeric({ length: 6, casing: 'lower' });

  return {
    cedula: faker.string.numeric({ length: 10, allowLeadingZeros: false }),
    firstName,
    lastName,
    email: `${toEmailSafe(firstName)}.${toEmailSafe(lastName)}.${uniqueSuffix}@yopmail.com`,
    // Sufijo fijo para cumplir reglas comunes de complejidad (mayúscula, número, símbolo).
    password: `${faker.internet.password({ length: 10, memorable: false })}Aa1!`,
  };
}

/** Celular colombiano: empieza por 3 y tiene 10 dígitos. */
export function createPhone(): string {
  return `3${faker.string.numeric(9)}`;
}

// Textos exactos de las listas Departamento y Ciudad del checkout de bon-bonite.com.
const COLOMBIAN_CITIES = [
  { state: 'Cundinamarca', city: 'Chía' },
  { state: 'Cundinamarca', city: 'Cajicá' },
  { state: 'Cundinamarca', city: 'Funza' },
  { state: 'Cundinamarca', city: 'Mosquera' },
];

/** Crea datos de facturación ficticios de Colombia. */
export function createBillingData(): BillingData {
  const location = faker.helpers.arrayElement(COLOMBIAN_CITIES);
  const street = faker.number.int({ min: 1, max: 150 });
  const number = faker.number.int({ min: 1, max: 99 });
  const plate = faker.number.int({ min: 1, max: 99 });

  return {
    phone: createPhone(),
    state: location.state,
    city: location.city,
    address: `Calle ${street} # ${number}-${plate}`,
    postcode: faker.string.numeric(6),
  };
}
