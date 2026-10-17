/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ created: NonNullable<unknown>, lastUsed: NonNullable<unknown> }} Security_Token_UsageInputs */

const en_security_token_usage = /** @type {(inputs: Security_Token_UsageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Created ${i?.created} · last used ${i?.lastUsed}`)
};

const fr_security_token_usage = /** @type {(inputs: Security_Token_UsageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Créé le ${i?.created} · dernière utilisation le ${i?.lastUsed}`)
};

/**
* | output |
* | --- |
* | "Created {created} · last used {lastUsed}" |
*
* @param {Security_Token_UsageInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_token_usage = /** @type {((inputs: Security_Token_UsageInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Token_UsageInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_token_usage(inputs)
	return en_security_token_usage(inputs)
});