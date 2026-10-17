/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ days: NonNullable<unknown> }} Paste_Filled_ValidityInputs */

const en_paste_filled_validity = /** @type {(inputs: Paste_Filled_ValidityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Validity ${i?.days} days`)
};

const fr_paste_filled_validity = /** @type {(inputs: Paste_Filled_ValidityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Validité ${i?.days} jours`)
};

/**
* | output |
* | --- |
* | "Validity {days} days" |
*
* @param {Paste_Filled_ValidityInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_filled_validity = /** @type {((inputs: Paste_Filled_ValidityInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Filled_ValidityInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_filled_validity(inputs)
	return en_paste_filled_validity(inputs)
});