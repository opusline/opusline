/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ browser: NonNullable<unknown>, platform: NonNullable<unknown> }} Security_Trusted_LabelInputs */

const en_security_trusted_label = /** @type {(inputs: Security_Trusted_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.browser} on ${i?.platform}`)
};

const fr_security_trusted_label = /** @type {(inputs: Security_Trusted_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.browser} sur ${i?.platform}`)
};

/**
* | output |
* | --- |
* | "{browser} on {platform}" |
*
* @param {Security_Trusted_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_trusted_label = /** @type {((inputs: Security_Trusted_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Trusted_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_trusted_label(inputs)
	return en_security_trusted_label(inputs)
});