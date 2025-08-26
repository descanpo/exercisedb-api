import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting URL update process...');

// Orijinal exercises.json dosyasını oku
const originalFilePath = path.join(__dirname, 'exercises.json');
console.log('Reading original file:', originalFilePath);
const originalData = JSON.parse(fs.readFileSync(originalFilePath, 'utf8'));

console.log('Original data loaded, total exercises:', originalData.length);

// URL'leri güncelle
const updatedData = originalData.map(exercise => {
  if (exercise.gifUrl && exercise.gifUrl.includes('static.exercisedb.dev/media/')) {
    // GIF dosya adını çıkar
    const gifFileName = exercise.gifUrl.split('/').pop();
    // Yeni GitHub raw URL'i oluştur
    exercise.gifUrl = `https://raw.githubusercontent.com/descanpo/exercisedb-api/refs/heads/main/media/${gifFileName}`;
  }
  return exercise;
});

console.log('URLs updated successfully');

// Yeni dosyayı oluştur (orijinal formatı koruyarak - 2 space indentation)
const newFilePath = path.join(__dirname, 'exercises_updated.json');
console.log('Writing updated file:', newFilePath);
fs.writeFileSync(newFilePath, JSON.stringify(updatedData, null, 2), 'utf8');

console.log(`✅ Updated ${updatedData.length} exercises`);
console.log(`✅ Created new file: exercises_updated.json`);
console.log('Process completed successfully!');
