/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Documents_Remove_From_QueueInputs */

const en_documents_remove_from_queue = /** @type {(inputs: Documents_Remove_From_QueueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Remove ${i?.name} from the queue`)
};

const fr_documents_remove_from_queue = /** @type {(inputs: Documents_Remove_From_QueueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Retirer ${i?.name} de la file`)
};

/**
* | output |
* | --- |
* | "Remove {name} from the queue" |
*
* @param {Documents_Remove_From_QueueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_remove_from_queue = /** @type {((inputs: Documents_Remove_From_QueueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Remove_From_QueueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_remove_from_queue(inputs)
	return en_documents_remove_from_queue(inputs)
});