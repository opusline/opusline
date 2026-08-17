/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Deadlines_Overdue_ByInputs */

const en_deadlines_overdue_by = /** @type {(inputs: Deadlines_Overdue_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} days late`)
};

const fr_deadlines_overdue_by = /** @type {(inputs: Deadlines_Overdue_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} jours de retard`)
};

/**
* | output |
* | --- |
* | "{count} days late" |
*
* @param {Deadlines_Overdue_ByInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_overdue_by = /** @type {((inputs: Deadlines_Overdue_ByInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Overdue_ByInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_overdue_by(inputs)
	return en_deadlines_overdue_by(inputs)
});