/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_SaveInputs */

const en_treasury_save = /** @type {(inputs: Treasury_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record`)
};

const fr_treasury_save = /** @type {(inputs: Treasury_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer`)
};

/**
* | output |
* | --- |
* | "Record" |
*
* @param {Treasury_SaveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_save = /** @type {((inputs?: Treasury_SaveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_SaveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_save(inputs)
	return en_treasury_save(inputs)
});