/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown>, days: NonNullable<unknown> }} Deadlines_Reminder_UnpaidInputs */

const en_deadlines_reminder_unpaid = /** @type {(inputs: Deadlines_Reminder_UnpaidInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} unpaid for ${i?.days} d`)
};

const fr_deadlines_reminder_unpaid = /** @type {(inputs: Deadlines_Reminder_UnpaidInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} impayée depuis ${i?.days} j`)
};

/**
* | output |
* | --- |
* | "{number} unpaid for {days} d" |
*
* @param {Deadlines_Reminder_UnpaidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_reminder_unpaid = /** @type {((inputs: Deadlines_Reminder_UnpaidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Reminder_UnpaidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_reminder_unpaid(inputs)
	return en_deadlines_reminder_unpaid(inputs)
});