// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./imagedrop.css";

interface Props {
  file: any;
  setFile: any;
}

function ImageDrop({ file: files, setFile: setFiles }: Props) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <div className="thumb" key={file.name}>
      <div className="thumbInner">
        <img
          src={file.preview}
          className="pimg"
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <section className="container upload-container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>یک عکس برای هدر مقاله خود به این مکان بکشید یا کلیک کنید</p>
      </div>
      <aside className="thumbsContainer">{thumbs}</aside>
    </section>
  );
}

export default ImageDrop;
