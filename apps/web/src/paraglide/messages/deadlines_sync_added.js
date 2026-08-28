/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Deadlines_Sync_AddedInputs */

const en_deadlines_sync_added = /** @type {(inputs: Deadlines_Sync_AddedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`added on ${i?.date}`)
};

const fr_deadlines_sync_added = /** @type {(inputs: Deadlines_Sync_AddedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ajoutée le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "added on {date}" |
*
* @param {Deadlines_Sync_AddedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_sync_added = /** @type {((inputs: Deadlines_Sync_AddedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Sync_AddedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_sync_added(inputs)
	return en_deadlines_sync_added(inputs)
});