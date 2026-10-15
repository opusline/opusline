/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Trusted_Never_UsedInputs */

const en_security_trusted_never_used = /** @type {(inputs: Security_Trusted_Never_UsedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Never used`)
};

const fr_security_trusted_never_used = /** @type {(inputs: Security_Trusted_Never_UsedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Jamais utilisé`)
};

/**
* | output |
* | --- |
* | "Never used" |
*
* @param {Security_Trusted_Never_UsedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_trusted_never_used = /** @type {((inputs?: Security_Trusted_Never_UsedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Trusted_Never_UsedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_trusted_never_used(inputs)
	return en_security_trusted_never_used(inputs)
});