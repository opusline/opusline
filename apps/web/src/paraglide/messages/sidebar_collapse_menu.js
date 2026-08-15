/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Sidebar_Collapse_MenuInputs */

const en_sidebar_collapse_menu = /** @type {(inputs: Sidebar_Collapse_MenuInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Collapse the menu`)
};

const fr_sidebar_collapse_menu = /** @type {(inputs: Sidebar_Collapse_MenuInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réduire le menu`)
};

/**
* | output |
* | --- |
* | "Collapse the menu" |
*
* @param {Sidebar_Collapse_MenuInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const sidebar_collapse_menu = /** @type {((inputs?: Sidebar_Collapse_MenuInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sidebar_Collapse_MenuInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_sidebar_collapse_menu(inputs)
	return en_sidebar_collapse_menu(inputs)
});