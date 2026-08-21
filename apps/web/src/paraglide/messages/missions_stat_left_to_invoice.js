/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Stat_Left_To_InvoiceInputs */

const en_missions_stat_left_to_invoice = /** @type {(inputs: Missions_Stat_Left_To_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Left to invoice`)
};

const fr_missions_stat_left_to_invoice = /** @type {(inputs: Missions_Stat_Left_To_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reste à facturer`)
};

/**
* | output |
* | --- |
* | "Left to invoice" |
*
* @param {Missions_Stat_Left_To_InvoiceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_stat_left_to_invoice = /** @type {((inputs?: Missions_Stat_Left_To_InvoiceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Stat_Left_To_InvoiceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_stat_left_to_invoice(inputs)
	return en_missions_stat_left_to_invoice(inputs)
});