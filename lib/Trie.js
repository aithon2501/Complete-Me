import Node from './node';

export default class Trie {
  constructor() {
    this.wordCount = 0;
    this.children = {};
  }

  insert(word) {
    this.addToTrie(this, word);
  }

  addToTrie(node, word) {
    let letter = word.charAt(0);

    if (!node.children[letter]) {
      node.children[letter] = new Node(letter);
    }
    if (word.length === 1) {
      this.wordCount++;
      node.children[letter].completeWord = 1;
    }
    if (word.length > 1) {
      this.addToTrie(node.children[letter], word.slice(1));
    }
  }

  suggest(prefix) {
    const suggestions = [];
    let currentNode = this.traverse(prefix);
    
    if (currentNode) {
      this.addSuggestion(suggestions, currentNode, prefix);
    }
    return suggestions;
  }

  addSuggestion(suggestions, node, prefix) {

    if (node.completeWord) {
      if (node.priority > 0) {
        suggestions.unshift(prefix);
      } else {
        suggestions.push(prefix);
      }
    }
    const childNodes = Object.keys(node.children);

    childNodes.forEach((child) => {
      const newString = prefix + child;

      this.addSuggestion(suggestions, node.children[child], newString);
    });
  }

  traverse(word) {
    let currentNode = this;
    let index = 0;
    let nodesTraversed = 0;
    
    while (index < word.length) {
      if (currentNode.children[word[index]]) {
        currentNode = currentNode.children[word[index]];
        nodesTraversed++;
      }
      index++;
    }
    if (nodesTraversed === word.length) {
      return currentNode;
    } else {
      return null;
    }
  }

  populate(array) {
    array.forEach(word => {
      this.insert(word);
    });
  }

  select(word) {
    let currentNode = this.traverse(word); 

    if (currentNode) {
      currentNode.priority++;
    }
  }
  delete(word) {
    let currentNode = this.traverse(word); 

    if (currentNode) {
      currentNode.completeWord = 0;
    }
  }
}
