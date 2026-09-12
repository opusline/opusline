/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Declarations_Annual_Open_AriaInputs */

const en_declarations_annual_open_aria = /** @type {(inputs: Declarations_Annual_Open_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`View ${i?.name}`)
};

const fr_declarations_annual_open_aria = /** @type {(inputs: Declarations_Annual_Open_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Voir ${i?.name}`)
};

/**
* | output |
* | --- |
* | "View {name}" |
*
* @param {Declarations_Annual_Open_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_annual_open_aria = /** @type {((inputs: Declarations_Annual_Open_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Annual_Open_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_annual_open_aria(inputs)
	return en_declarations_annual_open_aria(inputs)
});