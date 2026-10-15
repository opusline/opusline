/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Feed_Save_FailedInputs */

const en_deadlines_feed_save_failed = /** @type {(inputs: Deadlines_Feed_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The calendar choices could not be saved.`)
};

const fr_deadlines_feed_save_failed = /** @type {(inputs: Deadlines_Feed_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les choix du calendrier n'ont pas pu être enregistrés.`)
};

/**
* | output |
* | --- |
* | "The calendar choices could not be saved." |
*
* @param {Deadlines_Feed_Save_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_feed_save_failed = /** @type {((inputs?: Deadlines_Feed_Save_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Feed_Save_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_feed_save_failed(inputs)
	return en_deadlines_feed_save_failed(inputs)
});