/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Error_ReopenInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Le CRA n'a pas pu être rouvert.")
	return /** @type {LocalizedString} */ ("The CRA could not be reopened.")
});