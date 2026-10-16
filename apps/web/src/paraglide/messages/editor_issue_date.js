/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Issue_DateInputs */

const en_editor_issue_date = /** @type {(inputs: Editor_Issue_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Issue date`)
};

const fr_editor_issue_date = /** @type {(inputs: Editor_Issue_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Date d'émission`)
};

/**
* | output |
* | --- |
* | "Issue date" |
*
* @param {Editor_Issue_DateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_issue_date = /** @type {((inputs?: Editor_Issue_DateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Issue_DateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_issue_date(inputs)
	return en_editor_issue_date(inputs)
});