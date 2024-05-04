import { Button } from 'react-bootstrap';

const FileImporter = ({ onFileContentChange }) => {
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
        <>
            <Button onClick={() => document.getElementById('file-input').click()}>Choose File</Button>
            <input id="file-input" type="file" accept=".txt" onChange={handleFileChange} />
        </>
    );
};

export default FileImporter;
