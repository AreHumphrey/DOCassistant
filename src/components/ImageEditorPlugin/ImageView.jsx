const ImageViewer = ({ divRef, cvsRef }) => {

  return (
    <div ref={divRef} style={{ width: "500px", height: "500px" }}>
      <canvas ref={cvsRef} />
    </div>
  );
};

export default ImageViewer;
