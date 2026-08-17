/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_None_YetInputs */

const en_treasury_none_yet = /** @type {(inputs: Treasury_None_YetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No transfer recorded yet.`)
};

const fr_treasury_none_yet = /** @type {(inputs: Treasury_None_YetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun virement enregistré.`)
};

/**
* | output |
* | --- |
* | "No transfer recorded yet." |
*
* @param {Treasury_None_YetInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_none_yet = /** @type {((inputs?: Treasury_None_YetInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_None_YetInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_none_yet(inputs)
	return en_treasury_none_yet(inputs)
});