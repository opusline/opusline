/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Stop_TrackingInputs */

const en_week_stop_tracking = /** @type {(inputs: Week_Stop_TrackingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stop and save the tracking`)
};

const fr_week_stop_tracking = /** @type {(inputs: Week_Stop_TrackingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Arrêter et enregistrer le suivi`)
};

/**
* | output |
* | --- |
* | "Stop and save the tracking" |
*
* @param {Week_Stop_TrackingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_stop_tracking = /** @type {((inputs?: Week_Stop_TrackingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Stop_TrackingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_stop_tracking(inputs)
	return en_week_stop_tracking(inputs)
});