/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Issue_Date_ValueInputs */

const en_editor_issue_date_value = /** @type {(inputs: Editor_Issue_Date_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The day it is validated`)
};

const fr_editor_issue_date_value = /** @type {(inputs: Editor_Issue_Date_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le jour de la validation`)
};

/**
* | output |
* | --- |
* | "The day it is validated" |
*
* @param {Editor_Issue_Date_ValueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_issue_date_value = /** @type {((inputs?: Editor_Issue_Date_ValueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Issue_Date_ValueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_issue_date_value(inputs)
	return en_editor_issue_date_value(inputs)
});