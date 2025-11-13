/*==================================================
/src/components/containers/index.js

This is a "barrel" file for the Container components, which combines all the exports of individual Containers
and makes it easier to import into App.js.

Note: A "barrel" file is a way to rollup exports from other modules into a single convenient module. 
The "barrel" (module) file re-exports the exports of other modules.
================================================== */
export { default as HomePageContainer } from "./HomePageContainer";
export { default as AllCampusesContainer } from "./AllCampusesContainer";
export { default as CampusContainer } from "./CampusContainer";
export { default as AllStudentsContainer } from "./AllStudentsContainer";
export { default as StudentContainer } from "./StudentContainer";
export { default as NewStudentContainer } from "./NewStudentContainer";
