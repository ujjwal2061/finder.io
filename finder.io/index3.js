document.addEventListener("DOMContentLoaded", () => {
  const search = document.querySelector(".searching");
  const select = document.querySelector(".btn");
  const pdf = document.querySelector("#fileID");
  const chooseFileDiv = document.querySelector(".container1");
  const pdfViewer = document.querySelector(".pdfViewer");
  const extractedTextDiv = document.getElementById("extractedText");

  // some Chnagge is there to check git 
  // Event listener to open the file dialog
  select.addEventListener('click', function() {
    pdf.click();
  });
  pdf.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
        const fileURL = URL.createObjectURL(file);
       chooseFileDiv.style.display="none";
        const loadingTask = pdfjsLib.getDocument(fileURL);
        loadingTask.promise.then(async (pdfDoc) => {
            let extractedText = "";

            for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
                const page = await pdfDoc.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(" ");
                extractedText += pageText + " ";
            }

            // Display extracted text in the div
            extractedTextDiv.innerHTML = extractedText;
            extractedTextDiv.style.display="block";

            // Show the PDF in the viewer
            // pdfViewer.innerHTML = `<embed src="${fileURL}" width="100%" height="100%">`;
            // chooseFileDiv.style.display = "none";
            // document.getElementById("pdfContainer").style.display = "block";
            // pdfViewer.style.display = "block";
        }).catch((error) => {
            console.error("Error loading PDF:", error);
        });
    } else {
        alert("Invalid file format");
    }
});

// Event listener to handle the search input
search.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        const searchTerm = search.value.trim();
        if (extractedTextDiv.innerHTML.includes(searchTerm)) {
            // Highlight the search term in the extracted text
            const highlightedText = extractedTextDiv.innerHTML.replace(new RegExp(searchTerm, 'gi'), (match) => `<span class="highlight">${match}</span>`);
            extractedTextDiv.innerHTML = highlightedText; // Display highlighted text
        } else {
            alert(`The term "${searchTerm}" was not found in the PDF.`);
        }

        search.value = "";
    }
});
});
