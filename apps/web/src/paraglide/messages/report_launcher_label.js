/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Launcher_LabelInputs */

const en_report_launcher_label = /** @type {(inputs: Report_Launcher_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Report a bug or suggest an idea`)
};

const fr_report_launcher_label = /** @type {(inputs: Report_Launcher_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signaler un bug ou proposer une idée`)
};

/**
* | output |
* | --- |
* | "Report a bug or suggest an idea" |
*
* @param {Report_Launcher_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_launcher_label = /** @type {((inputs?: Report_Launcher_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Launcher_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_launcher_label(inputs)
	return en_report_launcher_label(inputs)
});