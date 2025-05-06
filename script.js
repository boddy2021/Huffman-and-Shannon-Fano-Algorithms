class Node {
    constructor(char, freq, left = null, right = null) {
      this.char = char;
      this.freq = freq;
      this.left = left;
      this.right = right;
    }
  }
  
  function buildHuffmanTree(text) {
    const freqMap = {};
    for (let char of text) freqMap[char] = (freqMap[char] || 0) + 1;
  
    let nodes = Object.entries(freqMap).map(([char, freq]) => new Node(char, freq));
    while (nodes.length > 1) {
      nodes.sort((a, b) => a.freq - b.freq);
      let left = nodes.shift(), right = nodes.shift();
      let merged = new Node(null, left.freq + right.freq, left, right);
      nodes.push(merged);
    }
    return nodes[0];
  }
  
  function generateHuffmanCodes(node, prefix = "", codeMap = {}) {
    if (!node) return;
    if (node.char !== null) codeMap[node.char] = prefix;
    generateHuffmanCodes(node.left, prefix + "0", codeMap);
    generateHuffmanCodes(node.right, prefix + "1", codeMap);
    return codeMap;
  }
  
  function buildShannonFanoTree(symbols) {
    if (symbols.length === 1) return [{ char: symbols[0][0], code: "" }];
  
    let total = symbols.reduce((sum, [, freq]) => sum + freq, 0);
    let splitIndex = 0, sum = 0;
  
    for (let i = 0; i < symbols.length; i++) {
      sum += symbols[i][1];
      if (sum >= total / 2) {
        splitIndex = i + 1;
        break;
      }
    }
  
    let left = buildShannonFanoTree(symbols.slice(0, splitIndex)).map(obj => ({
      char: obj.char,
      code: "0" + obj.code
    }));
    let right = buildShannonFanoTree(symbols.slice(splitIndex)).map(obj => ({
      char: obj.char,
      code: "1" + obj.code
    }));
  
    return left.concat(right);
  }
  
  function compress() {
    const text = document.getElementById('inputText').value;
    const algo = document.getElementById('algorithm').value;
    const output = document.getElementById('output');
  
    if (!text.trim()) {
      output.textContent = "Please enter text.";
      return;
    }
  
    if (algo === 'huffman') {
      const tree = buildHuffmanTree(text);
      const codes = generateHuffmanCodes(tree);
      output.textContent = "Huffman Codes:\n" + JSON.stringify(codes, null, 2);
    } else {
      const freqMap = {};
      for (let char of text) freqMap[char] = (freqMap[char] || 0) + 1;
      const sorted = Object.entries(freqMap).sort((a, b) => b[1] - a[1]);
      const codes = buildShannonFanoTree(sorted);
      const codeMap = {};
      codes.forEach(obj => codeMap[obj.char] = obj.code);
      output.textContent = "Shannon-Fano Codes:\n" + JSON.stringify(codeMap, null, 2);
    }
  }
  