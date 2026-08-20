/**
 * Seven Nights of the Comet - Unit Tests
 * Simple test framework for game logic
 */

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
    console.log('=== Running Tests ===');
    
    // Test Utils.storage
    this.testStorage();
    
    // Test Utils.clamp
    this.testClamp();
    
    // Test Utils.formatTime
    this.testFormatTime();
    
    // Test Game Config
    this.testConfig();
    
    // Test Story structure
    this.testStory();
    
    console.log(`\n=== Results: ${this.passed} passed, ${this.failed} failed ===`);
    return this.failed === 0;
  },
  
  testStorage() {
    const testKey = 'test_' + Date.now();
    const testValue = { hello: 'world' };
    
    Utils.storage.set(testKey, testValue);
    const retrieved = Utils.storage.get(testKey);
    
    this.assertEquals(retrieved.hello, 'world', 'Storage get/set');
    
    Utils.storage.remove(testKey);
    const removed = Utils.storage.get(testKey);
    this.assertEquals(removed, null, 'Storage remove');
  },
  
  testClamp() {
    this.assertEquals(Utils.clamp(5, 0, 10), 5, 'Clamp within range');
    this.assertEquals(Utils.clamp(-5, 0, 10), 0, 'Clamp below min');
    this.assertEquals(Utils.clamp(15, 0, 10), 10, 'Clamp above max');
  },
  
  testFormatTime() {
    const result = Utils.formatTime(new Date());
    this.assert(typeof result === 'string' && result.length > 0, 'FormatTime returns string');
  },
  
  testConfig() {
    this.assert(GAME_CONFIG.version, 'Config has version');
    this.assert(GAME_CONFIG.assets.bg.station, 'Config has bg assets');
    this.assert(GAME_CONFIG.characters.rio, 'Config has characters');
    this.assertEquals(GAME_CONFIG.balance.totalShards, 3, 'Config shard count');
  },
  
  testStory() {
    this.assert(STORY.prologue, 'Story has prologue');
    this.assert(STORY.prologue.text, 'Prologue has text');
    this.assert(STORY.final_choice.type === 'choice', 'Final choice is choice type');
    this.assert(STORY.ending_rio.type === 'ending', 'Ending has correct type');
  }
};

// Run tests when loaded
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      TestRunner.runAll();
    }, 100);
  });
}

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TestRunner;
}
