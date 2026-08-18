/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Schedule_InvoicedInputs */

const en_missions_schedule_invoiced = /** @type {(inputs: Missions_Schedule_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoiced`)
};

const fr_missions_schedule_invoiced = /** @type {(inputs: Missions_Schedule_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facturée`)
};

/**
* | output |
* | --- |
* | "Invoiced" |
*
* @param {Missions_Schedule_InvoicedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_schedule_invoiced = /** @type {((inputs?: Missions_Schedule_InvoicedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Schedule_InvoicedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_schedule_invoiced(inputs)
	return en_missions_schedule_invoiced(inputs)
});