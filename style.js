document.addEventListener('DOMContentLoaded', () => {
  const roastBtn = document.getElementById('roastBtn');
  const btnText = document.getElementById('btnText');
  const spinner = document.getElementById('spinner');
  const resultDiv = document.getElementById('result');
  const errorAlert = document.getElementById('errorAlert');
  const fileInfo = document.getElementById('fileInfo');
  const fileName = document.getElementById('fileName');
  const fileSize = document.getElementById('fileSize');
  const filePreview = document.getElementById('filePreview');

  // File input handling
  const resumeUpload = document.getElementById('resumeUpload');
  resumeUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      // Update file info
      fileInfo.classList.remove('hidden');
      fileName.textContent = file.name;
      fileSize.textContent = `${(file.size / 1024).toFixed(1)} KB`;

      // Handle PDF preview
      if (file.type === 'application/pdf') {
        filePreview.classList.remove('hidden');
        filePreview.innerHTML = `
          <iframe src="${URL.createObjectURL(file)}#view=FitH" frameborder="0"></iframe>
        `;
      } else {
        filePreview.classList.add('hidden');
      }
    } else {
      // Reset file info
      fileInfo.classList.add('hidden');
      fileName.textContent = 'No file selected';
      fileSize.textContent = '0 KB';
      filePreview.classList.add('hidden');
    }
  });

  roastBtn.addEventListener('click', async () => {
    const file = resumeUpload.files[0];
    if (!file) {
      showError('Please upload a resume first!');
      return;
    }

    // Show loading state
    btnText.textContent = 'Roasting...';
    spinner.classList.remove('hidden');
    roastBtn.disabled = true;
    errorAlert.classList.add('hidden');

    try {
      const text = await readFileAsText(file);
      const response = await fetchRoast(text);
      
      if (response.error) {
        throw new Error(response.error);
      }

      document.getElementById('roastText').textContent = response.roast;
      resultDiv.classList.remove('hidden');
    } catch (error) {
      showError(error.message || 'Failed to generate roast. Try again later.');
    } finally {
      btnText.textContent = 'Roast Me!';
      spinner.classList.add('hidden');
      roastBtn.disabled = false;
    }
  });

  document.getElementById('shareBtn').addEventListener('click', () => {
    const roast = document.getElementById('roastText').textContent;
    navigator.clipboard.writeText(`My resume roast:\n\n${roast}\n\nTry yours: ${window.location.href}`)
      .then(() => alert('Roast copied! Share it anywhere.'))
      .catch(() => showError('Failed to copy to clipboard'));
  });

  // Helper functions
  async function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  async function fetchRoast(text) {
    const response = await fetch('/.netlify/functions/roast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.substring(0, 2000) })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  function showError(message) {
    document.getElementById('errorText').textContent = message;
    errorAlert.classList.remove('hidden');
  }
});