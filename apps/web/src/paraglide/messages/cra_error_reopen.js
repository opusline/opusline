/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Error_ReopenInputs */

const en_cra_error_reopen = /** @type {(inputs: Cra_Error_ReopenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The CRA could not be reopened.`)
};

const fr_cra_error_reopen = /** @type {(inputs: Cra_Error_ReopenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le CRA n'a pas pu être rouvert.`)
};

/**
* | output |
* | --- |
* | "The CRA could not be reopened." |
*
* @param {Cra_Error_ReopenInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_error_reopen = /** @type {((inputs?: Cra_Error_ReopenInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Error_ReopenInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_error_reopen(inputs)
	return en_cra_error_reopen(inputs)
});