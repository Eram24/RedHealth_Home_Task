
const fs = require("fs");
const path = require("path");

function normalize(value, min, max) {
  if (max === min) return 1;
  return (value - min) / (max - min);
}

function calculateScores(agents) {
  
  const metrics = [
    "performanceScore",
    "seniorityMonths",
    "targetAchievedPercent",
    "activeClients",
    "customerRetentionRate" 
  ];
  const mins = {}, maxs = {};

  for (const metric of metrics) {
    mins[metric] = Math.min(...agents.map(a => a[metric]));
    maxs[metric] = Math.max(...agents.map(a => a[metric]));
  }

  return agents.map(agent => {
    let totalScore = 0;
    for (const metric of metrics) {
      totalScore += normalize(agent[metric], mins[metric], maxs[metric]);
    }
    return { ...agent, totalScore };
  });
}

function allocateDiscounts(input, config = {}) {
  const { siteKitty, salesAgents } = input;
  const minPerAgent = config.min || 0;
  const maxPerAgent = config.max || siteKitty;

 if (salesAgents.length === 1) {
    
  // if there is only one salesman
    const amount = Math.min(maxPerAgent, siteKitty);
    return {
      allocations: [{
        id: salesAgents[0].id,
        assignedDiscount: Number(amount.toFixed(2)),
        justification: generateJustification(salesAgents[0])
      }],
      summary: {
        totalAllocated: Number(amount.toFixed(2)),
        remainingKitty: Number((siteKitty - amount).toFixed(2)),
        totalAgents: 1
      }
    }
  }
  
  //if there are more than 1 salesman
  const scoredAgents = calculateScores(salesAgents);
  const totalScore = scoredAgents.reduce((sum, a) => sum + a.totalScore, 0);

  const allocations = scoredAgents.map(agent => {
    let rawAmount = siteKitty * (agent.totalScore / totalScore);
    let amount = Math.min(Math.max(rawAmount, minPerAgent), maxPerAgent);
    amount = Number(amount.toFixed(2)); // Use two decimal places
    return {
      id: agent.id,
      assignedDiscount: amount,
      justification: generateJustification(agent)
    };
  });

  
  let totalAssigned = allocations.reduce((sum, a) => sum + a.assignedDiscount, 0);
  let diff = Number((siteKitty - totalAssigned).toFixed(2));
  if (Math.abs(diff) >= 0.01 && allocations.length > 0) {
    allocations[0].assignedDiscount = Number((allocations[0].assignedDiscount + diff).toFixed(2));
  }

  const remaining = Number((siteKitty - allocations.reduce((s, a) => s + a.assignedDiscount, 0)).toFixed(2));

  return {
    allocations,
    summary: {
      totalAllocated: siteKitty - remaining,
      remainingKitty: remaining,
      totalAgents: allocations.length
    }
  };
}

function generateJustification(agent) {
  if (agent.customerRetentionRate !== undefined && agent.customerRetentionRate > 90 && agent.performanceScore > 85 ) {
    return "High customer retention and strong overall performance";
  }
  if (agent.performanceScore > 85 && agent.seniorityMonths > 12) {
    return "Consistently high performance and long-term contribution";
  }
  if (agent.performanceScore > 70) {
    return "Moderate performance with potential for growth";
  }
  return "Needs improvement but shows potential";
}

function parseCLIArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].substring(2);
      const value = args[i + 1];
      options[key] = value;
      i++;
    }
  }

  return options;
}


if (require.main === module) {
  const { input, config } = parseCLIArgs();

  if (!input) {
    console.error("Please provide an input JSON file .");
    process.exit(1);
  }

  const inputPath = path.resolve(process.cwd(), input);
  const inputData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

  let configData = {};
  if (config) {
    const configPath = path.resolve(process.cwd(), config);
    configData = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  }

  const output = allocateDiscounts(inputData, configData);
  console.log(JSON.stringify(output, null, 2));
  
}

module.exports = { allocateDiscounts };
