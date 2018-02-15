export default class Trie {
  constructor() {
    this.wordCount = 0;
    this.children = {};
  }
  
  suggest(prefix) {
    const suggestions = [];
    // let index = 0;
    let currentNode = this.traverse(prefix;
  
    // while (index < prefix.length) {
    //   if (currentNode.children[prefix[index]]) {
    //     currentNode = currentNode.children[prefix[index]];
    //   }
    //   index++;
    // }
  
    this.addSuggestion(suggestions, currentNode, prefix);
    return suggestions;
  }
  addSuggestion(suggestions, node, prefix) {

    if (node.completeWord) {
      if (node.popularity === 0) {
        suggestions.push(prefix);
      } else {
        suggestions.unshift(prefix);
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

    for (let i = 0; i < word.length; i++) {
      if (currentNode.children[word[i]]) {
        currentNode = currentNode.children[word[i]];
      }
    }

    return currentNode;
  }


}