/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Trusted_EmptyInputs */

const en_security_trusted_empty = /** @type {(inputs: Security_Trusted_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No browser is trusted at the moment.`)
};

const fr_security_trusted_empty = /** @type {(inputs: Security_Trusted_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun navigateur n'est de confiance pour le moment.`)
};

/**
* | output |
* | --- |
* | "No browser is trusted at the moment." |
*
* @param {Security_Trusted_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_trusted_empty = /** @type {((inputs?: Security_Trusted_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Trusted_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_trusted_empty(inputs)
	return en_security_trusted_empty(inputs)
});