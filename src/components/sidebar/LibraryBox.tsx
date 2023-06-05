import React from 'react';

const LibraryBox = (props) => {
  return (
    <>
      <h5>{props.title}</h5>
      <p>{props.description}</p>
      <button className="btn btn-primary">{props.action}</button>
    </>
  );
};

export default LibraryBox;
