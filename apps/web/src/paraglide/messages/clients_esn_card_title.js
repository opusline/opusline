/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Esn_Card_TitleInputs */

const en_clients_esn_card_title = /** @type {(inputs: Clients_Esn_Card_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Billing through an intermediary`)
};

const fr_clients_esn_card_title = /** @type {(inputs: Clients_Esn_Card_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facturation via intermédiaire`)
};

/**
* | output |
* | --- |
* | "Billing through an intermediary" |
*
* @param {Clients_Esn_Card_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_esn_card_title = /** @type {((inputs?: Clients_Esn_Card_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Esn_Card_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_esn_card_title(inputs)
	return en_clients_esn_card_title(inputs)
});