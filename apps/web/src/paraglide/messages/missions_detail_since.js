/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ month: NonNullable<unknown> }} Missions_Detail_SinceInputs */

const en_missions_detail_since = /** @type {(inputs: Missions_Detail_SinceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`since ${i?.month}`)
};

const fr_missions_detail_since = /** @type {(inputs: Missions_Detail_SinceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`depuis ${i?.month}`)
};

/**
* | output |
* | --- |
* | "since {month}" |
*
* @param {Missions_Detail_SinceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_detail_since = /** @type {((inputs: Missions_Detail_SinceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Detail_SinceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_detail_since(inputs)
	return en_missions_detail_since(inputs)
});