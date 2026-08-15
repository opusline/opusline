/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Missions_Detail_End_ClientInputs */

const en_missions_detail_end_client = /** @type {(inputs: Missions_Detail_End_ClientInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`end client ${i?.name}`)
};

const fr_missions_detail_end_client = /** @type {(inputs: Missions_Detail_End_ClientInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`client final ${i?.name}`)
};

/**
* | output |
* | --- |
* | "end client {name}" |
*
* @param {Missions_Detail_End_ClientInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_detail_end_client = /** @type {((inputs: Missions_Detail_End_ClientInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Detail_End_ClientInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_detail_end_client(inputs)
	return en_missions_detail_end_client(inputs)
});