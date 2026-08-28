/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Subscribed_BadgeInputs */

const en_deadlines_subscribed_badge = /** @type {(inputs: Deadlines_Subscribed_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subscribed`)
};

const fr_deadlines_subscribed_badge = /** @type {(inputs: Deadlines_Subscribed_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Abonné`)
};

/**
* | output |
* | --- |
* | "Subscribed" |
*
* @param {Deadlines_Subscribed_BadgeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_subscribed_badge = /** @type {((inputs?: Deadlines_Subscribed_BadgeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Subscribed_BadgeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_subscribed_badge(inputs)
	return en_deadlines_subscribed_badge(inputs)
});