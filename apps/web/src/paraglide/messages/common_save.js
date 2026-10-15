/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_SaveInputs */

const en_common_save = /** @type {(inputs: Common_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save`)
};

const fr_common_save = /** @type {(inputs: Common_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer`)
};

/**
* | output |
* | --- |
* | "Save" |
*
* @param {Common_SaveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_save = /** @type {((inputs?: Common_SaveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_SaveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_save(inputs)
	return en_common_save(inputs)
});