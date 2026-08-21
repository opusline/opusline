/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Todo_Open_MissionInputs */

const en_invoices_todo_open_mission = /** @type {(inputs: Invoices_Todo_Open_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open the mission`)
};

const fr_invoices_todo_open_mission = /** @type {(inputs: Invoices_Todo_Open_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ouvrir la mission`)
};

/**
* | output |
* | --- |
* | "Open the mission" |
*
* @param {Invoices_Todo_Open_MissionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_todo_open_mission = /** @type {((inputs?: Invoices_Todo_Open_MissionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Todo_Open_MissionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_todo_open_mission(inputs)
	return en_invoices_todo_open_mission(inputs)
});