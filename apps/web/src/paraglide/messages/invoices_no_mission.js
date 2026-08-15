/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_No_MissionInputs */

const en_invoices_no_mission = /** @type {(inputs: Invoices_No_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No mission`)
};

const fr_invoices_no_mission = /** @type {(inputs: Invoices_No_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sans mission`)
};

/**
* | output |
* | --- |
* | "No mission" |
*
* @param {Invoices_No_MissionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_no_mission = /** @type {((inputs?: Invoices_No_MissionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_No_MissionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_no_mission(inputs)
	return en_invoices_no_mission(inputs)
});