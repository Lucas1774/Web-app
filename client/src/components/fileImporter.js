function FileImporter({ onFileContentChange }) {

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            const content = fileReader.result;
            const stringifiedContent = JSON.stringify(content);
            onFileContentChange(stringifiedContent);
        };
        fileReader.readAsText(file);
    };

    return (
        <div>
            <label for="file-input" class="btn btn-primary forFileInput">Choose File</label>
            <input id="file-input" type="file" accept=".txt" onChange={handleFileChange} />
        </div>
    );
}

export default FileImporter;
