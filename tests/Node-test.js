import { expect } from 'chai';
import Node from '../lib/Node';

describe('Node', () => {
  let node;

  beforeEach( () => {
    node = new Node('taco')
  })
  it('should exist', () => {
    expect(node).to.exist
  });

  it('should be able to store child nodes', () => {
    expect(node.children).to.deep.equal({});
  });

  it('should start with the property of completeWord at false', () => {
    expect(node.completeWord).to.equal(false);
  })

  it('should start with a priority of zero', () => {
    expect(node.priority).to.equal(0)
  })
})