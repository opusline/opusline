/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Trusted_TitleInputs */

const en_security_trusted_title = /** @type {(inputs: Security_Trusted_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Trusted browsers`)
};

const fr_security_trusted_title = /** @type {(inputs: Security_Trusted_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Navigateurs de confiance`)
};

/**
* | output |
* | --- |
* | "Trusted browsers" |
*
* @param {Security_Trusted_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_trusted_title = /** @type {((inputs?: Security_Trusted_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Trusted_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_trusted_title(inputs)
	return en_security_trusted_title(inputs)
});