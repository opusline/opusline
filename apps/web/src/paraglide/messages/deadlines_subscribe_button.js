/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Subscribe_ButtonInputs */

const en_deadlines_subscribe_button = /** @type {(inputs: Deadlines_Subscribe_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subscribe to the calendar`)
};

const fr_deadlines_subscribe_button = /** @type {(inputs: Deadlines_Subscribe_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`S'abonner au calendrier`)
};

/**
* | output |
* | --- |
* | "Subscribe to the calendar" |
*
* @param {Deadlines_Subscribe_ButtonInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_subscribe_button = /** @type {((inputs?: Deadlines_Subscribe_ButtonInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Subscribe_ButtonInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_subscribe_button(inputs)
	return en_deadlines_subscribe_button(inputs)
});