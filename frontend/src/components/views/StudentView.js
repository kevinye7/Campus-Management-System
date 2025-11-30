/*==================================================
StudentView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the single student view page.
================================================== */
import { Link } from "react-router-dom";

const StudentView = (props) => {
  const { student } = props;

  // Render a single Student view 
  return (
    <div>
      <h1>{student.firstname + " " + student.lastname}</h1>
      {student.imageUrl && (
        <img src={student.imageUrl} alt={student.firstname + " " + student.lastname} style={{width: '300px', height: '300px', objectFit: 'cover'}} />
      )}
      <p><strong>Email:</strong> {student.email}</p>
      {student.gpa !== null && student.gpa !== undefined && (
        <p><strong>GPA:</strong> {student.gpa}</p>
      )}
      {student.campus ? (
        <p>
          <strong>Campus:</strong> <Link to={`/campus/${student.campus.id}`}>{student.campus.name}</Link>
        </p>
      ) : (
        <p><strong>Campus:</strong> Not enrolled at any campus</p>
      )}
    </div>
  );

};

export default StudentView;