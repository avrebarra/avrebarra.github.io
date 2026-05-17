/*
 * Components entrypoint.
 * Keep this file as the only place that wires component registrations.
 */

import { register as registerTOC } from "./table-of-content.js";
import { register as registerAboutMeExperience } from "./about-me-experience.js";

registerTOC();
registerAboutMeExperience();