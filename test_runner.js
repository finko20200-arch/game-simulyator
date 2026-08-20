// Simple test runner for browser-like environment
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  hasSubresources: false
});

global.window = dom.window;
global.document = dom.window.document;
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = value; },
  removeItem(key) { delete this.store[key]; }
};

// Load game scripts in order - they attach to global/window object
require('./js/config.js');
require('./js/utils.js');
require('./js/story.js');
require('./js/game.js');

// Access globals from window (scripts attach there)
const U = window.Utils;
const GC = window.GAME_CONFIG;
const ST = window.STORY;
const GE = window.GameEngine;

// Run tests
const TestRunner = {
  passed: 0,
  failed: 0,
  
  assert(condition, message) {
    if (condition) {
      this.passed++;
      console.log(`✓ ${message}`);
    } else {
      this.failed++;
      console.error(`✗ ${message}`);
    }
  },
  
  assertEquals(actual, expected, message) {
    this.assert(actual === expected, `${message}: expected ${expected}, got ${actual}`);
  },
  
  runAll() {
    console.log('=== Running Tests ===\n');
    
    this.testStorage();
    this.testClamp();
    this.testFormatTime();
    this.testConfig();
    this.testStory();
    this.testGameEngine();
    
    console.log(`\n=== Results: ${this.passed} passed, ${this.failed} failed ===`);
    return this.failed === 0;
  },
  
  testStorage() {
    console.log('\n--- Storage Tests ---');
    const testKey = 'test_' + Date.now();
    const testValue = { hello: 'world' };
    
    U.storage.set(testKey, testValue);
    const retrieved = U.storage.get(testKey);
    this.assertEquals(retrieved.hello, 'world', 'Storage get/set');
    
    U.storage.remove(testKey);
    const removed = U.storage.get(testKey);
    this.assertEquals(removed, null, 'Storage remove');
  },
  
  testClamp() {
    console.log('\n--- Clamp Tests ---');
    this.assertEquals(U.clamp(5, 0, 10), 5, 'Clamp within range');
    this.assertEquals(U.clamp(-5, 0, 10), 0, 'Clamp below min');
    this.assertEquals(U.clamp(15, 0, 10), 10, 'Clamp above max');
  },
  
  testFormatTime() {
    console.log('\n--- FormatTime Tests ---');
    const result = U.formatTime(new Date());
    this.assert(typeof result === 'string' && result.length > 0, 'FormatTime returns string');
  },
  
  testConfig() {
    console.log('\n--- Config Tests ---');
    this.assert(GC.version, 'Config has version');
    this.assert(GC.assets.bg.station, 'Config has bg assets');
    this.assert(GC.characters.rio, 'Config has characters');
    this.assertEquals(GC.balance.totalShards, 3, 'Config shard count');
    this.assert(Object.isFrozen(GC), 'Config is frozen');
  },
  
  testStory() {
    console.log('\n--- Story Tests ---');
    this.assert(ST.prologue, 'Story has prologue');
    this.assert(ST.prologue.text, 'Prologue has text');
    this.assert(ST.final_choice.type === 'choice', 'Final choice is choice type');
    this.assert(ST.ending_rio.type === 'ending', 'Ending has correct type');
    this.assert(ST.night1_choice.choices.length === 2, 'Night1 has 2 choices');
    
    // Check affinity values
    const choice = ST.night1_choice.choices[0];
    this.assert(choice.affinity.rio === 15, 'Choice has correct affinity');
  },
  
  testGameEngine() {
    console.log('\n--- Game Engine Tests ---');
    
    // Mock DOM elements
    document.body.innerHTML = `
      <div id="stage"></div>
      <div id="bgA"></div>
      <div id="bgB" class="on"></div>
      <div id="spriteLayer"></div>
      <div id="dialog" class="hidden">
        <div id="nameplate"></div>
        <div id="dtext"></div>
        <div id="advMark"></div>
      </div>
      <div id="choices"></div>
      <div id="toasts"></div>
      <div id="menuOv" class="hidden">
        <button id="mAuto"></button>
      </div>
      <div id="statusOv" class="hidden">
        <div id="statusBody"></div>
        <div id="shardRow"></div>
      </div>
      <div id="endOv" class="hidden">
        <div id="endTitle"></div>
        <div id="endLines"></div>
        <div id="endStats"></div>
      </div>
      <div id="shardOv" class="hidden">
        <div id="shardTitle"></div>
        <div id="shardCount"></div>
      </div>
      <button id="btnMenu"></button>
      <button id="btnStatus"></button>
    `;
    
    const game = new GE();
    this.assert(game !== null, 'GameEngine instantiated');
    this.assertEquals(game.state.currentNode, 'prologue', 'Initial node is prologue');
    this.assert(game.state.affinity.rio === 0, 'Initial affinity is 0');
    this.assertEquals(Object.keys(game.state.affinity).length, 3, 'Has 3 characters');
    
    // Test affinity clamping
    game.state.affinity.rio = 150;
    game.state.affinity.rio = U.clamp(game.state.affinity.rio, 0, GC.balance.maxAffinity);
    this.assertEquals(game.state.affinity.rio, 100, 'Affinity clamped to max');
    
    // Test reset
    game.reset();
    this.assertEquals(game.state.currentNode, 'prologue', 'Reset returns to prologue');
  }
};

TestRunner.runAll();
process.exit(TestRunner.failed > 0 ? 1 : 0);
