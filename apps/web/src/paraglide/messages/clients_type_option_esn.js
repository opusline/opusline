/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Type_Option_EsnInputs */

const en_clients_type_option_esn = /** @type {(inputs: Clients_Type_Option_EsnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ESN / intermediary`)
};

const fr_clients_type_option_esn = /** @type {(inputs: Clients_Type_Option_EsnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ESN / intermédiaire`)
};

/**
* | output |
* | --- |
* | "ESN / intermediary" |
*
* @param {Clients_Type_Option_EsnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_type_option_esn = /** @type {((inputs?: Clients_Type_Option_EsnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Type_Option_EsnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_type_option_esn(inputs)
	return en_clients_type_option_esn(inputs)
});