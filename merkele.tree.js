import crypto from 'crypto';
export class MerkleTree {
  constructor() {
    this.leaves = [];
    this.levels = [];
  }

  addLeaf(data) {
    const leaf = this.hash(JSON.stringify(data));
    this.leaves.push(leaf);
    this.levels = [this.leaves];
    this.buildTree();
  }

  buildTree() {
    while (this.levels[0].length > 1) {
      const level = [];
      for (let i = 0; i < this.levels[0].length; i += 2) {
        if (i + 1 < this.levels[0].length) {
          level.push(this.hash(this.levels[0][i] + this.levels[0][i + 1]));
        } else {
          level.push(this.levels[0][i]);
        }
      }
      this.levels.unshift(level);
    }
  }

  getRoot() {
    return this.levels[0][0];
  }

  getProof(index) {
    const proof = [];
    for (let i = this.levels.length - 1; i > 0; i--) {
      const isRightNode = index % 2 === 0;
      const siblingIndex = isRightNode ? index - 1 : index + 1;

      if (siblingIndex < this.levels[i].length) {
        proof.push({
          position: isRightNode ? 'left' : 'right',
          data: this.levels[i][siblingIndex],
        });
      }

      index = Math.floor(index / 2);
    }
    return proof;
  }

  hash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
