/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_HomeInputs */

const en_error_home = /** @type {(inputs: Error_HomeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back to the dashboard`)
};

const fr_error_home = /** @type {(inputs: Error_HomeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retour au tableau de bord`)
};

/**
* | output |
* | --- |
* | "Back to the dashboard" |
*
* @param {Error_HomeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const error_home = /** @type {((inputs?: Error_HomeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_HomeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_error_home(inputs)
	return en_error_home(inputs)
});