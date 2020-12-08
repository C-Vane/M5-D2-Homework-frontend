import React from "react";
import { Button, Container, Table, Spinner, Modal, Form, Alert } from "react-bootstrap";

class Main extends React.Component {
  state = {
    form: {
      Name: "",
      Surname: "",
      Email: "",
      DateofBirth: "",
    },
    students: [],
    loaded: false,
    modal: false,
    modalAdd: true,
    currentId: "",
    status: "",
    variant: "success",
    Email: "",
  };
  componentDidMount = () => {
    setTimeout(() => {
      this.getStudents();
    }, 1000);
  };
  //GET ALL STUDENTS
  getStudents = async () => {
    try {
      const response = await fetch("http://localhost:3001/students/");
      if (response.ok) {
        let students = await response.json();
        this.setState({ students, loaded: true, variant: "success" });
        setTimeout(() => {
          this.setState({ status: "" });
        }, 2000);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  /* getStudentByID = async (id) => {
    try {
      const response = await fetch("http://localhost:3001/students/");
      if (response.ok) {
        let result = await response.json();
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  }; */
  //ADD NEW STUDENT
  postStudent = async () => {
    try {
      const response = await fetch("http://localhost:3001/students/", {
        method: "POST",
        body: JSON.stringify(this.state.form),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
      if (response.ok) {
        this.setState({
          form: {
            Name: "",
            Surname: "",
            Email: "",
            DateofBirth: "",
          },
          status: "New Student successfully Added",
          modal: false,
          loaded: false,
        });
        setTimeout(() => {
          this.getStudents();
        }, 1000);
      } else {
        console.log(response.statusText);
        alert(response.body);
        this.setState({ status: response.statusText, variant: "danger" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  //EDIT STUDENT
  putStudent = async (id) => {
    try {
      const response = await fetch("http://localhost:3001/students/" + id, {
        method: "PUT",
        body: JSON.stringify(this.state.form),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
      if (response.ok) {
        this.setState({
          form: {
            Name: "",
            Surname: "",
            Email: "",
            DateofBirth: "",
          },
          modal: false,
          currentId: "",
          loaded: false,
          status: "Student data successfully edited",
        });
        setTimeout(() => {
          this.getStudents();
        }, 1000);
      } else {
        console.log(await response.statusText);
        this.setState({ status: response.statusText, variant: "danger" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  deleteStudent = async (id) => {
    try {
      const response = await fetch("http://localhost:3001/students/" + id, {
        method: "DELETE",
      });
      if (response.ok) {
        this.setState({ status: "Student has been successfully deleted", loaded: false });
        setTimeout(() => {
          this.getStudents();
        }, 1000);
      } else {
        console.log(response.body);
      }
    } catch (error) {
      console.log(error);
    }
  };
  handelChange = (e) => {
    let form = { ...this.state.form };
    let currentId = e.currentTarget.id;
    if (currentId === "EmailCheck") this.setState({ Email: e.currentTarget.value });
    else {
      form[currentId] = e.currentTarget.value;
      this.setState({ form });
    }
  };

  handelSubmit = (event) => {
    event.preventDefault();
    let id = this.state.currentId;
    this.state.modalAdd ? this.postStudent() : this.putStudent(id);
  };
  editStudent = (id) => {
    const currentStudent = this.state.students.filter((student) => student.id === id);
    const form = { ...this.state.form };
    form.Name = currentStudent[0].Name;
    form.Surname = currentStudent[0].Surname;
    form.Email = currentStudent[0].Email;
    form.DateofBirth = currentStudent[0].DateofBirth;
    console.log(form);
    this.setState({ form, modalAdd: false, currentId: id });
    this.editModalToggleHandler();
  };
  editModalToggleHandler = () => {
    this.state.modal ? this.setState({ modal: false, modalAdd: true }) : this.setState({ modal: true });
  };

  //CHECK EMAIL
  checkEmail = async (event) => {
    event.preventDefault();
    console.log(this.state.Email);
    let body = {
      Email: this.state.Email,
    };
    try {
      const response = await fetch("http://localhost:3001/students/checkEmail", {
        method: "POST",
        body: JSON.stringify(body),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });

      if (response.status !== 210) {
        this.setState({
          Email: "",
          status: "No other student has this Email",
        });
        setTimeout(() => {
          this.setState({ status: "" });
        }, 1500);
      } else {
        this.setState({
          Email: "",
          status: "Email has already been used",
          variant: "danger",
        });
        setTimeout(() => {
          this.setState({ status: "", variant: "success" });
        }, 1500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { loaded, students, form } = this.state;
    return (
      <>
        <Container>
          <h1>Students Portfolio Repo</h1>
          <section>
            <h2>Students List</h2>
            <Button variant='warning' onClick={() => this.editModalToggleHandler()}>
              Add Student
            </Button>
            {this.state.status.length > 0 && <Alert variant={this.state.variant}>{this.state.status}</Alert>}
            {loaded ? (
              <Table striped bordered hover variant='dark'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Date of birth</th>
                    <th>Edit/Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{student.Name}</td>
                      <td>{student.Surname}</td>
                      <td>{student.Email}</td>
                      <td>{student.DateofBirth}</td>
                      <td>
                        <Button variant='warning' onClick={() => this.editStudent(student.id)}>
                          Edit
                        </Button>
                        <Button onClick={() => this.deleteStudent(student.id)} variant='danger'>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Spinner animation='border' role='status'>
                <span className='sr-only'>Loading...</span>
              </Spinner>
            )}
          </section>
          <div>
            <h2>Check Email</h2>
            <Form onSubmit={this.checkEmail}>
              <Form.Group>
                <Form.Label>Check Email</Form.Label>
                <Form.Control type='text' id='EmailCheck' value={this.state.Email} onChange={this.handelChange} />
              </Form.Group>
            </Form>
          </div>
        </Container>
        <Modal show={this.state.modal} onHide={this.editModalToggleHandler}>
          <Form onSubmit={this.handelSubmit}>
            <Modal.Header closeButton onClick={this.editModalToggleHandler}>
              <Modal.Title>{this.state.modalAdd ? "Add Student" : "Edit Student"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type='text' id='Name' value={form.Name} onChange={this.handelChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Surname</Form.Label>
                <Form.Control type='text' id='Surname' value={form.Surname} onChange={this.handelChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' id='Email' value={form.Email} onChange={this.handelChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control type='text' id='DateofBirth' value={form.DateofBirth} onChange={this.handelChange} />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.editModalToggleHandler} variant='secondary'>
                Cancel
              </Button>
              <Button variant='primary' type='submit'>
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Main;
