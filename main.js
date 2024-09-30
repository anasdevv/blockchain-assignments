import { SecureBox } from './secure.box.js';

const secureBox = new SecureBox();

console.log('1. Adding files');
const file1Proof = secureBox.addFile('file1.txt', 'Hello, World!');
const file2Proof = secureBox.addFile('file2.txt', 'SecureBox is awesome!');
const file3Proof = secureBox.addFile('file3.txt', 'Merkle Trees for the win!');

console.log('Added file1.txt - Proof:', file1Proof);
console.log('Added file2.txt - Proof:', file2Proof);
console.log('Added file3.txt - Proof:', file3Proof);

console.log('\n2. Listing files');
console.log('Files:', secureBox.listFiles());

console.log('\n3. Retrieving a file');
const { file: retrievedFile, proof: retrievalProof } =
  secureBox.getFile('file2.txt');
console.log('Retrieved file2.txt:', retrievedFile);
console.log('Retrieval Proof:', retrievalProof);

console.log('\n4. Verifying retrieval');
const digestAfterAdd = secureBox.getDigest();
console.log('Current Digest:', digestAfterAdd);
console.log(
  'Proof Verification:',
  secureBox.verifyProof(retrievalProof, retrievedFile, digestAfterAdd)
);

console.log('\n5. Editing a file');
const editProof = secureBox.editFile(
  'file2.txt',
  'SecureBox is even more awesome now!'
);
console.log('Edit Proof:', editProof);

console.log('\n6. Verifying the edit');
const { file: editedFile, proof: editedProof } = secureBox.getFile('file2.txt');
console.log('Edited file2.txt:', editedFile);
const digestAfterEdit = secureBox.getDigest();
console.log('New Digest after edit:', digestAfterEdit);
console.log(
  'Edit Verification:',
  secureBox.verifyProof(editedProof, editedFile, digestAfterEdit)
);

console.log('\n7. Attempting to retrieve a non-existent file');
const nonExistentResult = secureBox.getFile('non-existent.txt');
console.log('Non-existent file result:', nonExistentResult);

console.log('\n8. Deleting a file');
const deleteProof = secureBox.deleteFile('file3.txt');
console.log('Delete Proof:', deleteProof);

console.log('\n9. Verifying deletion');
const digestAfterDelete = secureBox.getDigest();
console.log('New Digest after delete:', digestAfterDelete);
const deletedFileResult = secureBox.getFile('file3.txt');
console.log('Deleted file retrieval result:', deletedFileResult);

console.log('\n10. Final list of files');
console.log('Files:', secureBox.listFiles());
