import { host } from "../globalRoutes";

export const search_employee = `${host}/hr2/api/search_employee`;
export const get_my_details = `${host}/hr2/api/get_my_details`;
export const get_form_track = (formId) =>
  `${host}/hr2/api/get_track_file/${formId}`;

// Leave routes
export const get_leave_requests = `${host}/hr2/api/get_leave_requests`;
export const get_leave_inbox = `${host}/hr2/api/get_leave_inbox`;
export const get_leave_archive = `${host}/hr2/api/get_leave_archive`;
export const submit_leave_form = `${host}/hr2/api/submit_leave_form`;
export const view_leave_form = `${host}/hr2/api/view_leave_form_data`;

// LTC routes
export const get_ltc_requests = `${host}/hr2/api/get_ltc_requests`;
export const get_ltc_inbox = `${host}/hr2/api/get_ltc_inbox`;
export const get_ltc_archive = `${host}/hr2/api/get_ltc_archive`;

// CPDA Advance routes
export const get_cpda_adv_requests = `${host}/hr2/api/get_cpda_adv_requests`;
export const get_cpda_adv_inbox = `${host}/hr2/api/get_cpda_adv_inbox`;
export const get_cpda_adv_archive = `${host}/hr2/api/get_cpda_adv_archive`;
export const submit_cpda_adv_form = `${host}/hr2/api/submit_cpda_adv_form`;
export const view_cpda_adv_form = `${host}/hr2/api/view_cpda_adv_form_data`;

// CPDA Claim routes
export const get_cpda_claim_requests = `${host}/hr2/api/get_cpda_claim_requests`;
export const get_cpda_claim_inbox = `${host}/hr2/api/get_cpda_claim_inbox`;
export const get_cpda_claim_archive = `${host}/hr2/api/get_cpda_claim_archive`;

// Appraisal routes
export const get_appraisal_requests = `${host}/hr2/api/get_appraisal_requests`;
export const get_appraisal_inbox = `${host}/hr2/api/get_appraisal_inbox`;
export const get_appraisal_archive = `${host}/hr2/api/get_appraisal_archive`;
