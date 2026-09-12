/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Menu_ResumeInputs */

const en_subscriptions_menu_resume = /** @type {(inputs: Subscriptions_Menu_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Resume`)
};

const fr_subscriptions_menu_resume = /** @type {(inputs: Subscriptions_Menu_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reprendre`)
};

/**
* | output |
* | --- |
* | "Resume" |
*
* @param {Subscriptions_Menu_ResumeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_menu_resume = /** @type {((inputs?: Subscriptions_Menu_ResumeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Menu_ResumeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_menu_resume(inputs)
	return en_subscriptions_menu_resume(inputs)
});