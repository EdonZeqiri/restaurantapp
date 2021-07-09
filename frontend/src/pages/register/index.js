import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Form, ToggleButton } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Layout from "../../components/Layout";
import { signup } from "../../redux/actions/auth/registerActions";

function Index() {
  const radios = [{ name: "user" }, { name: "owner" }];
  const dispatch = useDispatch();

  const [role, setRole] = useState("");

  const intialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    role: role,
  };

  const created = useSelector((state) => state.register.created);
  const [formValues, setFormValues] = useState(intialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fname, setFname] = useState("");

  const submit = () => {
    const { email, password } = formValues;
    let temp = role;

    const user = {
      name: fname,
      email,
      password,
      role: temp,
    };
    dispatch(signup(user));
  };

  const history = useHistory();

  useEffect(() => {
    if (created) {
      history.push("/login");
    }
  }, [created]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  //form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmitting(true);
  };

  //form validation handler
  const validate = (values) => {
    let errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!values.email) {
      errors.email = "Cannot be blank";
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid username format";
    }

    if (!values.password) {
      errors.password = "Cannot be blank";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Cannot be blank";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Password confirmation does not match";
    }

    return errors;
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      submit();
    }
  }, [formErrors]);

  // if (auth.authenticate) {
  //   return <Redirect to={`/restaurants`} />;
  // }
  return (
    <Layout>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="fname"
            name="fname"
            placeholder="Enter Name"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
          />
          {formErrors.email && (
            <span className="error">{formErrors.email}</span>
          )}
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={formValues.email}
            onChange={handleChange}
          />
          {formErrors.email && (
            <span className="error">{formErrors.email}</span>
          )}
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={formValues.password}
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter Password"
          />
          {formErrors.password && (
            <span className="error">{formErrors.password}</span>
          )}
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            value={formValues.confirmPassword}
            onChange={handleChange}
            type="password"
            name="confirmPassword"
            placeholder="Enter Password"
          />
          {formErrors.confirmPassword && (
            <span className="error">{formErrors.confirmPassword}</span>
          )}
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <ButtonGroup toggle>
            {radios.map((radio, idx) => (
              <ToggleButton
                key={idx}
                type="radio"
                variant="secondary"
                name="radio"
                value={radio.name}
                checked={role === radio.name}
                onChange={(e) => setRole(e.target.value)}
              >
                {radio.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          style={{ marginTop: "10px" }}
          onClick={handleSubmit}
        >
          Sign Up
        </Button>
      </Form>
    </Layout>
  );
}

export default Index;
