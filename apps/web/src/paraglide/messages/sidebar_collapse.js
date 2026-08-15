/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Sidebar_CollapseInputs */

const en_sidebar_collapse = /** @type {(inputs: Sidebar_CollapseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Collapse`)
};

const fr_sidebar_collapse = /** @type {(inputs: Sidebar_CollapseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réduire`)
};

/**
* | output |
* | --- |
* | "Collapse" |
*
* @param {Sidebar_CollapseInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const sidebar_collapse = /** @type {((inputs?: Sidebar_CollapseInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sidebar_CollapseInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_sidebar_collapse(inputs)
	return en_sidebar_collapse(inputs)
});