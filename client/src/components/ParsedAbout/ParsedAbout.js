import React, { useState, useEffect } from 'react';

const ParsedAbout = () => {
  const [readmeContent, setReadmeContent] = useState('');

  useEffect(() => {
    const readmePath = require('../../assets/about/README.md');
    fetch(readmePath)
      .then(response => response.text())
      .then(data => {
        const formattedData = formatReadmeData(data);
        setReadmeContent(formattedData);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  function formatReadmeData(data) {
    const formattedData = data.replace(/\n/g, '<br />').replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    return formattedData;
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: readmeContent }}></div>
  );
}

export default ParsedAbout;

