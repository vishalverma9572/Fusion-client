import React, { useState } from "react";
import { Button, Grid, TextInput,NumberInput, Stack, Select } from "@mantine/core";
import { User, Tag, Building } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, resetForm } from "../../../../redux/formSlice";
import "./AppraisalForm.css";

const AppraisalForm = () => {
  const formData = useSelector((state) => state.form);
  const dispatch = useDispatch();

  const [taughtCourses, setTaughtCourses] = useState([]);
  const [newCourses, setNewCourses] = useState([]);
  const [courseMaterials, setCourseMaterials] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(updateForm({ name, value }));
  };

  const handleTaughtCourseChange = (index, event) => {
    const { name, value } = event.target;
    const newTaughtCourses = [...taughtCourses];
    newTaughtCourses[index][name] = value;
    setTaughtCourses(newTaughtCourses);
  };

  const handleNewCourseChange = (index, event) => {
    const { name, value } = event.target;
    const newNewCourses = [...newCourses];
    newNewCourses[index][name] = value;
    setNewCourses(newNewCourses);
  };

  const handleCourseMaterialChange = (index, field, value) => {
    const newCourseMaterials = [...courseMaterials];
    newCourseMaterials[index][field] = value;
    setCourseMaterials(newCourseMaterials);
  };

  const addTaughtCourse = () => {
    setTaughtCourses([
      ...taughtCourses,
      {
        semester: "",
        coursename: "",
        lecHrs: "",
        tutHrs: "",
        labHrs: "",
        regCount: "",
        instructorInfo: "",
      },
    ]);
  };

  const addNewCourse = () => {
    setNewCourses([
      ...newCourses,
      {  newCourseName: "",
        newCourseNumber:"",
        semesterOfOffering: "",
        yearOfOffering:"",
        newCourseType:"",
      
      
       
      },
    ]);
  };

  const addCourseMaterial = () => {
    setCourseMaterials([
      ...courseMaterials,
      {
        courseMaterialName: "",
        courseMaterialNumber: "",
        courseMaterialType: "",
        activityType: "",
        platform: "",
      },
    ]);
  };
  const [thesisSupervisions, setThesisSupervisions] = useState([
  { studentName: "", thesisTitle: "", registrationYear: "", status: "", coSupervisors: "" }
]);

const handleThesisSupervisionChange = (index, event) => {
  const updatedSupervisions = [...thesisSupervisions];
  updatedSupervisions[index][event.target.name] = event.target.value;
  setThesisSupervisions(updatedSupervisions);
};

const addThesisSupervision = () => {
  setThesisSupervisions([...thesisSupervisions, { studentName: "", thesisTitle: "", registrationYear: "", status: "", coSupervisors: "" }]);
};

const [researchElements, setResearchElements] = useState([
  { description: "", type: "", status: "", transferTechnology: "" }
]);

const handleResearchElementChange = (index, event) => {
  const updatedElements = [...researchElements];
  updatedElements[index][event.target.name] = event.target.value;
  setResearchElements(updatedElements);
};

