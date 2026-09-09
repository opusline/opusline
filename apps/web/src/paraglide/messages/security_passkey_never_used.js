/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Passkey_Never_UsedInputs */

const en_security_passkey_never_used = /** @type {(inputs: Security_Passkey_Never_UsedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Never used`)
};

const fr_security_passkey_never_used = /** @type {(inputs: Security_Passkey_Never_UsedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Jamais utilisée`)
};

/**
* | output |
* | --- |
* | "Never used" |
*
* @param {Security_Passkey_Never_UsedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_passkey_never_used = /** @type {((inputs?: Security_Passkey_Never_UsedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Passkey_Never_UsedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_passkey_never_used(inputs)
	return en_security_passkey_never_used(inputs)
});