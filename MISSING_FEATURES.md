# Missing Features from Project Requirements

Based on the project requirements PDF and current codebase analysis, here's what's missing:

## 🚨 **CRITICAL MISSING COMPONENTS**

### 1. **Add Campus View** - COMPLETELY MISSING
   - ❌ No `NewCampusContainer.js`
   - ❌ No `NewCampusView.js`
   - ❌ No route in `App.js` for `/newcampus` or `/addcampus`
   - ❌ Button exists in `AllCampusesView.js` but links to home page (`/`)
   - ❌ Missing Redux thunk: `addCampusThunk`
   - ❌ Missing Redux action: `ADD_CAMPUS`
   - ❌ Missing action creator: `addCampus`
   - ❌ Missing reducer case for `ADD_CAMPUS` in `campuses.js`

**Backend:** ✅ Already implemented in `/backend/routes/campuses.js`

---

### 2. **Edit Campus View** - COMPLETELY MISSING
   - ❌ No `EditCampusContainer.js`
   - ❌ No `EditCampusView.js`
   - ❌ No route in `App.js` for `/campus/:id/edit`
   - ❌ Missing Redux thunk: `editCampusThunk`
   - ❌ Missing Redux action: `EDIT_CAMPUS`
   - ❌ Missing action creator: `editCampus`
   - ❌ Missing reducer case for `EDIT_CAMPUS` in `campuses.js`
   - ❌ No "Edit Campus" button/link in `CampusView.js`

**Backend:** ✅ Already implemented in `/backend/routes/campuses.js`

---

### 3. **Edit Student View** - PARTIALLY MISSING
   - ❌ No `EditStudentContainer.js`
   - ❌ No `EditStudentView.js`
   - ❌ No route in `App.js` for `/student/:id/edit`
   - ✅ Redux thunk exists: `editStudentThunk` (in `thunks.js`)
   - ✅ Redux action exists: `EDIT_STUDENT` (in `actionTypes.js`)
   - ✅ Action creator exists: `editStudent` (in `actionCreators.js`)
   - ✅ Reducer case exists for `EDIT_STUDENT` (in `students.js`)
   - ❌ No "Edit Student" button/link in `StudentView.js`

**Backend:** ✅ Already implemented in `/backend/routes/students.js`

---

## 🔴 **MISSING FUNCTIONALITY**

### 4. **Delete Campus Functionality** - PARTIALLY MISSING
   - ✅ Backend route exists (`DELETE /api/campuses/:id`)
   - ❌ Missing Redux thunk: `deleteCampusThunk`
   - ❌ Missing Redux action: `DELETE_CAMPUS`
   - ❌ Missing action creator: `deleteCampus`
   - ❌ Missing reducer case for `DELETE_CAMPUS` in `campuses.js`
   - ❌ No "Delete Campus" button in `AllCampusesView.js`
   - ❌ No "Delete Campus" button in `CampusView.js`

---

### 5. **Add/Remove Students from Campus** - COMPLETELY MISSING
   - ❌ No functionality to add existing students to a campus in `CampusView.js`
   - ❌ No functionality to remove students from a campus in `CampusView.js`
   - ❌ Missing Redux thunks for these operations
   - ❌ Missing backend routes for updating student-campus associations

---

## 🟡 **MISSING UI DISPLAY FEATURES**

### 6. **Campus Images Not Displayed**
   - ❌ `AllCampusesView.js` doesn't display campus images (requirement: show name and image)
   - ❌ `CampusView.js` doesn't display campus image
   - ✅ Model has `imageUrl` field with default value

---

### 7. **Student Images Not Displayed**
   - ❌ `StudentView.js` doesn't display student image
   - ❌ Student images not shown in `AllStudentsView.js` or `CampusView.js`
   - ✅ Model has `imageUrl` field with default value

---

### 8. **Incomplete Student Information Display**
   - ❌ `StudentView.js` only shows name and campus name
   - ❌ Missing: student email, GPA, and image
   - ✅ Model has all required fields: `email`, `gpa`, `imageUrl`

---

### 9. **Incomplete Campus Information Display**
   - ✅ `CampusView.js` shows name, address, description
   - ❌ Missing: campus image

---

## 🟠 **MISSING FORM FEATURES**

### 10. **Incomplete Add Student Form**
   - ❌ `NewStudentView.js` only has: firstname, lastname, campusId
   - ❌ Missing required fields:
     - Email (required, validated)
     - Image URL (optional, with default)
     - GPA (optional, 0.0-4.0)
   - ❌ No form validation with real-time error messages

---

### 11. **Missing Form Validation**
   - ❌ No real-time validation error messages in `NewStudentView.js`
   - ❌ No validation for:
     - Required fields (firstname, lastname, email)
     - Email format
     - GPA range (0.0-4.0)
   - ❌ Missing validation for campus forms (when created)

---

## 🔵 **MISSING ERROR HANDLING**

### 12. **Empty State Handling Issues**
   - ⚠️ `CampusView.js` will crash if `campus.students` is undefined/null
   - ❌ No check for empty students array (should show helpful message)
   - ⚠️ `StudentView.js` will crash if `student.campus` is null
   - ❌ No check for student not enrolled at campus (should show helpful message)
   - ✅ `AllCampusesView.js` has empty state check
   - ✅ `AllStudentsView.js` has empty state check

---

## 🟢 **MINOR UI/UX IMPROVEMENTS NEEDED**

### 13. **Navigation and Links**
   - ✅ Header has navigation links
   - ❌ Home page could be more visually pleasing (currently just "Home Page")
   - ❌ "Add New Campus" button links to wrong route (`/` instead of `/newcampus`)

### 14. **Visual Consistency**
   - ✅ Header component exists
   - ⚠️ Some views use Material-UI, others use plain HTML (inconsistent styling)

---

## 📋 **SUMMARY BY REQUIREMENT**

### ✅ **COMPLETE FEATURES:**
- All Campuses View (basic list display)
- All Students View (with delete functionality)
- Single Campus View (basic display)
- Single Student View (basic display)
- Add Student View (partial - missing fields)
- Backend routes for all CRUD operations
- Database models with all required fields
- Associations between Student and Campus
- Redux setup for students (CRUD operations)
- Navigation header

### ❌ **MISSING FEATURES:**
1. Add Campus View (complete component + Redux)
2. Edit Campus View (complete component + Redux)
3. Edit Student View (component only, Redux exists)
4. Delete Campus (Redux + UI buttons)
5. Add/Remove students from campus
6. Display campus images in views
7. Display student images in views
8. Complete student information display (email, GPA, image)
9. Complete Add Student form (email, imageUrl, GPA fields)
10. Form validation with real-time error messages
11. Empty state handling in CampusView and StudentView

---

## 🔧 **ESTIMATED WORK BREAKDOWN**

### High Priority (Core Requirements):
1. Add Campus View + Redux (2-3 hours)
2. Edit Campus View + Redux (2-3 hours)
3. Edit Student View (1-2 hours)
4. Delete Campus + Redux (1-2 hours)
5. Fix empty state handling (1 hour)
6. Complete Add Student form (1 hour)

### Medium Priority (Display Requirements):
7. Display campus images (1 hour)
8. Display student images (1 hour)
9. Complete StudentView display (30 min)

### Lower Priority (Polish):
10. Form validation (2-3 hours)
11. Add/Remove students from campus (2-3 hours)
12. UI polish and consistency (1-2 hours)

**Total Estimated Time: 15-22 hours**

