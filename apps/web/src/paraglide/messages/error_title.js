/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_TitleInputs */

const en_error_title = /** @type {(inputs: Error_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Something went wrong`)
};

const fr_error_title = /** @type {(inputs: Error_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Une erreur est survenue`)
};

/**
* | output |
* | --- |
* | "Something went wrong" |
*
* @param {Error_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const error_title = /** @type {((inputs?: Error_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_error_title(inputs)
	return en_error_title(inputs)
});