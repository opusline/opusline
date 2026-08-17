/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Declarations_Declared_DiffersInputs */

const en_declarations_declared_differs = /** @type {(inputs: Declarations_Declared_DiffersInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`declared ${i?.amount}`)
};

const fr_declarations_declared_differs = /** @type {(inputs: Declarations_Declared_DiffersInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`déclaré ${i?.amount}`)
};

/**
* | output |
* | --- |
* | "declared {amount}" |
*
* @param {Declarations_Declared_DiffersInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_declared_differs = /** @type {((inputs: Declarations_Declared_DiffersInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Declared_DiffersInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_declared_differs(inputs)
	return en_declarations_declared_differs(inputs)
});