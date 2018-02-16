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
      node.children[letter].completeWord = true;
    }
    if (word.length > 1) {
      this.addToTrie(node.children[letter], word.slice(1));
    }
  }

  suggest(prefix) {
    //suggest takes in the "prefix" parameter, which represents a user's incomplete input.
    const suggestions = [];
    let currentNode = this.traverse(prefix);
    //here the method will set the currentNode to equal the first available node(s) after the prefix.
    //please refer to the "traverse" method on lines 58 thru 75. 
    
    if (currentNode) {
      this.addSuggestion(suggestions, currentNode, prefix);
      //this conditional states that if the currentNode exists, i.e there is a node or nodes after the prefix, then it will invoke the "addSuggestion" method
    }
    return suggestions;
    //i feel like i should be able to take the "suggestions" array out of this method altogether and use it only in "addSuggestion", but each time i've tried, it breaks the code in a way that i have not been able to fix. 
  }

  addSuggestion(suggestions, node, prefix) {

    if (node.completeWord) {
      if (node.priority > 0) {
        suggestions.unshift(prefix);
      } else {
        suggestions.push(prefix);
      }
      //in this conditional, the method checks to see if the currentNode (which it was passed from the previous method) has a property of "completeWord". if it does, then it will also check to see if the "priority" property of the node is more than 0. if it is, then the method will unshift the complete word to the front of the suggestions array. if not, then the method will push the word to the end of the array. 
    }
    const childNodes = Object.keys(node.children);

    childNodes.forEach((child) => {
      const newString = prefix + child;
      //here, the method sets the constant of "childNodes" to the object keys of the node, and then iterates over the nodes, concatinating the prefix with the value of the child node. 

      this.addSuggestion(suggestions, node.children[child], newString);
      //the result of the concatination, called "newString", is then passed back into the function until the complete words are pushed into the suggestions array. 
    });
  }

  traverse(word) {
    let currentNode = this;
    let index = 0;
    let nodesTraversed = 0;
    //traverse takes in a parameter of "word", which just represents a string of letters, whether it's the prefix from the addSuggestions method or the word passed in from the "select" or "delete" methods. It also defines the currentNode, and counters for the index of the while loop and the number of nodes that the method has travelled overall.

    while (index < word.length) {
      if (currentNode.children[word[index]]) {
        currentNode = currentNode.children[word[index]];
        nodesTraversed++;
        //this loop states that while the index counter is less than the legnth of the passed in "word", it will initiate a conditional. The conditional states that if the currentNode and it's children at the index of the word exists, then the variable of currentNode will be reassigned to match the child node at the index of the word, thus advancing the method down the trie.
      }
      index++;
    }
    if (nodesTraversed === word.length) {
      return currentNode;
    } else {
      return null;
    }
    //finally, this condition checks to see if the number of nodesTraversed by the method is equal to the word. Of so, then it will return the currentNode. if not, it will return null. this controls what the method returns to ensure that it is an actual word in the array and not a partial or misspelled word. 
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
      currentNode.completeWord = false;
    }
  }
}
