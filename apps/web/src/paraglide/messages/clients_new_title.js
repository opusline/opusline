/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_New_TitleInputs */

const en_clients_new_title = /** @type {(inputs: Clients_New_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New client`)
};

const fr_clients_new_title = /** @type {(inputs: Clients_New_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nouveau client`)
};

/**
* | output |
* | --- |
* | "New client" |
*
* @param {Clients_New_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_new_title = /** @type {((inputs?: Clients_New_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_New_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_new_title(inputs)
	return en_clients_new_title(inputs)
});