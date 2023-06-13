import * as yup from 'yup';

const validationSchema = yup.object().shape({
  artist: yup.string().required('Artist name is required'),
  category: yup.string().required('Select Category'),
  title: yup.string().required('Artist name is required'),
  songUrl: yup.mixed().required('File is required'),
});

export default validationSchema;
