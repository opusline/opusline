/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Legend_IdleInputs */

const en_cra_legend_idle = /** @type {(inputs: Cra_Legend_IdleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not reported`)
};

const fr_cra_legend_idle = /** @type {(inputs: Cra_Legend_IdleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Non saisi`)
};

/**
* | output |
* | --- |
* | "Not reported" |
*
* @param {Cra_Legend_IdleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_legend_idle = /** @type {((inputs?: Cra_Legend_IdleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Legend_IdleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_legend_idle(inputs)
	return en_cra_legend_idle(inputs)
});