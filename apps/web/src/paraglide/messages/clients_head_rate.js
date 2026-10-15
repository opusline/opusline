/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Head_RateInputs */

const en_clients_head_rate = /** @type {(inputs: Clients_Head_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rate`)
};

const fr_clients_head_rate = /** @type {(inputs: Clients_Head_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tarif`)
};

/**
* | output |
* | --- |
* | "Rate" |
*
* @param {Clients_Head_RateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_head_rate = /** @type {((inputs?: Clients_Head_RateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Head_RateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_head_rate(inputs)
	return en_clients_head_rate(inputs)
});