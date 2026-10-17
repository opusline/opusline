/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Token_Once_WarningInputs */

const en_security_token_once_warning = /** @type {(inputs: Security_Token_Once_WarningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copy it now: it is shown this once. The application sends it as Authorization: Bearer.`)
};

const fr_security_token_once_warning = /** @type {(inputs: Security_Token_Once_WarningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copiez-le maintenant : il n'est affiché qu'une fois. L'application l'envoie dans l'en-tête Authorization: Bearer.`)
};

/**
* | output |
* | --- |
* | "Copy it now: it is shown this once. The application sends it as Authorization: Bearer." |
*
* @param {Security_Token_Once_WarningInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_token_once_warning = /** @type {((inputs?: Security_Token_Once_WarningInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Token_Once_WarningInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_token_once_warning(inputs)
	return en_security_token_once_warning(inputs)
});