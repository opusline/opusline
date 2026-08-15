/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Client_Type_Short_EsnInputs */

const en_client_type_short_esn = /** @type {(inputs: Client_Type_Short_EsnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Via ESN`)
};

const fr_client_type_short_esn = /** @type {(inputs: Client_Type_Short_EsnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Via ESN`)
};

/**
* | output |
* | --- |
* | "Via ESN" |
*
* @param {Client_Type_Short_EsnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const client_type_short_esn = /** @type {((inputs?: Client_Type_Short_EsnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Client_Type_Short_EsnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_client_type_short_esn(inputs)
	return en_client_type_short_esn(inputs)
});