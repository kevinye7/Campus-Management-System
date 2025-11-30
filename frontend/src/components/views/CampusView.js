/*==================================================
CampusView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display a single campus and its students (if any).
================================================== */
import { Link } from "react-router-dom";

// Take in props data to construct the component
const CampusView = (props) => {
  const {campus} = props;
  
  // Render a single Campus view with list of its students
  return (
    <div>
      <h1>{campus.name}</h1>
      {campus.imageUrl && (
        <img src={campus.imageUrl} alt={campus.name} style={{width: '400px', height: '300px', objectFit: 'cover'}} />
      )}
      <p>{campus.address}</p>
      <p>{campus.description}</p>
      <h2>Enrolled Students:</h2>
      {campus.students && campus.students.map( student => {
        let name = student.firstname + " " + student.lastname;
        return (
          <div key={student.id}>
            <Link to={`/student/${student.id}`}>
              {student.imageUrl && (
                <img src={student.imageUrl} alt={name} style={{width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px'}} />
              )}
              <h3>{name}</h3>
            </Link>             
          </div>
        );
      })}
      {(!campus.students || campus.students.length === 0) && (
        <p>No students enrolled at this campus.</p>
      )}
    </div>
  );
};

export default CampusView;