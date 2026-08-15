/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Identity_TitleInputs */

const en_clients_identity_title = /** @type {(inputs: Clients_Identity_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Identity`)
};

const fr_clients_identity_title = /** @type {(inputs: Clients_Identity_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Identité`)
};

/**
* | output |
* | --- |
* | "Identity" |
*
* @param {Clients_Identity_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_identity_title = /** @type {((inputs?: Clients_Identity_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Identity_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_identity_title(inputs)
	return en_clients_identity_title(inputs)
});