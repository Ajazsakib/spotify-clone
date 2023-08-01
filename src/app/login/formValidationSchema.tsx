import * as yup from 'yup';
const emailRegex = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email')
    .matches(emailRegex, 'Invalid Email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(30, 'Password must be less than 30')
    .required('Password is required'),
  // confirmPassword: yup.string()
  //   .oneOf([yup.ref('password'), null], 'Passwords must match')
  //   .required('Confirm Password is required'),
});

export default loginValidationSchema;
