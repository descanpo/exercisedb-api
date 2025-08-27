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

// Özel JSON formatı (orijinal formatı koruyarak)
function formatExerciseJson(data) {
  const items = data.map(exercise => {
    // Her bir exercise objesini özel formatlama
    const lines = [];
    lines.push('  {');
    lines.push(`    "exerciseId": "${exercise.exerciseId}",`);
    lines.push(`    "name": "${exercise.name}",`);
    lines.push(`    "gifUrl": "${exercise.gifUrl}",`);
    lines.push(`    "targetMuscles": ${JSON.stringify(exercise.targetMuscles)},`);
    lines.push(`    "bodyParts": ${JSON.stringify(exercise.bodyParts)},`);
    lines.push(`    "equipments": ${JSON.stringify(exercise.equipments)},`);
    lines.push(`    "secondaryMuscles": ${JSON.stringify(exercise.secondaryMuscles)},`);
    
    // Instructions array'i özel formatlama
    if (exercise.instructions && exercise.instructions.length > 0) {
      lines.push('    "instructions": [');
      exercise.instructions.forEach((instruction, index) => {
        const comma = index < exercise.instructions.length - 1 ? ',' : '';
        lines.push(`      "${instruction}"${comma}`);
      });
      lines.push('    ]');
    } else {
      lines.push('    "instructions": [');
      lines.push('    ]');
    }
    
    lines.push('  }');
    return lines.join('\n');
  });
  
  return '[\n' + items.join(',\n') + '\n]';
}

// Yeni dosyayı oluştur (orijinal formatı koruyarak)
const newFilePath = path.join(__dirname, 'exercises_updated.json');
console.log('Writing updated file:', newFilePath);
fs.writeFileSync(newFilePath, formatExerciseJson(updatedData), 'utf8');

console.log(`✅ Updated ${updatedData.length} exercises`);
console.log(`✅ Created new file: exercises_updated.json`);
console.log('Process completed successfully!');
