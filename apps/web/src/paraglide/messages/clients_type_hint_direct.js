/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Type_Hint_DirectInputs */

const en_clients_type_hint_direct = /** @type {(inputs: Clients_Type_Hint_DirectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You bill and deliver directly.`)
};

const fr_clients_type_hint_direct = /** @type {(inputs: Clients_Type_Hint_DirectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vous facturez et livrez directement.`)
};

/**
* | output |
* | --- |
* | "You bill and deliver directly." |
*
* @param {Clients_Type_Hint_DirectInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_type_hint_direct = /** @type {((inputs?: Clients_Type_Hint_DirectInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Type_Hint_DirectInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_type_hint_direct(inputs)
	return en_clients_type_hint_direct(inputs)
});