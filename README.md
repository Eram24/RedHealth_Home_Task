# Smart Discount Allocation Engine

This project implements a smart discount allocation system to fairly distribute a discount kitty among multiple sales agents based on their performance, seniority, target achievement, active clients, and customerRetentionRate.

##  Features
- Dynamic, fair allocation using normalized metrics
- Modular and extensible JavaScript code
- CLI-compatible structure
- Includes test cases for validation
- Justifiable allocation with explanations

## How to Run


### 1. Run the script
```bash
node discountEngine.js --input=input.json --config=config.json
```

### 2. Run the tests
```bash
node test.js
```

##  Approach

### Step 1: Normalize Metrics
Each agent is evaluated using these five fields:
- `performanceScore`
- `seniorityMonths`
- `targetAchievedPercent`
- `activeClients`
- `customerRetentionRate`

Each metric is normalized on a 0–1 scale to compare fairly across agents.

### Step 2: Calculate Total Score
We sum the normalized scores to get a `totalScore` for each agent.

### Step 3: Proportional Allocation
We divide the kitty based on the share of each agent's score relative to the total score. 

### Step 4: Rounding & Adjustment
Rounding may cause small differences, so we adjust the first agent's value to match the exact kitty total.

### Step 5: Justification
Each agent is assigned a textual justification based on performance and seniority.


## 📋 Sample Output
```
{
  "allocations": [
    {
      "id": "A1",
      "assignedDiscount": 6000,
      "justification": "Consistently high performance and long-term contribution"
    },
    {
      "id": "A2",
      "assignedDiscount": 4000,
      "justification": "Moderate performance with potential for growth"
    }
  ],
  "summary": {
    "totalAllocated": 10000,
    "remainingKitty": 0,
    "totalAgents": 2
  }
}
```

##  Assumptions
- All metric values are positive integers.
- Each agent has valid complete data.
- No agent gets negative or undefined discount.


