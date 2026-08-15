/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Esn_Card_AfterInputs */

const en_clients_esn_card_after = /** @type {(inputs: Clients_Esn_Card_AfterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`, and will enable the monthly CRA by default.`)
};

const fr_clients_esn_card_after = /** @type {(inputs: Clients_Esn_Card_AfterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`, et activeront le CRA mensuel par défaut.`)
};

/**
* | output |
* | --- |
* | ", and will enable the monthly CRA by default." |
*
* @param {Clients_Esn_Card_AfterInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_esn_card_after = /** @type {((inputs?: Clients_Esn_Card_AfterInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Esn_Card_AfterInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_esn_card_after(inputs)
	return en_clients_esn_card_after(inputs)
});