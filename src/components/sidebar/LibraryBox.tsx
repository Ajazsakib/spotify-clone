import React from 'react';

interface LibraryBoxProps {
  title: string;
  description: string;
  action: string;
}

const LibraryBox = (props: LibraryBoxProps) => {
  return (
    <>
      <h5>{props.title}</h5>
      <p>{props.description}</p>
      <button className="btn btn-primary">{props.action}</button>
    </>
  );
};

export default LibraryBox;
