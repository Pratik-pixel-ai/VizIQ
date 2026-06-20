export default function UploadSection({
    setFile,
    uploadFile
}) {

    return (
        <>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />

        <button onClick={uploadFile}>
          Upload CSV
        </button>
      </div>


        </>
    );
}