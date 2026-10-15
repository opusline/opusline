/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Sidebar_Expand_MenuInputs */

const en_sidebar_expand_menu = /** @type {(inputs: Sidebar_Expand_MenuInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expand the menu`)
};

const fr_sidebar_expand_menu = /** @type {(inputs: Sidebar_Expand_MenuInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déplier le menu`)
};

/**
* | output |
* | --- |
* | "Expand the menu" |
*
* @param {Sidebar_Expand_MenuInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const sidebar_expand_menu = /** @type {((inputs?: Sidebar_Expand_MenuInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sidebar_Expand_MenuInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_sidebar_expand_menu(inputs)
	return en_sidebar_expand_menu(inputs)
});