const { allocateDiscounts } = require("./discountEngine");
const assert = require("assert");

function testNormalCase() {
  const input = {
    siteKitty: 10000,
    salesAgents: [
      { id: "A1", performanceScore: 90, seniorityMonths: 18, targetAchievedPercent: 85, activeClients: 12 , customerRetentionRate: 95},
      { id: "A2", performanceScore: 70, seniorityMonths: 6, targetAchievedPercent: 60, activeClients: 8 , customerRetentionRate: 70 },
      { id: "A3", performanceScore: 60, seniorityMonths: 10, targetAchievedPercent: 30, activeClients: 5 , customerRetentionRate: 70 },
    ]
  };
  const result = allocateDiscounts(input);
  assert.strictEqual(result.allocations.length, 3);
  const total = result.allocations.reduce((sum, a) => sum + a.assignedDiscount, 0);
  assert.strictEqual(total, 10000);
  console.log(" Normal case passed");
}

function testAllSameScores() {
  const input = {
    siteKitty: 9000,
    salesAgents: [
      { id: "B1", performanceScore: 80, seniorityMonths: 12, targetAchievedPercent: 70, activeClients: 10, customerRetentionRate: 60 },
      { id: "B2", performanceScore: 80, seniorityMonths: 12, targetAchievedPercent: 70, activeClients: 10 , customerRetentionRate: 60},
      { id: "B3", performanceScore: 80, seniorityMonths: 12, targetAchievedPercent: 70, activeClients: 10, customerRetentionRate: 60 }
    ]
  };
  const result = allocateDiscounts(input);
  const amounts = result.allocations.map(a => a.assignedDiscount);
  assert(amounts.every(a => a === 3000));
  console.log(" All-same scores case passed");
}

function testRoundingEdgeCase() {
  const input = {
    siteKitty: 10000,
    salesAgents: [
      { id: "C1", performanceScore: 50, seniorityMonths: 10, targetAchievedPercent: 50, activeClients: 5, customerRetentionRate: 50 },
      { id: "C2", performanceScore: 50, seniorityMonths: 10, targetAchievedPercent: 50, activeClients: 5, customerRetentionRate: 50  },
      { id: "C3", performanceScore: 50, seniorityMonths: 10, targetAchievedPercent: 50, activeClients: 5 , customerRetentionRate: 50 }
    ]
  };
  const result = allocateDiscounts(input);
  const total = result.allocations.reduce((sum, a) => sum + a.assignedDiscount, 0);
  assert.strictEqual(total, 10000);
  console.log(" Rounding edge case passed");
}

// Run all tests
testNormalCase();
testAllSameScores();
testRoundingEdgeCase();
