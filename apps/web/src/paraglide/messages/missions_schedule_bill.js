/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Schedule_BillInputs */

const en_missions_schedule_bill = /** @type {(inputs: Missions_Schedule_BillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoice it`)
};

const fr_missions_schedule_bill = /** @type {(inputs: Missions_Schedule_BillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facturer`)
};

/**
* | output |
* | --- |
* | "Invoice it" |
*
* @param {Missions_Schedule_BillInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_schedule_bill = /** @type {((inputs?: Missions_Schedule_BillInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Schedule_BillInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_schedule_bill(inputs)
	return en_missions_schedule_bill(inputs)
});