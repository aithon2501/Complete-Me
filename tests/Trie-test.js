import Trie from "../lib/Trie";
import { expect } from 'chai';
import Node from '../lib/Node.js';
import fs from 'fs';

const text = "/usr/share/dict/words"
const dictionary = fs.readFileSync(text).toString().trim().split('\n')

describe('Trie', () => {
  let trie;

  beforeEach(() =>{
    trie = new Trie();
  })

  it('should exist', () => {
    expect(trie).to.exist;
  })

  it('should be an instance of Trie', () => {
    expect(trie).to.be.an.instanceOf(Trie);
  })

  describe('insert', () => {

    it('should take in a word', () => {
      trie.insert('pizza');
      expect(trie.wordCount).to.equal(1);
    });

    it('should keep track of the number of words inserted', () => {
      expect(trie.wordCount).to.equal(0);
      trie.insert('pizza');
      expect(trie.wordCount).to.equal(1);
      trie.insert('apple');
      expect(trie.wordCount).to.equal(2);
    });

    it('should add words to the trie', () => {
      trie.insert('pizza');
      trie.insert('piano');
      trie.insert('dog');
      trie.insert('dogs');

      expect(trie.children['p'].children['i'].children['z']).to.exist;
      expect(trie.children['p'].children['i'].children['a']).to.exist;
      expect(trie.children['d'].children['o'].children['g'].completeWord).to.equal(true);
    })

    it('should create keys in children object of first letter', () => {
      trie.insert('pizza');
      trie.insert('cat');
      trie.insert('piano');
      expect(Object.keys(trie.children)).to.deep.equal(['p','c'])
    })

    it('should create only one node after inserting two words with the same first letter', () => {
      expect(Object.keys(trie.children)).to.deep.equal([]);
      trie.insert('pizza');
      expect(Object.keys(trie.children)).to.deep.equal(['p']);
      trie.insert('party');
      expect(Object.keys(trie.children)).to.deep.equal(['p']);
    })

    it('should create two different nodes for words inserted with the same letter but one is capitalized', () => {
      expect(Object.keys(trie.children)).to.deep.equal([]);
      trie.insert('pizza');
      expect(Object.keys(trie.children)).to.deep.equal(['p']);
      trie.insert('Party');
      expect(Object.keys(trie.children)).to.deep.equal(['p', 'P']);
      })
    })

  describe('suggest', () => {
    
    it('should return a suggestion when the beginning of a word is entered', () => {
      trie.insert('pizza');
      let result = trie.suggest('piz');
      
      expect(result).to.deep.equal(['pizza']);
    });
    
    it('should return an array of words matching the prefix', () => {
      trie.insert('pizza');
      trie.insert('pizzaria');
      trie.insert('apple');
      
      let results = trie.suggest('piz');
      expect(results).to.deep.equal(['pizza', 'pizzaria']);
      
      results = trie.suggest('a');
      expect(results).to.deep.equal(['apple']);
    });

    it('should not suggest a word that does not exist', () => {
      trie.insert('pizza');
      trie.insert('pizzaria');
      trie.insert('apple');

      let results = trie.suggest('pyksdjhf');
      expect(results).to.deep.equal([]);
    })

    it('should not suggest a word that is not in the trie', () => {
      trie.insert('pizza');
      trie.insert('pizzaria');
      trie.insert('apple');

      let results = trie.suggest('piano');
      expect(results).to.deep.equal([]);
    })
  })

  describe('populate', () => {
    it('should insert an array of words', () => {
      let array = ['piano', 'cat', 'dog'];

      expect(trie.wordCount).to.equal(0);
      trie.populate(array);
      expect(trie.wordCount).to.equal(3);
    })

    it('should populate a dictionary of words', () => {
      expect(trie.wordCount).to.equal(0);
      trie.populate(dictionary);
      expect(trie.wordCount).to.equal(235886);

    })

    it('should suggest a wider array of words', () => {
      trie.populate(dictionary);
      let results = trie.suggest('piz');
      expect(results).to.deep.equal(['pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle'])
    })
  })

  describe('select', () => {
    it('should move selected words to the front of the suggestions array', () => {
      trie.insert('piano');
      trie.insert('pizza');
      trie.insert('pizzas');

      let suggestions = trie.suggest('pi');
      
      expect(suggestions[0]).to.equal('piano');

      trie.select('pizza');
      suggestions = trie.suggest('pi');

      expect(suggestions[0]).to.equal('pizza');
    })

    it('should not prioritize a word that is not in the trie', () => {
      trie.insert('piano');
      trie.insert('pizza');
      trie.insert('pizzaria');
      let result = trie.suggest('pi');
      expect(result).to.deep.equal(['piano', 'pizza', 'pizzaria']);
      trie.select('pinterest');
      result = trie.suggest('pi');
      expect(result).to.deep.equal(['piano', 'pizza', 'pizzaria']);
    })
  })

  describe('delete', () => {
    it('should remove a word from suggstions array', () => {
      trie.populate(dictionary);
      let results = trie.suggest('piz');
      expect(results).to.deep.equal(['pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle'])
      trie.delete('pizzle');
      results = trie.suggest('piz');
      expect(results).to.deep.equal(['pize', 'pizza', 'pizzeria', 'pizzicato']);
    })

    it('should not remove a word from an incorrect suggestion', () => {
      trie.insert('pizza');
      trie.insert('pizzas');
      trie.insert('pizzaria');
      
      trie.delete('pizzad');
      
      let results = trie.suggest('piz');
      
      expect(results).to.deep.equal(['pizza', 'pizzas', 'pizzaria']);
    })
  })
})
