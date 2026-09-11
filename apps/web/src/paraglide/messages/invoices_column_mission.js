/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Column_MissionInputs */

const en_invoices_column_mission = /** @type {(inputs: Invoices_Column_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mission`)
};

const fr_invoices_column_mission = /** @type {(inputs: Invoices_Column_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mission`)
};

/**
* | output |
* | --- |
* | "Mission" |
*
* @param {Invoices_Column_MissionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_column_mission = /** @type {((inputs?: Invoices_Column_MissionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Column_MissionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_column_mission(inputs)
	return en_invoices_column_mission(inputs)
});