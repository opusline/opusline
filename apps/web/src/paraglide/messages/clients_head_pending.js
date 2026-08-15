/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Head_PendingInputs */

const en_clients_head_pending = /** @type {(inputs: Clients_Head_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Outstanding`)
};

const fr_clients_head_pending = /** @type {(inputs: Clients_Head_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`En attente`)
};

/**
* | output |
* | --- |
* | "Outstanding" |
*
* @param {Clients_Head_PendingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_head_pending = /** @type {((inputs?: Clients_Head_PendingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Head_PendingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_head_pending(inputs)
	return en_clients_head_pending(inputs)
});