const form = document.querySelector('form');
const resultDiv = document.querySelector('.result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const word = form.elements[0].value;
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();

    displayResult(data);

  } catch (error) {
    resultDiv.innerHTML = `<p>Sorry, an error occurred while fetching the word information.</p>`;
  }
});

function displayResult(data) {
  if (data.length === 0) {
    resultDiv.innerHTML = `<p>No results found</p>`;
    return;
  }

  const wordInfo = data[0];
  const cleanWord = wordInfo.word.replace(/[^a-zA-Z ]/g, '');
  let partOfSpeech = '';
  let cleanDefinition = '';
  let cleanExample = '';
  let cleanPhonetics = '';
  let cleanSynonyms = '';

  if (wordInfo.meanings && wordInfo.meanings.length > 0) {
    const meanings = wordInfo.meanings[0];
    partOfSpeech = meanings.partOfSpeech;

    if (meanings.definitions && meanings.definitions.length > 0) {
      const definitions = meanings.definitions[0];
      cleanDefinition = definitions.definition ? definitions.definition.replace(/[^a-zA-Z ]/g, '') : '';
      cleanExample = definitions.example ? definitions.example.replace(/[^a-zA-Z ]/g, '') : '';

      if (definitions.synonyms && definitions.synonyms.length > 0) {
        cleanSynonyms = definitions.synonyms.map(synonym => synonym.replace(/[^a-zA-Z ]/g, '')).join(', ');
      }
    }
  }

  if (wordInfo.phonetics && wordInfo.phonetics.length > 0) {
    cleanPhonetics = wordInfo.phonetics[0].text ? wordInfo.phonetics[0].text.replace(/[^a-zA-Z ]/g, '') : '';
  }

  let resultHTML = `<h2><strong>Word: </strong>${cleanWord}</h2>`;
  if (partOfSpeech) {
    resultHTML += `<p class="partOfSpeech"><strong>Part of Speech: </strong>${partOfSpeech}</p>`;
  }
  if (cleanDefinition) {
    resultHTML += `<p class="Meaning"><strong>Meaning: </strong>${cleanDefinition}</p>`;
  }
  if (cleanExample) {
    resultHTML += `<p class="Example"><strong>Example: </strong>${cleanExample}</p>`;
  } else {
    resultHTML += `<p class="Example"><strong>Example: </strong>Not Found</p>`;
  }
  if (cleanSynonyms) {
    resultHTML += `<p class="Synonyms"><strong>Synonyms: </strong>${cleanSynonyms}</p>`;
  } else {
    resultHTML += `<p class="Synonyms"><strong>Synonyms: </strong>Not Found</p>`;
  }
  if (cleanPhonetics) {
    resultHTML += `<p class="Phonetics"><strong>Phonetics: </strong>${cleanPhonetics}</p>`;
  }

  resultHTML += `<div><button id="speakWordButton">Play Audio</button></div>`;
  resultDiv.innerHTML = resultHTML;

  document.getElementById('speakWordButton').addEventListener('click', () => {
    speakWordInfo(cleanWord, cleanDefinition, cleanExample, cleanPhonetics, cleanSynonyms, partOfSpeech);
  });
}

function speakWordInfo(word, definition, example, phonetics, synonyms, partOfSpeech) {
  let speech = `${word}. `;
  if (partOfSpeech) {
    speech += `Part of Speech: ${partOfSpeech}. `;
  }
  if (definition) {
    speech += `Definition: ${definition}. `;
  }
  if (example) {
    speech += `Example: ${example}. `;
  }
  if (synonyms) {
    speech += `Synonyms: ${synonyms}. `;
  }
  if (phonetics) {
    speech += `Phonetics: ${phonetics}. `;
  }

  responsiveVoice.speak(speech, 'Hindi Female', { rate: 0.8 });
}