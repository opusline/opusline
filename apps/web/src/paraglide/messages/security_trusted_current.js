/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Trusted_CurrentInputs */

const en_security_trusted_current = /** @type {(inputs: Security_Trusted_CurrentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This browser`)
};

const fr_security_trusted_current = /** @type {(inputs: Security_Trusted_CurrentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce navigateur`)
};

/**
* | output |
* | --- |
* | "This browser" |
*
* @param {Security_Trusted_CurrentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_trusted_current = /** @type {((inputs?: Security_Trusted_CurrentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Trusted_CurrentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_trusted_current(inputs)
	return en_security_trusted_current(inputs)
});