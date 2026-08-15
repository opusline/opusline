/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Not_Found_HomeInputs */

const en_not_found_home = /** @type {(inputs: Not_Found_HomeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back to the dashboard`)
};

const fr_not_found_home = /** @type {(inputs: Not_Found_HomeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retour au tableau de bord`)
};

/**
* | output |
* | --- |
* | "Back to the dashboard" |
*
* @param {Not_Found_HomeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const not_found_home = /** @type {((inputs?: Not_Found_HomeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Not_Found_HomeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_not_found_home(inputs)
	return en_not_found_home(inputs)
});