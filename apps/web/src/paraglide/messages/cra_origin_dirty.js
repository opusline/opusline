/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Origin_DirtyInputs */

const en_cra_origin_dirty = /** @type {(inputs: Cra_Origin_DirtyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`edited by hand`)
};

const fr_cra_origin_dirty = /** @type {(inputs: Cra_Origin_DirtyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`modifié à la main`)
};

/**
* | output |
* | --- |
* | "edited by hand" |
*
* @param {Cra_Origin_DirtyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_origin_dirty = /** @type {((inputs?: Cra_Origin_DirtyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Origin_DirtyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_origin_dirty(inputs)
	return en_cra_origin_dirty(inputs)
});