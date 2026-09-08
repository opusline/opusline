/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Trusted_Unknown_BrowserInputs */

const en_security_trusted_unknown_browser = /** @type {(inputs: Security_Trusted_Unknown_BrowserInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unknown browser`)
};

const fr_security_trusted_unknown_browser = /** @type {(inputs: Security_Trusted_Unknown_BrowserInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Navigateur inconnu`)
};

/**
* | output |
* | --- |
* | "Unknown browser" |
*
* @param {Security_Trusted_Unknown_BrowserInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_trusted_unknown_browser = /** @type {((inputs?: Security_Trusted_Unknown_BrowserInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Trusted_Unknown_BrowserInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_trusted_unknown_browser(inputs)
	return en_security_trusted_unknown_browser(inputs)
});