/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ copied: NonNullable<unknown>, failed: NonNullable<unknown>, message: NonNullable<unknown> }} Week_Repeat_ResultInputs */

const en_week_repeat_result = /** @type {(inputs: Week_Repeat_ResultInputs) => LocalizedString} */ (i) => {const copiedPlural = registry.plural("en", i?.copied, {});
	const failedPlural = registry.plural("en", i?.failed, {});
	if (copiedPlural === "one" && failedPlural === "one") return /** @type {LocalizedString} */ (`${i?.copied} entry copied, ${i?.failed} failed: ${i?.message}`);
	if (copiedPlural === "one" && failedPlural === "other") return /** @type {LocalizedString} */ (`${i?.copied} entry copied, ${i?.failed} failed: ${i?.message}`);
	if (copiedPlural === "other" && failedPlural === "one") return /** @type {LocalizedString} */ (`${i?.copied} entries copied, ${i?.failed} failed: ${i?.message}`);
	if (copiedPlural === "other" && failedPlural === "other") return /** @type {LocalizedString} */ (`${i?.copied} entries copied, ${i?.failed} failed: ${i?.message}`);
	return /** @type {LocalizedString} */ ("week_repeat_result");
};

const fr_week_repeat_result = /** @type {(inputs: Week_Repeat_ResultInputs) => LocalizedString} */ (i) => {const copiedPlural = registry.plural("fr", i?.copied, {});
	const failedPlural = registry.plural("fr", i?.failed, {});
	if (copiedPlural === "one" && failedPlural === "one") return /** @type {LocalizedString} */ (`${i?.copied} entrée reprise, ${i?.failed} échouée : ${i?.message}`);
	if (copiedPlural === "one" && failedPlural === "other") return /** @type {LocalizedString} */ (`${i?.copied} entrée reprise, ${i?.failed} échouées : ${i?.message}`);
	if (copiedPlural === "other" && failedPlural === "one") return /** @type {LocalizedString} */ (`${i?.copied} entrées reprises, ${i?.failed} échouée : ${i?.message}`);
	if (copiedPlural === "other" && failedPlural === "other") return /** @type {LocalizedString} */ (`${i?.copied} entrées reprises, ${i?.failed} échouées : ${i?.message}`);
	return /** @type {LocalizedString} */ ("week_repeat_result");
};

/**
* | copiedPlural | failedPlural | output |
* | --- | --- | --- |
* | "one" | "one" | "{copied} entry copied, {failed} failed: {message}" |
* | "one" | "other" | "{copied} entry copied, {failed} failed: {message}" |
* | "other" | "one" | "{copied} entries copied, {failed} failed: {message}" |
* | "other" | "other" | "{copied} entries copied, {failed} failed: {message}" |
*
* @param {Week_Repeat_ResultInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_repeat_result = /** @type {((inputs: Week_Repeat_ResultInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Repeat_ResultInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_repeat_result(inputs)
	return en_week_repeat_result(inputs)
});