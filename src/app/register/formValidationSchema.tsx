import * as yup from 'yup';
const emailRegex = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
const validationSchema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[A-Za-z ]*$/, 'Please enter valid name')
    .max(40, 'Name length must be less than 40')
    .required('Name is required'),
  email: yup
    .string()
    .email('Invalid email')
    .matches(emailRegex, 'Invalid Email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(30, 'password must be less than 30 words')
    .required('Password is required'),
  // confirmPassword: yup.string()
  //   .oneOf([yup.ref('password'), null], 'Passwords must match')
  //   .required('Confirm Password is required'),
});

export default validationSchema;
