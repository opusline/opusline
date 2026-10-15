/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Head_Average_DelayInputs */

const en_clients_head_average_delay = /** @type {(inputs: Clients_Head_Average_DelayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Average delay`)
};

const fr_clients_head_average_delay = /** @type {(inputs: Clients_Head_Average_DelayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Délai moyen`)
};

/**
* | output |
* | --- |
* | "Average delay" |
*
* @param {Clients_Head_Average_DelayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_head_average_delay = /** @type {((inputs?: Clients_Head_Average_DelayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Head_Average_DelayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_head_average_delay(inputs)
	return en_clients_head_average_delay(inputs)
});