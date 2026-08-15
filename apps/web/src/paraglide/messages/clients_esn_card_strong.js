/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Esn_Card_StrongInputs */

const en_clients_esn_card_strong = /** @type {(inputs: Clients_Esn_Card_StrongInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`end client`)
};

const fr_clients_esn_card_strong = /** @type {(inputs: Clients_Esn_Card_StrongInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`client final`)
};

/**
* | output |
* | --- |
* | "end client" |
*
* @param {Clients_Esn_Card_StrongInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_esn_card_strong = /** @type {((inputs?: Clients_Esn_Card_StrongInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Esn_Card_StrongInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_esn_card_strong(inputs)
	return en_clients_esn_card_strong(inputs)
});