/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Entries_Header_QuantityInputs */

const en_missions_entries_header_quantity = /** @type {(inputs: Missions_Entries_Header_QuantityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quantity`)
};

const fr_missions_entries_header_quantity = /** @type {(inputs: Missions_Entries_Header_QuantityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quantité`)
};

/**
* | output |
* | --- |
* | "Quantity" |
*
* @param {Missions_Entries_Header_QuantityInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_entries_header_quantity = /** @type {((inputs?: Missions_Entries_Header_QuantityInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Entries_Header_QuantityInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_entries_header_quantity(inputs)
	return en_missions_entries_header_quantity(inputs)
});