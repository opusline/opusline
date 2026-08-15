/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Repeat_PendingInputs */

const en_week_repeat_pending = /** @type {(inputs: Week_Repeat_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copying…`)
};

const fr_week_repeat_pending = /** @type {(inputs: Week_Repeat_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reprise en cours…`)
};

/**
* | output |
* | --- |
* | "Copying…" |
*
* @param {Week_Repeat_PendingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_repeat_pending = /** @type {((inputs?: Week_Repeat_PendingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Repeat_PendingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_repeat_pending(inputs)
	return en_week_repeat_pending(inputs)
});