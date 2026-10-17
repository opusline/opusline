/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ created: NonNullable<unknown> }} Security_Token_Usage_UnusedInputs */

const en_security_token_usage_unused = /** @type {(inputs: Security_Token_Usage_UnusedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Created ${i?.created} · never used`)
};

const fr_security_token_usage_unused = /** @type {(inputs: Security_Token_Usage_UnusedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Créé le ${i?.created} · jamais utilisé`)
};

/**
* | output |
* | --- |
* | "Created {created} · never used" |
*
* @param {Security_Token_Usage_UnusedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_token_usage_unused = /** @type {((inputs: Security_Token_Usage_UnusedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Token_Usage_UnusedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_token_usage_unused(inputs)
	return en_security_token_usage_unused(inputs)
});