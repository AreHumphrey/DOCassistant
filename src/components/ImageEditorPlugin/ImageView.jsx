const ImageViewer = ({ divRef, cvsRef }) => {

  return (
    <div ref={divRef} className="w-full h-full flex justify-center place-items-center">
      <canvas ref={cvsRef} />
    </div>
  );
};

export default ImageViewer;
