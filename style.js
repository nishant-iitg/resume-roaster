// style.js
document.getElementById('roastBtn').addEventListener('click', async () => {
  const file = document.getElementById('resumeUpload').files[0];
  if (!file) return alert('Upload a resume first!');

  const text = await file.text();
  const roastBtn = document.getElementById('roastBtn');
  roastBtn.innerHTML = 'Roasting...';
  roastBtn.disabled = true;

  try {
    const response = await fetch('/.netlify/functions/roast', {
      method: 'POST',
      body: JSON.stringify({ text: text.substring(0, 2000) })  // Limit input
    });
    const { roast } = await response.json();
    
    document.getElementById('roastText').innerText = roast;
    document.getElementById('result').classList.remove('hidden');
  } catch (error) {
    alert('Roast failed! Try again later.');
  } finally {
    roastBtn.innerHTML = 'Roast Me!';
    roastBtn.disabled = false;
  }
});

// Share button
document.getElementById('shareBtn').addEventListener('click', () => {
  const roast = document.getElementById('roastText').innerText;
  navigator.clipboard.writeText(`My resume roast:\n\n${roast}\n\nTry yours: [YOUR_SITE_URL]`);
  alert('Copied to clipboard! Share it on Twitter/LinkedIn');
}); 
