/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Weekend_Lock_ReasonInputs */

const en_week_weekend_lock_reason = /** @type {(inputs: Week_Weekend_Lock_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The weekend stays open: it has entries this week.`)
};

const fr_week_weekend_lock_reason = /** @type {(inputs: Week_Weekend_Lock_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le week-end reste ouvert : il contient des entrées cette semaine.`)
};

/**
* | output |
* | --- |
* | "The weekend stays open: it has entries this week." |
*
* @param {Week_Weekend_Lock_ReasonInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_weekend_lock_reason = /** @type {((inputs?: Week_Weekend_Lock_ReasonInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Weekend_Lock_ReasonInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_weekend_lock_reason(inputs)
	return en_week_weekend_lock_reason(inputs)
});