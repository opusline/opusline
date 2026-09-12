/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Menu_PauseInputs */

const en_subscriptions_menu_pause = /** @type {(inputs: Subscriptions_Menu_PauseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pause`)
};

const fr_subscriptions_menu_pause = /** @type {(inputs: Subscriptions_Menu_PauseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mettre en pause`)
};

/**
* | output |
* | --- |
* | "Pause" |
*
* @param {Subscriptions_Menu_PauseInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_menu_pause = /** @type {((inputs?: Subscriptions_Menu_PauseInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Menu_PauseInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_menu_pause(inputs)
	return en_subscriptions_menu_pause(inputs)
});