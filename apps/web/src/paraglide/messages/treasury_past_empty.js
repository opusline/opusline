/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Past_EmptyInputs */

const en_treasury_past_empty = /** @type {(inputs: Treasury_Past_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No transfer recorded yet.`)
};

const fr_treasury_past_empty = /** @type {(inputs: Treasury_Past_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun virement enregistré.`)
};

/**
* | output |
* | --- |
* | "No transfer recorded yet." |
*
* @param {Treasury_Past_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_past_empty = /** @type {((inputs?: Treasury_Past_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Past_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_past_empty(inputs)
	return en_treasury_past_empty(inputs)
});