/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Esn_Card_BeforeInputs */

const en_clients_esn_card_before = /** @type {(inputs: Clients_Esn_Card_BeforeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This client's missions will ask for an`)
};

const fr_clients_esn_card_before = /** @type {(inputs: Clients_Esn_Card_BeforeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les missions de ce client demanderont un`)
};

/**
* | output |
* | --- |
* | "This client's missions will ask for an" |
*
* @param {Clients_Esn_Card_BeforeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_esn_card_before = /** @type {((inputs?: Clients_Esn_Card_BeforeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Esn_Card_BeforeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_esn_card_before(inputs)
	return en_clients_esn_card_before(inputs)
});