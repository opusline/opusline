/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Quotes_Open_AriaInputs */

const en_quotes_open_aria = /** @type {(inputs: Quotes_Open_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Open the quote ${i?.label}`)
};

const fr_quotes_open_aria = /** @type {(inputs: Quotes_Open_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ouvrir le devis ${i?.label}`)
};

/**
* | output |
* | --- |
* | "Open the quote {label}" |
*
* @param {Quotes_Open_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_open_aria = /** @type {((inputs: Quotes_Open_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Open_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_open_aria(inputs)
	return en_quotes_open_aria(inputs)
});