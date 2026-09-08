/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Security_Trusted_Last_UsedInputs */

const en_security_trusted_last_used = /** @type {(inputs: Security_Trusted_Last_UsedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Last used ${i?.date}`)
};

const fr_security_trusted_last_used = /** @type {(inputs: Security_Trusted_Last_UsedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Dernière utilisation le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "Last used {date}" |
*
* @param {Security_Trusted_Last_UsedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_trusted_last_used = /** @type {((inputs: Security_Trusted_Last_UsedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Trusted_Last_UsedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_trusted_last_used(inputs)
	return en_security_trusted_last_used(inputs)
});