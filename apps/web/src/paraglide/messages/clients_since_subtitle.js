/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ month: NonNullable<unknown>, terms: NonNullable<unknown> }} Clients_Since_SubtitleInputs */

const en_clients_since_subtitle = /** @type {(inputs: Clients_Since_SubtitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Client since ${i?.month} · payment within ${i?.terms}`)
};

const fr_clients_since_subtitle = /** @type {(inputs: Clients_Since_SubtitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Client depuis ${i?.month} · paiement à ${i?.terms}`)
};

/**
* | output |
* | --- |
* | "Client since {month} · payment within {terms}" |
*
* @param {Clients_Since_SubtitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_since_subtitle = /** @type {((inputs: Clients_Since_SubtitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Since_SubtitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_since_subtitle(inputs)
	return en_clients_since_subtitle(inputs)
});