const addResearchElement = () => {
  setResearchElements([...researchElements, { description: "", type: "", status: "", transferTechnology: "" }]);
};


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form Data:", formData);
    console.log("Taught Courses:", taughtCourses);
    console.log("New Courses:", newCourses);
    console.log("Course Materials:", courseMaterials);
    dispatch(resetForm());
    setTaughtCourses([]);
    setNewCourses([]);
    setCourseMaterials([]);
  };


  return (
    <div className="Appraisal_container">
      <form onSubmit={handleSubmit}>
        <Stack>
          {/* Section 1: Name, Designation */}
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Name"
                placeholder="Name"
                icon={<User size={20} />}
                value={formData.name}
                name="name"
                onChange={handleChange}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Designation"
                placeholder="Designation"
                icon={<Tag size={20} />}
                value={formData.designation}
                name="designation"
                onChange={handleChange}
                required
              />
            </Grid.Col>
          </Grid>

          {/* Section 2: Department */}
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="Department"
                placeholder="Discipline"
                icon={<Building size={20} />}
                value={formData.discipline}
                name="discipline"
                onChange={handleChange}
                required
              />
            </Grid.Col>
          </Grid>

         {/* Courses taught at UG/PG level */}
<label>Courses taught at UG/PG level:</label>
<Button onClick={addTaughtCourse}>Add Course</Button>
<table>
  <thead>
    <tr>
      <th>Semester</th>
      <th>Course Name</th>
      <th>Lecture Hours</th>
      <th>Tutorial Hours</th>
      <th>Lab Hours</th>
      <th>Registered Students</th>
      <th>Instructor Info</th>
    </tr>
  </thead>
  <tbody>
    {taughtCourses.map((course, index) => (
      <tr key={index}>
        <td>
          <TextInput
            placeholder="Semester"
            value={course.semester}
            name="semester"
            onChange={(e) => handleTaughtCourseChange(index, e)}
            required
          />
        </td>
        <td>
          <TextInput
            placeholder="Course Name"
            value={course.coursename}
            name="coursename"
            onChange={(e) => handleTaughtCourseChange(index, e)}
            required
          />
        </td>
        <td>
          <NumberInput
            placeholder="Lecture Hours"
            value={course.lecHrs}
            name="lecHrs"
            onChange={(value) => handleTaughtCourseChange(index, { target: { name: "lecHrs", value } })}
            required
          />
        </td>
        <td>
          <NumberInput
            placeholder="Tutorial Hours"
            value={course.tutHrs}
            name="tutHrs"
            onChange={(value) => handleTaughtCourseChange(index, { target: { name: "tutHrs", value } })}
            required
          />
        </td>
        <td>
          <NumberInput
            placeholder="Lab Hours"
            value={course.labHrs}
            name="labHrs"
            onChange={(value) => handleTaughtCourseChange(index, { target: { name: "labHrs", value } })}
            required
          />
        </td>
        <td>
          <NumberInput
            placeholder="Number of Students"
            value={course.regCount}
            name="regCount"
            onChange={(value) => handleTaughtCourseChange(index, { target: { name: "regCount", value } })}
            required
          />
        </td>
        <td>
          <TextInput
            placeholder="Instructor Info"
            value={course.instructorInfo}
            name="instructorInfo"
            onChange={(e) => handleTaughtCourseChange(index, e)}
            required
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>


         {/* New Courses/labs introduced and taught */}
<label>New Courses/labs introduced and taught:</label>
<Button onClick={addNewCourse}>Add New Course</Button>
<table>
  <thead>
    <tr>
      <th>Course Name</th>
      <th>Course Number</th>
      <th>UG/PG</th>
      <th>Year of Offering</th>
      <th>Semester</th>
    </tr>
  </thead>
  <tbody>
    {newCourses.map((course, index) => (
      <tr key={index}>
        <td>
          <TextInput
            placeholder="Course Name"
            value={course.newCourseName}
            name="newCourseName"
            onChange={(e) => handleNewCourseChange(index, e)}
            required
          />
        </td>
        <td>
          <TextInput
            placeholder="Course Number"
            value={course.newCourseNumber}
            name="newCourseNumber"
            onChange={(e) => handleNewCourseChange(index, e)}
            required
          />
        </td>
        <td>
          <Select
            data={["UG", "PG"]}
            placeholder="UG/PG"
            value={course.newCourseType}
            onChange={(value) => handleCourseMaterialChange(index, "newCourseType", value)}
            required
          />
        </td>
        <td>
          <TextInput
            placeholder="Year"
            value={course.yearOfOffering}
            name="yearOfOffering"
            onChange={(e) => handleNewCourseChange(index, e)}
            required
          />
        </td>
        <td>
          <TextInput
            placeholder="Semester"
            value={course.semesterOfOffering}
            name="semesterOfOffering"
            onChange={(e) => handleNewCourseChange(index, e)}
            required
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>


         {/* New Course Material Developed/instructional software developed */}
<label>New Course Material Developed/instructional software developed:</label>
<Button onClick={addCourseMaterial}>Add Course Material</Button>
<table>
  <thead>
    <tr>
      <th>Course Name</th>
      <th>Course Number</th>
      <th>UG/PG</th>
      <th>Type of Activity</th>
      <th>Platform</th>
    </tr>
  </thead>
  <tbody>
    {courseMaterials.map((coursematerial, index) => (
      <tr key={index}>
        <td>
          <TextInput
            placeholder="Course Name"
            value={coursematerial.courseMaterialName}
            onChange={(e) => handleCourseMaterialChange(index, "courseName", e.target.value)}
            required
          />
        </td>
        <td>
          <TextInput
            placeholder="Course Number"
            value={coursematerial.courseMaterialNumber}
            onChange={(e) => handleCourseMaterialChange(index, "courseMaterialNumber", e.target.value)}
            required
          />
        </td>
        <td>
          <Select
            data={["UG", "PG"]}
            placeholder="UG/PG"
            value={coursematerial.courseMaterialType}
            onChange={(value) => handleCourseMaterialChange(index, "courseMaterialType", value)}
            required
          />
        </td>
        <td>
          <TextInput
            placeholder="Activity Type"
            value={coursematerial.activityType}
            onChange={(e) => handleCourseMaterialChange(index, "activityType", e.target.value)}
            required
          />
        </td>
        <td>
          <Select
            data={["Web", "Public"]}
            placeholder="Platform"
            value={coursematerial.platform}
            onChange={(value) => handleCourseMaterialChange(index, "platform", value)}
            required
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>
          

         {/* Thesis/Research Supervision */}
<label>Thesis/Research Supervision:</label>
<Button onClick={addThesisSupervision}>Add Supervision</Button>
<table>
  <thead>
    <tr>
      <th>Name of Student (M.Tech/PhD)</th>
      <th>Title of Thesis/Topic</th>
      <th>Year and Semester of First Registration</th>
      <th>Completed/Submitted/In Progress</th>
      <th>Co-Supervisors (if any)</th>
    </tr>
  </thead>
  <tbody>
    {thesisSupervisions.map((supervision, index) => (
      <tr key={index}>
        <td>
          <TextInput
            placeholder="Name of Student"
            value={supervision.studentName}
            name="studentName"
            onChange={(e) => handleThesisSupervisionChange(index, e)}
            required
          />
        </td>
        <td>
          <TextInput
            placeholder="Thesis Title"
            value={supervision.thesisTitle}
            name="thesisTitle"
            onChange={(e) => handleThesisSupervisionChange(index, e)}
            required
          />
        </td>
        <td>
          <TextInput
            placeholder="Year and Semester"
            value={supervision.registrationYear}
            name="registrationYear"
            onChange={(e) => handleThesisSupervisionChange(index, e)}
            required
          />
        </td>
        <td>
          <Select
            data={["Completed", "Submitted", "In Progress"]}
            value={supervision.status}
            onChange={(value) => handleThesisSupervisionChange(index, { target: { name: "status", value } })}
            required
          />
        </td>
        <td>
          <TextInput
            placeholder="Co-Supervisors"
            value={supervision.coSupervisors}
            name="coSupervisors"
            onChange={(e) => handleThesisSupervisionChange(index, e)}
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>
{/* Other Research Elements */}
<label>Other Research Elements (such as development of research facilities, patents, etc.):</label>
<Button onClick={addResearchElement}>Add Research Element</Button>
<table>
  <thead>
    <tr>
      <th>Description of Element</th>
      <th>Type (Patent/Research Facility)</th>
      <th>Status (Applied/Granted)</th>
      <th>Transfer of Technology</th>
    </tr>
  </thead>
  <tbody>
    {researchElements.map((element, index) => (
      <tr key={index}>
        <td>
          <TextInput
            placeholder="Description"
            value={element.description}
            name="description"
            onChange={(e) => handleResearchElementChange(index, e)}
            required
          />
        </td>
        <td>
          <Select
            data={["Patent", "Research Facility"]}
            value={element.type}
            onChange={(value) => handleResearchElementChange(index, { target: { name: "type", value } })}
            required
          />
        </td>
        <td>
          <Select
            data={["Applied", "Granted"]}
            value={element.status}
            onChange={(value) => handleResearchElementChange(index, { target: { name: "status", value } })}
            required
          />
        </td>
        <td>
          <TextInput
            placeholder="Transfer of Technology"
            value={element.transferTechnology}
            name="transferTechnology"
            onChange={(e) => handleResearchElementChange(index, e)}
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>

          

          {/* Submit Button */}
          <Button type="submit">Submit</Button>
        </Stack>
      </form>
    </div>
  );
};

export default AppraisalForm;
