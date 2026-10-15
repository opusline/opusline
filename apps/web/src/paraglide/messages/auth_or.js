/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_OrInputs */

const en_auth_or = /** @type {(inputs: Auth_OrInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`or`)
};

const fr_auth_or = /** @type {(inputs: Auth_OrInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ou`)
};

/**
* | output |
* | --- |
* | "or" |
*
* @param {Auth_OrInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_or = /** @type {((inputs?: Auth_OrInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_OrInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_or(inputs)
	return en_auth_or(inputs)
});