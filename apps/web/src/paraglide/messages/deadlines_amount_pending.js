/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Amount_PendingInputs */

const en_deadlines_amount_pending = /** @type {(inputs: Deadlines_Amount_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Period still running`)
};

const fr_deadlines_amount_pending = /** @type {(inputs: Deadlines_Amount_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Période en cours`)
};

/**
* | output |
* | --- |
* | "Period still running" |
*
* @param {Deadlines_Amount_PendingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_amount_pending = /** @type {((inputs?: Deadlines_Amount_PendingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Amount_PendingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_amount_pending(inputs)
	return en_deadlines_amount_pending(inputs)
});