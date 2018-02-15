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
    let letter = word[0];

    if(!node.children[letter]) {
      node.children[letter] = new Node(letter);
    }
    if(word.length === 1) {
      this.wordCount++;
      node.children[letter].completeWord = 1;
    }
    if(word.length > 1) {
      this.addToTrie(node.children[letter], word.slice(1));
    }
  }
  
  suggest(prefix) {
    const suggestions = [];
    let currentNode = this.traverse(prefix);
    const addSuggestion = (node, prefix) => {
      
      if (node.completeWord) {
        if (node.completeWord > 1) {
          suggestions.unshift(prefix);
        } else {
          suggestions.push(prefix);
        }
      }

      const childNodes = Object.keys(node.children);
  
      childNodes.forEach((child) => {
        const newString = prefix + child;
  
        addSuggestion(node.children[child], newString);
      });
    };

    addSuggestion(currentNode, prefix);
  
    return suggestions;
  }


  traverse(word) {
    let currentNode = this;

    for (let i = 0; i < word.length; i++) {
      if (currentNode.children[word[i]]) {
        currentNode = currentNode.children[word[i]];
      }
    }

    return currentNode;
  }

  populate(array) {
    array.forEach(word => {
      this.insert(word);
    });
  }

  select(word) {
    let currentNode = this.traverse(word); 

    currentNode.completeWord++;
  }

  delete(word) {
    let currentNode = this.traverse(word); 

    currentNode.completeWord = 0;
  }
}
