import { MerkleTree } from './merkele.tree.js';

export class SecureBox {
  constructor() {
    this.merkleTree = new MerkleTree();
    this.files = [];
  }

  addFile(name, content) {
    const file = { name, content, timestamp: Date.now() };
    const index = this.findInsertionIndex(name);
    this.files.splice(index, 0, file);
    this.updateMerkleTree();
    return this.getProof(index);
  }

  getFile(name) {
    const index = this.findFileIndex(name);
    if (index === -1) {
      return { exists: false, proof: this.getNonExistenceProof(name) };
    }
    return {
      exists: true,
      file: this.files[index],
      proof: this.merkleTree.getProof(index),
    };
  }

  editFile(name, newContent) {
    const index = this.findFileIndex(name);
    if (index === -1) return null;
    this.files[index].content = newContent;
    this.files[index].timestamp = Date.now();
    this.updateMerkleTree();
    return this.getProof(index);
  }

  deleteFile(name) {
    const index = this.findFileIndex(name);
    if (index === -1) return null;
    this.files.splice(index, 1);
    this.updateMerkleTree();
    return this.getNonExistenceProof(name);
  }

  listFiles() {
    return this.files.map((file) => file.name);
  }

  getDigest() {
    return this.merkleTree.getRoot();
  }

  findFileIndex(name) {
    return this.files.findIndex((file) => file.name === name);
  }

  findInsertionIndex(name) {
    return this.files.findIndex((file) => file.name > name);
  }

  updateMerkleTree() {
    this.merkleTree = new MerkleTree();
    this.files.forEach((file) => this.merkleTree.addLeaf(file));
  }

  getProof(index) {
    return this.merkleTree.getProof(index);
  }

  getNonExistenceProof(name) {
    const index = this.findInsertionIndex(name);
    if (index === 0) {
      return this.merkleTree.getProof(0);
    }
    if (index === this.files.length) {
      return this.merkleTree.getProof(this.files.length - 1);
    }
    return {
      left: this.merkleTree.getProof(index - 1),
      right: this.merkleTree.getProof(index),
    };
  }

  verifyProof(proof, leaf, root) {
    let computedHash = this.merkleTree.hash(JSON.stringify(leaf));
    for (const { position, data } of proof) {
      if (position === 'left') {
        computedHash = this.merkleTree.hash(data + computedHash);
      } else {
        computedHash = this.merkleTree.hash(computedHash + data);
      }
    }
    return computedHash === root;
  }
}
